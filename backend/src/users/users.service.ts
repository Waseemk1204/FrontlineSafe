import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(companyId: string) {
    return this.prisma.user.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, companyId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        companyId, // Enforce row-level security
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, companyId: string, updateUserDto: UpdateUserDto, currentUserRole: string) {
    // Check if user exists and belongs to company
    const user = await this.findOne(id, companyId);

    // Only admins can change roles
    if (updateUserDto.role && currentUserRole !== 'ADMIN') {
      throw new ForbiddenException('Only admins can change user roles');
    }

    // Prevent self-deactivation
    if (updateUserDto.isActive === false && id === companyId) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string, companyId: string) {
    // Check if user exists
    await this.findOne(id, companyId);

    // Don't allow deleting yourself
    // This would need the current user ID passed in

    return this.prisma.user.delete({
      where: { id },
    });
  }
}

