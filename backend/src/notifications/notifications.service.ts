import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class NotificationsService {
  private sendgridConfigured = false;

  constructor(private readonly configService: ConfigService) {
    const sendgridConfig = this.configService.get('notifications.sendgrid');
    if (sendgridConfig?.apiKey) {
      sgMail.setApiKey(sendgridConfig.apiKey);
      this.sendgridConfigured = true;
    }
  }

  async sendInviteEmail(email: string, token: string, companyId: string) {
    if (!this.sendgridConfigured) {
      console.log(`[Email] Invite email would be sent to ${email} with token ${token}`);
      return;
    }

    const sendgridConfig = this.configService.get('notifications.sendgrid');
    const inviteUrl = `${process.env.FRONTEND_ORIGIN}/accept-invite?token=${token}`;

    const msg = {
      to: email,
      from: {
        email: sendgridConfig.fromEmail,
        name: sendgridConfig.fromName,
      },
      subject: 'You have been invited to join FrontlineSafe',
      html: `
        <h2>You've been invited to join FrontlineSafe</h2>
        <p>Click the link below to accept your invitation and complete your account setup:</p>
        <p><a href="${inviteUrl}">Accept Invitation</a></p>
        <p>This link will expire in 7 days.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending invite email:', error);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, token: string) {
    if (!this.sendgridConfigured) {
      console.log(`[Email] Password reset email would be sent to ${email} with token ${token}`);
      return;
    }

    const sendgridConfig = this.configService.get('notifications.sendgrid');
    const resetUrl = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${token}`;

    const msg = {
      to: email,
      from: {
        email: sendgridConfig.fromEmail,
        name: sendgridConfig.fromName,
      },
      subject: 'Reset your FrontlineSafe password',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  async sendSlackNotification(webhookUrl: string, message: string) {
    if (!webhookUrl) {
      console.log(`[Slack] Notification would be sent: ${message}`);
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message }),
      });

      if (!response.ok) {
        throw new Error(`Slack webhook failed: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      throw error;
    }
  }

  async sendCapaReminderEmail(email: string, capaTitle: string, dueDate: Date) {
    if (!this.sendgridConfigured) {
      console.log(`[Email] CAPA reminder would be sent to ${email} for ${capaTitle}`);
      return;
    }

    const sendgridConfig = this.configService.get('notifications.sendgrid');

    const msg = {
      to: email,
      from: {
        email: sendgridConfig.fromEmail,
        name: sendgridConfig.fromName,
      },
      subject: `Reminder: CAPA "${capaTitle}" is due soon`,
      html: `
        <h2>CAPA Reminder</h2>
        <p>The CAPA "${capaTitle}" is due on ${dueDate.toLocaleDateString()}.</p>
        <p>Please review and complete it before the due date.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending CAPA reminder email:', error);
      throw error;
    }
  }

  async sendCapaEscalationEmail(email: string, capaTitle: string, daysOverdue: number) {
    if (!this.sendgridConfigured) {
      console.log(`[Email] CAPA escalation would be sent to ${email} for ${capaTitle}`);
      return;
    }

    const sendgridConfig = this.configService.get('notifications.sendgrid');

    const msg = {
      to: email,
      from: {
        email: sendgridConfig.fromEmail,
        name: sendgridConfig.fromName,
      },
      subject: `URGENT: CAPA "${capaTitle}" is overdue`,
      html: `
        <h2>CAPA Escalation</h2>
        <p>The CAPA "${capaTitle}" is ${daysOverdue} days overdue.</p>
        <p>Please take immediate action to complete this CAPA.</p>
      `,
    };

    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error('Error sending CAPA escalation email:', error);
      throw error;
    }
  }
}

