import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { FilterIncidentsDto } from './dto/filter-incidents.dto';
import { IncidentSeverity } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class IncidentsService {
  constructor(
    private readonly prisma: PrismaService,
    // @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) { }

  async create(createIncidentDto: CreateIncidentDto, userCompanyId: string) {
    // Enforce company access
    if (createIncidentDto.companyId !== userCompanyId) {
      throw new ForbiddenException('Access denied');
    }

    // Check for duplicate clientTempId
    if (createIncidentDto.clientTempId) {
      const existing = await this.prisma.incident.findUnique({
        where: {
          companyId_clientTempId: {
            companyId: createIncidentDto.companyId,
            clientTempId: createIncidentDto.clientTempId,
          },
        },
      });

      if (existing) {
        // Return existing incident (idempotent)
        return {
          clientTempId: createIncidentDto.clientTempId,
          incident: existing,
        };
      }
    }

    const incident = await this.prisma.incident.create({
      data: {
        companyId: createIncidentDto.companyId,
        siteId: createIncidentDto.siteId,
        reporterId: createIncidentDto.reporterId,
        reporterName: createIncidentDto.reporterName,
        type: createIncidentDto.type,
        severity: createIncidentDto.severity,
        description: createIncidentDto.description,
        coordsLat: createIncidentDto.coords?.lat,
        coordsLng: createIncidentDto.coords?.lng,
        photos: createIncidentDto.photos || [],
        clientTempId: createIncidentDto.clientTempId,
        syncedFromClientId: createIncidentDto.clientTempId,
        status: 'new',
        createdAt: createIncidentDto.createdAt ? new Date(createIncidentDto.createdAt) : undefined,
      },
      include: {
        site: {
          select: {
            id: true,
            name: true,
          },
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Enqueue notification job for high-severity incidents
    /*
    if (incident.severity === IncidentSeverity.high) {
      await this.notificationsQueue.add('high-severity-incident', {
        incidentId: incident.id,
        companyId: incident.companyId,
        severity: incident.severity,
        type: incident.type,
        description: incident.description,
      });
    }
    */

    return {
      clientTempId: createIncidentDto.clientTempId,
      incident,
    };
  }

  async findAll(filterDto: FilterIncidentsDto, userCompanyId: string) {
    const where: any = {
      companyId: filterDto.companyId || userCompanyId, // Enforce row-level security
    };

    if (filterDto.siteId) {
      where.siteId = filterDto.siteId;
    }

    if (filterDto.status) {
      where.status = filterDto.status;
    }

    if (filterDto.from || filterDto.to) {
      where.createdAt = {};
      if (filterDto.from) {
        where.createdAt.gte = new Date(filterDto.from);
      }
      if (filterDto.to) {
        where.createdAt.lte = new Date(filterDto.to);
      }
    }

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 20;
    const skip = (page - 1) * limit;

    const [incidents, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: {
          site: {
            select: {
              id: true,
              name: true,
            },
          },
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.incident.count({ where }),
    ]);

    return {
      data: incidents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userCompanyId: string) {
    const [incident, capas] = await Promise.all([
      this.prisma.incident.findFirst({
        where: {
          id,
          companyId: userCompanyId, // Enforce row-level security
        },
        include: {
          site: {
            select: {
              id: true,
              name: true,
              address: true,
            },
          },
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
          companyId: userCompanyId,
          originType: 'incident',
          originId: id,
        },
        select: {
          id: true,
          title: true,
          status: true,
        },
      }),
    ]);

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return {
      ...incident,
      capas,
    };
  }
}

