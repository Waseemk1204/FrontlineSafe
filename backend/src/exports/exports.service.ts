import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExportsService {
  constructor(private readonly prisma: PrismaService) {}

  async exportIncidentReport(id: string, companyId: string) {
    const [incident, capas] = await Promise.all([
      this.prisma.incident.findFirst({
        where: {
          id,
          companyId, // Enforce row-level security
        },
        include: {
          site: true,
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.capa.findMany({
        where: {
          companyId,
          originType: 'incident',
          originId: id,
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return {
      type: 'incident',
      data: {
        id: incident.id,
        type: incident.type,
        severity: incident.severity,
        status: incident.status,
        description: incident.description,
        location: {
          site: incident.site.name,
          address: incident.site.address,
          coordinates: incident.coordsLat && incident.coordsLng
            ? { lat: incident.coordsLat, lng: incident.coordsLng }
            : null,
        },
        reporter: incident.reporter
          ? {
              name: incident.reporter.name,
              email: incident.reporter.email,
            }
          : { name: incident.reporterName },
        photos: incident.photos || [],
        capas: capas.map((capa) => ({
          id: capa.id,
          title: capa.title,
          status: capa.status,
          owner: capa.owner.name,
        })),
        createdAt: incident.createdAt,
        updatedAt: incident.updatedAt,
      },
    };
  }

  async exportInspectionReport(id: string, companyId: string) {
    const [inspection, capas] = await Promise.all([
      this.prisma.inspection.findFirst({
        where: {
          id,
          companyId, // Enforce row-level security
        },
        include: {
          template: true,
          site: true,
        },
      }),
      this.prisma.capa.findMany({
        where: {
          companyId,
          originType: 'inspection',
          originId: id,
        },
        include: {
          owner: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    if (!inspection) {
      throw new NotFoundException('Inspection not found');
    }

    return {
      type: 'inspection',
      data: {
        id: inspection.id,
        template: {
          name: inspection.template.name,
          description: inspection.template.description,
        },
        site: {
          name: inspection.site.name,
          address: inspection.site.address,
        },
        inspector: {
          id: inspection.inspectorId,
          name: inspection.inspectorName,
        },
        responses: inspection.responses,
        capas: capas.map((capa) => ({
          id: capa.id,
          title: capa.title,
          status: capa.status,
          owner: capa.owner.name,
        })),
        createdAt: inspection.createdAt,
        updatedAt: inspection.updatedAt,
      },
    };
  }
}

