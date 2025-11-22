import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Failed to connect to database:', error.message);
      // Don't throw - let the app start and retry later
      // In production, you might want to exit here
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

