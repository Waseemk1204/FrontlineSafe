import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { NotificationProcessor } from './notification.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => BillingModule),
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
            maxRetriesPerRequest: 3,
            retryStrategy: (times) => {
              if (times > 3) return null;
              return Math.min(times * 200, 2000);
            },
            lazyConnect: true, // Don't connect immediately
            enableReadyCheck: false, // Don't wait for ready
          },
          defaultJobOptions: {
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
  providers: [NotificationsService, NotificationProcessor],
  exports: [NotificationsService],
})
export class NotificationsModule {}
