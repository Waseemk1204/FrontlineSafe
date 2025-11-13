import { registerAs } from '@nestjs/config';

export default registerAs('capa', () => ({
  reminderDaysBefore: parseInt(process.env.CAPA_REMINDER_DAYS_BEFORE || '3', 10),
  escalationDaysAfter: parseInt(process.env.CAPA_ESCALATION_DAYS_AFTER || '7', 10),
}));

