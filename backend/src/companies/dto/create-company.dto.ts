import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { SubscriptionPlan } from '@prisma/client';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Acme Manufacturing' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ enum: SubscriptionPlan, required: false })
  @IsEnum(SubscriptionPlan)
  @IsOptional()
  plan?: SubscriptionPlan;
}

