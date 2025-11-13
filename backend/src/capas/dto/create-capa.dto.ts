import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { CapaPriority } from '@prisma/client';

export class CreateCapaDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  ownerId: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @ApiProperty({ enum: CapaPriority, required: false })
  @IsEnum(CapaPriority)
  @IsOptional()
  priority?: CapaPriority;

  @ApiProperty({ example: 'incident' })
  @IsString()
  @IsNotEmpty()
  originType: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  originId: string;
}

