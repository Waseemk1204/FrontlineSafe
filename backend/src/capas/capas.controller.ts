import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { CapasService } from './capas.service';
import { CreateCapaDto } from './dto/create-capa.dto';
import { UpdateCapaDto } from './dto/update-capa.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CapaStatus } from '@prisma/client';

@ApiTags('capas')
@Controller('capas')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CapasController {
  constructor(private readonly capasService: CapasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new CAPA' })
  @ApiResponse({ status: 201, description: 'CAPA created successfully' })
  async create(@Body() createDto: CreateCapaDto, @CurrentUser() user: any) {
    return this.capasService.create(createDto, user.companyId, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all CAPAs' })
  @ApiResponse({ status: 200, description: 'List of CAPAs' })
  async findAll(
    @Query('status') status: CapaStatus,
    @Query('ownerId') ownerId: string,
    @CurrentUser() user: any,
  ) {
    return this.capasService.findAll(user.companyId, status, ownerId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get CAPA by ID' })
  @ApiResponse({ status: 200, description: 'CAPA details' })
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.capasService.findOne(id, user.companyId);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update CAPA' })
  @ApiResponse({ status: 200, description: 'CAPA updated successfully' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCapaDto,
    @CurrentUser() user: any,
  ) {
    return this.capasService.update(id, user.companyId, updateDto, user.id);
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add comment to CAPA' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  async addComment(
    @Param('id') id: string,
    @Body() commentDto: AddCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.capasService.addComment(id, user.companyId, commentDto, user.id);
  }

  @Post(':id/attachments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add attachment to CAPA' })
  @ApiResponse({ status: 201, description: 'Attachment added successfully' })
  async addAttachment(
    @Param('id') id: string,
    @Body() body: { fileUrl: string; fileName: string; fileSize?: number; mimeType?: string },
    @CurrentUser() user: any,
  ) {
    return this.capasService.addAttachment(
      id,
      user.companyId,
      body.fileUrl,
      body.fileName,
      body.fileSize,
      body.mimeType,
      user.id,
    );
  }
}

