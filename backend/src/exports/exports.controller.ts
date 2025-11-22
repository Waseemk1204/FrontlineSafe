import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExportsService } from './exports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('exports')
@Controller('export')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportsController {
  constructor(private readonly exportsService: ExportsService) {}

  @Get('report/:id')
  @ApiOperation({ summary: 'Export incident or inspection report' })
  @ApiResponse({ status: 200, description: 'Report data for printing' })
  async exportReport(@Param('id') id: string, @CurrentUser() user: any) {
    // Try incident first
    try {
      return await this.exportsService.exportIncidentReport(id, user.companyId);
    } catch (error) {
      // If not found, try inspection
      if (error instanceof Error && error.message.includes('not found')) {
        return await this.exportsService.exportInspectionReport(id, user.companyId);
      }
      throw error;
    }
  }
}

