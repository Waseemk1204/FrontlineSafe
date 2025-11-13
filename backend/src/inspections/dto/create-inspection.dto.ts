import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUUID, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class InspectionItemResponseDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  response: string; // "yes", "no", "na", etc.

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photoUrls?: string[];
}

export class CreateInspectionDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  siteId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  inspectorId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  inspectorName?: string;

  @ApiProperty({ type: [InspectionItemResponseDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InspectionItemResponseDto)
  @IsNotEmpty()
  responses: InspectionItemResponseDto[];
}

