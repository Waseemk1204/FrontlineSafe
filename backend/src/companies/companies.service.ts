import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateSiteDto } from './dto/create-site.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        plan: createCompanyDto.plan || 'Starter',
      },
    });
  }

  async findAll(userCompanyId?: string) {
    if (userCompanyId) {
      // Regular users can only see their own company
      return this.prisma.company.findMany({
        where: { id: userCompanyId },
        include: {
          sites: true,
          _count: {
            select: {
              users: true,
              incidents: true,
            },
          },
        },
      });
    }
    // Admins can see all companies
    return this.prisma.company.findMany({
      include: {
        sites: true,
        _count: {
          select: {
            users: true,
            incidents: true,
          },
        },
      },
    });
  }

  async findOne(id: string, userCompanyId?: string) {
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        sites: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    // Enforce row-level security
    if (userCompanyId && company.id !== userCompanyId) {
      throw new ForbiddenException('Access denied');
    }

    return company;
  }

  async createSite(companyId: string, createSiteDto: CreateSiteDto, userCompanyId: string) {
    // Verify user has access to this company
    if (companyId !== userCompanyId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.site.create({
      data: {
        companyId,
        name: createSiteDto.name,
        address: createSiteDto.address,
        coordsLat: createSiteDto.coordsLat,
        coordsLng: createSiteDto.coordsLng,
      },
    });
  }

  async findSites(companyId: string, userCompanyId: string) {
    // Verify user has access to this company
    if (companyId !== userCompanyId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.site.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

