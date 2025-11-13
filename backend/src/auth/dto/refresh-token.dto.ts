import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ required: false, example: 'refresh-token-string' })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}

