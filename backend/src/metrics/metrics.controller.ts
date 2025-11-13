import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { IsOptional, IsDateString } from 'class-validator';

class FilterMetricsDto {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

@ApiTags('metrics')
@Controller('metrics')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @ApiOperation({ summary: 'Get company metrics and KPIs' })
  @ApiResponse({ status: 200, description: 'Metrics data' })
  async getMetrics(@Query() filterDto: FilterMetricsDto, @CurrentUser() user: any) {
    return this.metricsService.getMetrics(
      user.companyId,
      filterDto.from ? new Date(filterDto.from) : undefined,
      filterDto.to ? new Date(filterDto.to) : undefined,
    );
  }
}

