import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCapaDto } from './dto/create-capa.dto';
import { UpdateCapaDto } from './dto/update-capa.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { CapaStatus } from '@prisma/client';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class CapasService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async create(createDto: CreateCapaDto, companyId: string, creatorId: string) {
    const capa = await this.prisma.capa.create({
      data: {
        companyId,
        originType: createDto.originType,
        originId: createDto.originId,
        title: createDto.title,
        description: createDto.description,
        ownerId: createDto.ownerId,
        creatorId,
        priority: createDto.priority,
        dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
        status: CapaStatus.Open,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    await this.auditService.log({
      companyId,
      userId: creatorId,
      action: 'capa.created',
      entityType: 'capa',
      entityId: capa.id,
      metadata: { title: capa.title, ownerId: capa.ownerId },
    });

    return capa;
  }

  async findAll(companyId: string, status?: CapaStatus, ownerId?: string) {
    const where: any = { companyId };

    if (status) {
      where.status = status;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    return this.prisma.capa.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const capa = await this.prisma.capa.findFirst({
      where: {
        id,
        companyId, // Enforce row-level security
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!capa) {
      throw new NotFoundException('CAPA not found');
    }

    return capa;
  }

  async update(id: string, companyId: string, updateDto: UpdateCapaDto, userId: string) {
    const capa = await this.findOne(id, companyId);

    const oldStatus = capa.status;
    const updates: any = {};

    if (updateDto.title) updates.title = updateDto.title;
    if (updateDto.description) updates.description = updateDto.description;
    if (updateDto.status) updates.status = updateDto.status;
    if (updateDto.ownerId) updates.ownerId = updateDto.ownerId;
    if (updateDto.priority) updates.priority = updateDto.priority;
    if (updateDto.dueDate) updates.dueDate = new Date(updateDto.dueDate);

    if (updateDto.status === CapaStatus.Closed) {
      updates.completedAt = new Date();
    }

    const updated = await this.prisma.capa.update({
      where: { id },
      data: updates,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log status change
    if (updateDto.status && updateDto.status !== oldStatus) {
      await this.auditService.log({
        companyId,
        userId,
        action: 'capa.status_changed',
        entityType: 'capa',
        entityId: id,
        metadata: { oldStatus, newStatus: updateDto.status },
      });
    }

    // Add comment if provided
    if (updateDto.comment) {
      await this.addComment(id, companyId, { content: updateDto.comment }, userId);
    }

    return updated;
  }

  async addComment(capaId: string, companyId: string, commentDto: AddCommentDto, userId: string) {
    // Verify CAPA exists and belongs to company
    await this.findOne(capaId, companyId);

    const comment = await this.prisma.capaComment.create({
      data: {
        capaId,
        userId,
        content: commentDto.content,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    await this.auditService.log({
      companyId,
      userId,
      action: 'capa.comment_added',
      entityType: 'capa',
      entityId: capaId,
      metadata: { commentId: comment.id },
    });

    return comment;
  }

  async addAttachment(
    capaId: string,
    companyId: string,
    fileUrl: string,
    fileName: string,
    fileSize: number,
    mimeType: string,
    userId: string,
  ) {
    // Verify CAPA exists
    await this.findOne(capaId, companyId);

    const attachment = await this.prisma.capaAttachment.create({
      data: {
        capaId,
        fileUrl,
        fileName,
        fileSize,
        mimeType,
        uploadedBy: userId,
      },
    });

    await this.auditService.log({
      companyId,
      userId,
      action: 'capa.attachment_added',
      entityType: 'capa',
      entityId: capaId,
      metadata: { attachmentId: attachment.id, fileName },
    });

    return attachment;
  }
}

