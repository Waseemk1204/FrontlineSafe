import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionTemplateDto } from './dto/create-inspection-template.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { CapaStatus, CapaPriority } from '@prisma/client';

@Injectable()
export class InspectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(createDto: CreateInspectionTemplateDto, companyId?: string) {
    return this.prisma.inspectionTemplate.create({
      data: {
        companyId,
        name: createDto.name,
        description: createDto.description,
        schema: createDto.schema,
        isGlobal: createDto.isGlobal || false,
      },
    });
  }

  async findAllTemplates(companyId?: string) {
    return this.prisma.inspectionTemplate.findMany({
      where: {
        OR: [
          { isGlobal: true },
          { companyId },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findTemplate(id: string) {
    const template = await this.prisma.inspectionTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async create(createDto: CreateInspectionDto, userCompanyId: string) {
    // Enforce company access
    if (createDto.companyId !== userCompanyId) {
      throw new ForbiddenException('Access denied');
    }

    // Verify template exists
    const template = await this.findTemplate(createDto.templateId);

    // Create inspection and auto-create CAPAs for failed items in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Create inspection
      const inspection = await tx.inspection.create({
        data: {
          companyId: createDto.companyId,
          siteId: createDto.siteId,
          templateId: createDto.templateId,
          inspectorId: createDto.inspectorId,
          inspectorName: createDto.inspectorName,
          responses: createDto.responses as any,
        },
      });

      // Find failed items (assuming "no" or "failed" means failed)
      const failedItems = createDto.responses.filter(
        (r) => r.response?.toLowerCase() === 'no' || r.response?.toLowerCase() === 'failed',
      );

      // Auto-create CAPAs for failed items
      const capas = await Promise.all(
        failedItems.map((item) => {
          const templateItem = (template.schema as any).items?.find(
            (i: any) => i.id === item.itemId,
          );

          return tx.capa.create({
            data: {
              companyId: createDto.companyId,
              originType: 'inspection',
              originId: inspection.id,
              title: `CAPA: ${templateItem?.question || 'Failed inspection item'}`,
              description: item.comment || `Failed item: ${item.itemId}`,
              ownerId: createDto.inspectorId,
              creatorId: createDto.inspectorId,
              status: CapaStatus.Open,
              priority: CapaPriority.medium,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            },
          });
        }),
      );

      return { inspection, capas };
    });

    return result;
  }

  async findAll(companyId: string, siteId?: string) {
    const where: any = { companyId };

    if (siteId) {
      where.siteId = siteId;
    }

    return this.prisma.inspection.findMany({
      where,
      include: {
        template: {
          select: {
            id: true,
            name: true,
          },
        },
        site: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const [inspection, capas] = await Promise.all([
      this.prisma.inspection.findFirst({
        where: {
          id,
          companyId, // Enforce row-level security
        },
        include: {
          template: true,
          site: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
        },
      }),
      this.prisma.capa.findMany({
        where: {
          companyId,
          originType: 'inspection',
          originId: id,
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
        },
      }),
    ]);

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    return {
      ...inspection,
      capas,
    };
  }
}

