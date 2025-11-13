import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateSiteDto {
  @ApiProperty({ example: 'Main Production Facility' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Industrial Blvd, City, State 12345', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ example: 40.7128, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  coordsLat?: number;

  @ApiProperty({ example: -74.0060, required: false })
  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  coordsLng?: number;
}

