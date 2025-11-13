import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private redis: Redis;
  private ttl: number;
  private max: number;

  constructor(private readonly configService: ConfigService) {
    const redisConfig = this.configService.get('redis');
    this.redis = new Redis(redisConfig.url);
    this.ttl = parseInt(process.env.RATE_LIMIT_TTL || '60', 10);
    this.max = parseInt(process.env.RATE_LIMIT_MAX || '100', 10);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const key = request.user?.id || request.ip || 'anonymous';
    const redisKey = `rate_limit:${key}`;

    const current = await this.redis.incr(redisKey);
    
    if (current === 1) {
      await this.redis.expire(redisKey, this.ttl);
    }

    if (current > this.max) {
      return false;
    }

    return true;
  }
}

