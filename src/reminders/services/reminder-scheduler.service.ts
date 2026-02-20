import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { ReminderNotification } from '../entities/reminder-notification.entity';

@Injectable()
export class ReminderSchedulerService {
  private readonly logger = new Logger(ReminderSchedulerService.name);

  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    @InjectRepository(ReminderNotification)
    private notificationRepository: Repository<ReminderNotification>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleDueReminders() {
    this.logger.log('Checking for due reminders...');

    const now = new Date();
    const dueReminders = await this.reminderRepository.find({
      where: {
        reminderTime: LessThanOrEqual(now),
        isCompleted: false,
      },
      relations: ['user', 'task', 'note'],
    });

    for (const reminder of dueReminders) {
      await this.sendNotification(reminder);

      if (reminder.isRecurring && reminder.recurrencePattern) {
        await this.scheduleNextOccurrence(reminder);
      } else {
        reminder.isCompleted = true;
        await this.reminderRepository.save(reminder);
      }
    }

    if (dueReminders.length > 0) {
      this.logger.log(`Processed ${dueReminders.length} due reminders`);
    }
  }

  private async sendNotification(reminder: Reminder): Promise<void> {
    const notification = this.notificationRepository.create({
      reminder,
      notificationType: 'in_app',
    });
    await this.notificationRepository.save(notification);
    this.logger.log(`Notification sent for reminder: ${reminder.title}`);
  }

  private async scheduleNextOccurrence(reminder: Reminder): Promise<void> {
    if (!reminder.recurrencePattern) {
      return;
    }

    const pattern = reminder.recurrencePattern;
    const currentTime = new Date(reminder.reminderTime);
    const nextTime = new Date(currentTime);

    switch (pattern.frequency) {
      case 'daily':
        nextTime.setDate(nextTime.getDate() + (pattern.interval || 1));
        break;
      case 'weekly':
        nextTime.setDate(nextTime.getDate() + 7 * (pattern.interval || 1));
        break;
      case 'monthly':
        nextTime.setMonth(nextTime.getMonth() + (pattern.interval || 1));
        break;
      case 'yearly':
        nextTime.setFullYear(nextTime.getFullYear() + (pattern.interval || 1));
        break;
    }

    reminder.reminderTime = nextTime;
    await this.reminderRepository.save(reminder);
  }
}
