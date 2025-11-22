import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CapaStatus } from '@prisma/client';

@Injectable()
export class EscalationProcessor {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    // @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) { }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCapaEscalation() {
    const capaConfig = this.configService.get('capa');
    const reminderDaysBefore = capaConfig.reminderDaysBefore;
    const escalationDaysAfter = capaConfig.escalationDaysAfter;

    const now = new Date();
    const reminderThreshold = new Date(now.getTime() + reminderDaysBefore * 24 * 60 * 60 * 1000);
    const escalationThreshold = new Date(now.getTime() - escalationDaysAfter * 24 * 60 * 60 * 1000);

    // Find CAPAs due soon (for reminders)
    const capasDueSoon = await this.prisma.capa.findMany({
      where: {
        status: {
          not: CapaStatus.Closed,
        },
        dueDate: {
          lte: reminderThreshold,
          gte: now,
        },
      },
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });

    // Send reminders
    /*
    for (const capa of capasDueSoon) {
      await this.notificationsQueue.add('capa-reminder', {
        capaId: capa.id,
        ownerEmail: capa.owner.email,
        capaTitle: capa.title,
        dueDate: capa.dueDate,
      });
    }
    */

    // Find overdue CAPAs (for escalation)
    const overdueCapas = await this.prisma.capa.findMany({
      where: {
        status: {
          not: CapaStatus.Closed,
        },
        dueDate: {
          lt: escalationThreshold,
        },
      },
      include: {
        owner: {
          select: {
            email: true,
          },
        },
      },
    });

    // Send escalations
    /*
    for (const capa of overdueCapas) {
      const daysOverdue = Math.floor(
        (now.getTime() - capa.dueDate!.getTime()) / (24 * 60 * 60 * 1000),
      );

      await this.notificationsQueue.add('capa-escalation', {
        capaId: capa.id,
        ownerEmail: capa.owner.email,
        capaTitle: capa.title,
        daysOverdue,
      });
    }
    */

    return {
      remindersSent: capasDueSoon.length,
      escalationsSent: overdueCapas.length,
    };
  }
}

