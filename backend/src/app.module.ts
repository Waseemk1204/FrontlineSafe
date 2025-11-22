import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { IncidentsModule } from './incidents/incidents.module';
import { InspectionsModule } from './inspections/inspections.module';
import { CapasModule } from './capas/capas.module';
import { DocumentsModule } from './documents/documents.module';
import { UploadsModule } from './uploads/uploads.module';
import { MetricsModule } from './metrics/metrics.module';
import { ExportsModule } from './exports/exports.module';
// import { BillingModule } from './billing/billing.module';
// import { NotificationsModule } from './notifications/notifications.module';
import { SyncModule } from './sync/sync.module';
import { AuditModule } from './audit/audit.module';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import s3Config from './config/s3.config';
import jwtConfig from './config/jwt.config';
import appConfig from './config/app.config';
import notificationsConfig from './config/notifications.config';
import stripeConfig from './config/stripe.config';
import capaConfig from './config/capa.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        redisConfig,
        s3Config,
        jwtConfig,
        appConfig,
        notificationsConfig,
        stripeConfig,
        capaConfig,
      ],
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    LoggerModule,
    HealthModule,
    AuthModule,
    CompaniesModule,
    UsersModule,
    IncidentsModule,
    InspectionsModule,
    CapasModule,
    DocumentsModule,
    UploadsModule,
    MetricsModule,
    ExportsModule,
    ExportsModule,
    // BillingModule,
    // NotificationsModule,
    SyncModule,
    AuditModule,
  ],
})
export class AppModule { }
