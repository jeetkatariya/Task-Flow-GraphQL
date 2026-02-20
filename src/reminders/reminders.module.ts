import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RemindersService } from './services/reminders.service';
import { ReminderSchedulerService } from './services/reminder-scheduler.service';
import { RemindersResolver } from './resolvers/reminders.resolver';
import { Reminder } from './entities/reminder.entity';
import { ReminderNotification } from './entities/reminder-notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder, ReminderNotification]),
  ],
  providers: [RemindersService, ReminderSchedulerService, RemindersResolver],
  exports: [RemindersService],
})
export class RemindersModule {}
