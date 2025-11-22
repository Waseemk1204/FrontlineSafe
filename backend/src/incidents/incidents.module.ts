import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { IncidentsService } from './incidents.service';
import { IncidentsController } from './incidents.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PrismaModule,
    /*
    BullModule.registerQueueAsync({
      name: 'notifications',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
        // Parse Redis URL if provided
        let host = redisConfig.host || 'localhost';
        let port = redisConfig.port || 6379;
        let password = redisConfig.password;
        
        if (redisConfig.url) {
          try {
            const url = new URL(redisConfig.url);
            host = url.hostname;
            port = parseInt(url.port) || 6379;
            password = url.password || password;
          } catch (e) {
            // Use defaults if URL parsing fails
          }
        }
        
        return {
          connection: {
            host,
            port,
            password,
            lazyConnect: true,
            enableReadyCheck: false,
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
              if (times > 3) return null;
              return Math.min(times * 200, 2000);
            },
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
    */
  ],
  controllers: [IncidentsController],
  providers: [IncidentsService],
  exports: [IncidentsService],
})
export class IncidentsModule { }

