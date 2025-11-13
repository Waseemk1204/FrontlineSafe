import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SyncService, SyncItem } from './sync.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

class BulkSyncDto {
  items: SyncItem[];
}

@ApiTags('sync')
@Controller('sync')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post()
  @ApiOperation({ summary: 'Bulk sync offline items' })
  @ApiResponse({ status: 200, description: 'Items synced successfully' })
  async bulkSync(@Body() dto: BulkSyncDto, @CurrentUser() user: any) {
    return this.syncService.bulkSync(dto.items, user.companyId);
  }
}

