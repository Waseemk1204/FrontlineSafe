import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { CreateSiteDto } from './dto/create-site.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('companies')
@Controller('companies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new company (Admin only)' })
  @ApiResponse({ status: 201, description: 'Company created successfully' })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies (filtered by user access)' })
  @ApiResponse({ status: 200, description: 'List of companies' })
  async findAll(@CurrentUser() user: any) {
    return this.companiesService.findAll(user?.role === UserRole.ADMIN ? undefined : user?.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiResponse({ status: 200, description: 'Company details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.companiesService.findOne(id, user?.companyId);
  }

  @Post(':companyId/sites')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new site for a company' })
  @ApiResponse({ status: 201, description: 'Site created successfully' })
  async createSite(
    @Param('companyId') companyId: string,
    @Body() createSiteDto: CreateSiteDto,
    @CurrentUser() user: any,
  ) {
    return this.companiesService.createSite(companyId, createSiteDto, user.companyId);
  }

  @Get(':companyId/sites')
  @ApiOperation({ summary: 'Get all sites for a company' })
  @ApiResponse({ status: 200, description: 'List of sites' })
  async findSites(@Param('companyId') companyId: string, @CurrentUser() user: any) {
    return this.companiesService.findSites(companyId, user.companyId);
  }
}

