import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueueAsync({
      name: 'notifications',
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const redisConfig = configService.get('redis');
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
            // Use defaults
          }
        }
        
        return {
          connection: {
            host,
            port,
            password,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            enableReadyCheck: false,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}

