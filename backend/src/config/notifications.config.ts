import { registerAs } from '@nestjs/config';

export default registerAs('notifications', () => ({
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@frontlinesafe.com',
    fromName: process.env.SENDGRID_FROM_NAME || 'FrontlineSafe',
  },
  slack: {
    webhookUrl: process.env.SLACK_WEBHOOK_URL,
  },
}));

