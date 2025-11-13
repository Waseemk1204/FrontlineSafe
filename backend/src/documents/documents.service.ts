import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateDocumentDto {
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  tags?: string[];
  description?: string;
}

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateDocumentDto, companyId: string, uploadedBy: string) {
    // Check for existing document with same title to determine version
    const existing = await this.prisma.document.findFirst({
      where: {
        companyId,
        title: createDto.title,
      },
      orderBy: { version: 'desc' },
    });

    const version = existing ? existing.version + 1 : 1;

    return this.prisma.document.create({
      data: {
        companyId,
        title: createDto.title,
        version,
        fileUrl: createDto.fileUrl,
        fileName: createDto.fileName,
        fileSize: createDto.fileSize,
        mimeType: createDto.mimeType,
        tags: createDto.tags || [],
        description: createDto.description,
        uploadedBy,
      },
    });
  }

  async findAll(companyId: string, title?: string) {
    const where: any = { companyId };

    if (title) {
      where.title = { contains: title, mode: 'insensitive' };
    }

    return this.prisma.document.findMany({
      where,
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [{ title: 'asc' }, { version: 'desc' }],
    });
  }

  async findOne(id: string, companyId: string) {
    const document = await this.prisma.document.findFirst({
      where: {
        id,
        companyId, // Enforce row-level security
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      throw new NotFoundException('Document not found');
    }

    return document;
  }

  async findByTitle(title: string, companyId: string) {
    return this.prisma.document.findMany({
      where: {
        companyId,
        title,
      },
      orderBy: { version: 'desc' },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }
}

