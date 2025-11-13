import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { CapaStatus, CapaPriority } from '@prisma/client';

export class UpdateCapaDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CapaStatus, required: false })
  @IsEnum(CapaStatus)
  @IsOptional()
  status?: CapaStatus;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiProperty({ enum: CapaPriority, required: false })
  @IsEnum(CapaPriority)
  @IsOptional()
  priority?: CapaPriority;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}

