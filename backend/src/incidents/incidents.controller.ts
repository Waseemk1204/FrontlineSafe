import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { FilterIncidentsDto } from './dto/filter-incidents.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('incidents')
@Controller('incidents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new incident' })
  @ApiResponse({ status: 201, description: 'Incident created successfully' })
  async create(@Body() createIncidentDto: CreateIncidentDto, @CurrentUser() user: any) {
    return this.incidentsService.create(createIncidentDto, user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all incidents with filters' })
  @ApiResponse({ status: 200, description: 'List of incidents' })
  async findAll(@Query() filterDto: FilterIncidentsDto, @CurrentUser() user: any) {
    return this.incidentsService.findAll(filterDto, user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get incident by ID' })
  @ApiResponse({ status: 200, description: 'Incident details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.incidentsService.findOne(id, user.companyId);
  }
}

