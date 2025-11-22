import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { BillingService } from '../billing/billing.service';

@Processor('notifications')
@Injectable()
export class NotificationProcessor extends WorkerHost {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => BillingService))
    private readonly billingService: BillingService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'high-severity-incident':
        return this.handleHighSeverityIncident(job.data);
      case 'capa-reminder':
        return this.handleCapaReminder(job.data);
      case 'capa-escalation':
        return this.handleCapaEscalation(job.data);
      case 'stripe-webhook':
        return this.handleStripeWebhook(job.data);
      default:
        throw new Error(`Unknown job type: ${job.name}`);
    }
  }

  private async handleHighSeverityIncident(data: any) {
    const { incidentId, companyId, severity, type, description } = data;

    // Get company for Slack webhook
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    // Send Slack notification if configured
    if (company) {
      // In production, store Slack webhook per company
      const slackWebhook = process.env.SLACK_WEBHOOK_URL;
      if (slackWebhook) {
        await this.notificationsService.sendSlackNotification(
          slackWebhook,
          `🚨 HIGH SEVERITY INCIDENT\nType: ${type}\nSeverity: ${severity}\nDescription: ${description}\nIncident ID: ${incidentId}`,
        );
      }
    }

    return { success: true };
  }

  private async handleCapaReminder(data: any) {
    const { capaId, ownerEmail, capaTitle, dueDate } = data;
    await this.notificationsService.sendCapaReminderEmail(ownerEmail, capaTitle, dueDate);
    return { success: true };
  }

  private async handleCapaEscalation(data: any) {
    const { capaId, ownerEmail, capaTitle, daysOverdue } = data;
    await this.notificationsService.sendCapaEscalationEmail(ownerEmail, capaTitle, daysOverdue);
    return { success: true };
  }

  private async handleStripeWebhook(data: any) {
    // Reconstruct Stripe event from job data
    const { eventType, eventData } = data;
    const event = {
      type: eventType,
      data: { object: eventData.object },
    } as any;
    
    await this.billingService.handleWebhook(event);
    return { success: true };
  }
}

