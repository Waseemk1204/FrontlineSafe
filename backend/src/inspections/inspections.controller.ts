import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { InspectionsService } from './inspections.service';
import { CreateInspectionTemplateDto } from './dto/create-inspection-template.dto';
import { CreateInspectionDto } from './dto/create-inspection.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('inspections')
@Controller('inspections')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Post('templates')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inspection template (Admin/Manager only)' })
  @ApiResponse({ status: 201, description: 'Template created successfully' })
  async createTemplate(
    @Body() createDto: CreateInspectionTemplateDto,
    @CurrentUser() user: any,
  ) {
    return this.inspectionsService.createTemplate(createDto, user.companyId);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get all inspection templates' })
  @ApiResponse({ status: 200, description: 'List of templates' })
  async findAllTemplates(@CurrentUser() user: any) {
    return this.inspectionsService.findAllTemplates(user.companyId);
  }

  @Get('templates/:id')
  @ApiOperation({ summary: 'Get inspection template by ID' })
  @ApiResponse({ status: 200, description: 'Template details' })
  async findTemplate(@Param('id') id: string) {
    return this.inspectionsService.findTemplate(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create inspection instance' })
  @ApiResponse({ status: 201, description: 'Inspection created successfully' })
  async create(@Body() createDto: CreateInspectionDto, @CurrentUser() user: any) {
    return this.inspectionsService.create(createDto, user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all inspections' })
  @ApiResponse({ status: 200, description: 'List of inspections' })
  async findAll(@Query('siteId') siteId: string, @CurrentUser() user: any) {
    return this.inspectionsService.findAll(user.companyId, siteId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inspection by ID' })
  @ApiResponse({ status: 200, description: 'Inspection details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.inspectionsService.findOne(id, user.companyId);
  }
}

