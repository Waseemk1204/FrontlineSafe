import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class HealthService {
  private redis: Redis;
  private s3Client: S3Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    try {
      const redisConfig = this.configService.get('redis');
      if (redisConfig?.url) {
        this.redis = new Redis(redisConfig.url, {
          retryStrategy: () => null, // Don't retry on connection failure
          maxRetriesPerRequest: 1,
          lazyConnect: true,
          connectTimeout: 5000,
          enableOfflineQueue: false,
        });
      }
    } catch (error) {
      console.warn('Redis initialization failed (non-critical):', error.message);
    }

    try {
      const s3Config = this.configService.get('s3');
      this.s3Client = new S3Client({
        region: s3Config.region,
        credentials: s3Config.accessKeyId
          ? {
              accessKeyId: s3Config.accessKeyId,
              secretAccessKey: s3Config.secretAccessKey,
            }
          : undefined,
        endpoint: s3Config.endpoint,
        forcePathStyle: s3Config.forcePathStyle,
      });
    } catch (error) {
      console.warn('S3 initialization failed:', error.message);
    }
  }

  async check() {
    const checks = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: await this.checkDatabase(),
        redis: await this.checkRedis(),
        s3: await this.checkS3(),
      },
    };

    const allHealthy = Object.values(checks.services).every((s) => s.status === 'ok');
    checks.status = allHealthy ? 'ok' : 'degraded';

    return checks;
  }

  private async checkDatabase(): Promise<{ status: string; message?: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  private async checkRedis(): Promise<{ status: string; message?: string }> {
    try {
      if (!this.redis) {
        return { status: 'error', message: 'Redis client not initialized' };
      }
      await this.redis.ping();
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  private async checkS3(): Promise<{ status: string; message?: string }> {
    try {
      // Just check if client is configured, not actual S3 access
      if (!this.s3Client) {
        return { status: 'error', message: 'S3 client not configured' };
      }
      return { status: 'ok' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

