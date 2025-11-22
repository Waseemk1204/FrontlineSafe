import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
  Min,
  Max,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { IncidentType, IncidentSeverity } from '@prisma/client';

export class CoordsDto {
  @ApiProperty({ example: 40.7128 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: -74.0060 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class CreateIncidentDto {
  @ApiProperty({ required: false, example: 'temp-client-id-123' })
  @IsString()
  @IsOptional()
  clientTempId?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  @IsNotEmpty()
  companyId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  @IsNotEmpty()
  siteId: string;

  @ApiProperty({ required: false })
  @IsUUID()
  @IsOptional()
  reporterId?: string;

  @ApiProperty({ required: false, example: 'John Doe' })
  @IsString()
  @IsOptional()
  reporterName?: string;

  @ApiProperty({ enum: IncidentType, example: IncidentType.hazard })
  @IsEnum(IncidentType)
  @IsNotEmpty()
  type: IncidentType;

  @ApiProperty({ enum: IncidentSeverity, example: IncidentSeverity.medium })
  @IsEnum(IncidentSeverity)
  @IsNotEmpty()
  severity: IncidentSeverity;

  @ApiProperty({ example: 'Spilled liquid on floor near production line 3' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ required: false, type: CoordsDto })
  @IsOptional()
  coords?: CoordsDto;

  @ApiProperty({
    required: false,
    example: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  photos?: string[];

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  createdAt?: string;
}

