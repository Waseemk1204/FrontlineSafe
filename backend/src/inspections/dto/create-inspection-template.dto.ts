import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsBoolean } from 'class-validator';

export class CreateInspectionTemplateDto {
  @ApiProperty({ example: 'Daily Safety Walkthrough' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false, example: 'Standard daily safety inspection checklist' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: { items: [] } })
  @IsObject()
  @IsNotEmpty()
  schema: any;

  @ApiProperty({ required: false, default: false })
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;
}

