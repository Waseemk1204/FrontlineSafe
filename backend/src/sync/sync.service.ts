import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from '../incidents/dto/create-incident.dto';

export interface SyncItem {
  type: 'incident' | 'inspection';
  clientTempId: string;
  data: any;
}

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async bulkSync(items: SyncItem[], companyId: string) {
    const mappings: Array<{ clientTempId: string; serverId: string }> = [];

    // Process each item in transaction
    for (const item of items) {
      try {
        if (item.type === 'incident') {
          const result = await this.syncIncident(item, companyId);
          if (result) {
            mappings.push({
              clientTempId: item.clientTempId,
              serverId: result.id,
            });
          }
        }
        // Add other types as needed
      } catch (error) {
        console.error(`Error syncing item ${item.clientTempId}:`, error);
        // Continue with other items
      }
    }

    return { mappings };
  }

  private async syncIncident(item: SyncItem, companyId: string) {
    // Check for existing incident with same clientTempId
    const existing = await this.prisma.incident.findUnique({
      where: {
        companyId_clientTempId: {
          companyId,
          clientTempId: item.clientTempId,
        },
      },
    });

    if (existing) {
      return existing; // Idempotent - return existing
    }

    // Create new incident
    const incidentData = item.data as CreateIncidentDto;
    
    // Enforce company access
    if (incidentData.companyId !== companyId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.incident.create({
      data: {
        companyId: incidentData.companyId,
        siteId: incidentData.siteId,
        reporterId: incidentData.reporterId,
        reporterName: incidentData.reporterName,
        type: incidentData.type,
        severity: incidentData.severity,
        description: incidentData.description,
        coordsLat: incidentData.coords?.lat,
        coordsLng: incidentData.coords?.lng,
        photos: incidentData.photos || [],
        clientTempId: item.clientTempId,
        syncedFromClientId: item.clientTempId,
        status: 'new',
        createdAt: incidentData.createdAt ? new Date(incidentData.createdAt) : undefined,
      },
    });
  }
}

