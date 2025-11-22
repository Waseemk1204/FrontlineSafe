import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MetricsService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(companyId: string, from?: Date, to?: Date) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    const fromDate = from || ninetyDaysAgo;
    const toDate = to || now;

    const where = {
      companyId,
      createdAt: {
        gte: fromDate,
        lte: toDate,
      },
    };

    // Total incidents (30d, 90d)
    const [incidents30d, incidents90d, totalIncidents] = await Promise.all([
      this.prisma.incident.count({
        where: {
          companyId,
          createdAt: {
            gte: thirtyDaysAgo,
            lte: now,
          },
        },
      }),
      this.prisma.incident.count({
        where: {
          companyId,
          createdAt: {
            gte: ninetyDaysAgo,
            lte: now,
          },
        },
      }),
      this.prisma.incident.count({ where }),
    ]);

    // Open CAPAs
    const openCapas = await this.prisma.capa.count({
      where: {
        companyId,
        status: { not: 'Closed' },
      },
    });

    // Inspections completed
    const inspectionsCompleted = await this.prisma.inspection.count({ where });

    // Top hazard types
    const incidentTypes = await this.prisma.incident.groupBy({
      by: ['type'],
      where,
      _count: {
        type: true,
      },
      orderBy: {
        _count: {
          type: 'desc' as any,
        },
      },
      take: 5,
    });

    // Near-miss ratio
    const [nearMisses, totalIncidentsForRatio] = await Promise.all([
      this.prisma.incident.count({
        where: {
          ...where,
          type: 'near_miss',
        },
      }),
      this.prisma.incident.count({ where }),
    ]);

    const nearMissRatio = totalIncidentsForRatio > 0 ? nearMisses / totalIncidentsForRatio : 0;

    return {
      kpis: {
        incidents30d,
        incidents90d,
        totalIncidents,
        openCapas,
        inspectionsCompleted,
        nearMissRatio: Math.round(nearMissRatio * 100) / 100,
      },
      charts: {
        topHazardTypes: incidentTypes.map((item) => ({
          type: item.type,
          count: item._count.type,
        })),
      },
    };
  }
}

