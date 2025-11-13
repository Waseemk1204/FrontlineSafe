import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueueAsync({
      name: 'notifications',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        const redisUrl = redisConfig.url || `redis://${redisConfig.host}:${redisConfig.port}`;
        return {
          connection: {
            host: redisConfig.host || 'localhost',
            port: redisConfig.port || 6379,
            password: redisConfig.password,
            lazyConnect: true,
            enableReadyCheck: false,
          },
          defaultJobOptions: {
            removeOnComplete: 100,
            removeOnFail: 50,
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule {}

