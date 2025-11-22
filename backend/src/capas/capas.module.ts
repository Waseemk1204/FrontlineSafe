import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CapasService } from './capas.service';
import { CapasController } from './capas.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';
import { EscalationProcessor } from './escalation.processor';

@Module({
  imports: [
    PrismaModule,
    AuditModule,
    /*
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
            lazyConnect: true,
            enableReadyCheck: false,
          },
        };
      },
      inject: [ConfigService],
    }),
    */
  ],
  controllers: [CapasController],
  providers: [CapasService, EscalationProcessor],
  exports: [CapasService],
})
export class CapasModule { }
