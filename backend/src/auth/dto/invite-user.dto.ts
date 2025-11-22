import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsArray, ArrayMinSize } from 'class-validator';
import { UserRole } from '@prisma/client';

export class InviteUserDto {
  @ApiProperty({ example: ['user1@example.com', 'user2@example.com'] })
  @IsArray()
  @ArrayMinSize(1)
  @IsEmail({}, { each: true })
  emails: string[];

  @ApiProperty({ enum: UserRole, example: UserRole.WORKER })
  @IsEnum(UserRole)
  role: UserRole;
}

