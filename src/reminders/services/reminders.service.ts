import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { CreateReminderInput } from '../dto/create-reminder.input';
import { UpdateReminderInput } from '../dto/update-reminder.input';
import { User } from '../../users/entities/user.entity';
import { RecurrencePattern } from '../../shared/types';

@Injectable()
export class RemindersService {
  constructor(
    @InjectRepository(Reminder)
    private remindersRepository: Repository<Reminder>,
  ) {}

  async create(createReminderInput: CreateReminderInput, user: User): Promise<Reminder> {
    let recurrencePattern: RecurrencePattern | undefined;
    if (createReminderInput.recurrencePattern) {
      recurrencePattern = {
        ...createReminderInput.recurrencePattern,
        until: createReminderInput.recurrencePattern.until
          ? new Date(createReminderInput.recurrencePattern.until)
          : undefined,
      };
    }

    const reminder = this.remindersRepository.create({
      title: createReminderInput.title,
      description: createReminderInput.description,
      reminderTime: new Date(createReminderInput.reminderTime),
      timezone: createReminderInput.timezone || 'UTC',
      isRecurring: createReminderInput.isRecurring || false,
      recurrencePattern,
      user,
      task: createReminderInput.taskId ? { id: createReminderInput.taskId } as any : undefined,
      note: createReminderInput.noteId ? { id: createReminderInput.noteId } as any : undefined,
    });

    return this.remindersRepository.save(reminder);
  }

  async findAll(user: User, upcoming?: boolean): Promise<Reminder[]> {
    const where: any = { user: { id: user.id } };

    if (upcoming !== undefined) {
      const now = new Date();
      if (upcoming) {
        where.reminderTime = Between(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000));
      } else {
        where.reminderTime = LessThanOrEqual(now);
      }
    }

    return this.remindersRepository.find({
      where,
      relations: ['task', 'note'],
      order: { reminderTime: 'ASC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Reminder> {
    const reminder = await this.remindersRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['task', 'note', 'notifications'],
    });

    if (!reminder) {
      throw new NotFoundException(`Reminder with ID ${id} not found`);
    }

    return reminder;
  }

  async findForDate(user: User, date: Date): Promise<Reminder[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.remindersRepository.find({
      where: {
        user: { id: user.id },
        reminderTime: Between(startOfDay, endOfDay),
        isCompleted: false,
      },
      relations: ['task', 'note'],
      order: { reminderTime: 'ASC' },
    });
  }

  async update(id: string, updateReminderInput: UpdateReminderInput, user: User): Promise<Reminder> {
    const reminder = await this.findOne(id, user.id);

    if (updateReminderInput.title !== undefined) reminder.title = updateReminderInput.title;
    if (updateReminderInput.description !== undefined) reminder.description = updateReminderInput.description;
    if (updateReminderInput.reminderTime !== undefined) {
      reminder.reminderTime = new Date(updateReminderInput.reminderTime);
    }
    if (updateReminderInput.timezone !== undefined) reminder.timezone = updateReminderInput.timezone;
    if (updateReminderInput.isRecurring !== undefined) reminder.isRecurring = updateReminderInput.isRecurring;
    if (updateReminderInput.recurrencePattern !== undefined) {
      reminder.recurrencePattern = {
        ...updateReminderInput.recurrencePattern,
        until: updateReminderInput.recurrencePattern.until
          ? new Date(updateReminderInput.recurrencePattern.until)
          : undefined,
      };
    }

    return this.remindersRepository.save(reminder);
  }

  async snooze(id: string, minutes: number, userId: string): Promise<Reminder> {
    const reminder = await this.findOne(id, userId);
    const newTime = new Date(reminder.reminderTime);
    newTime.setMinutes(newTime.getMinutes() + minutes);
    reminder.reminderTime = newTime;
    return this.remindersRepository.save(reminder);
  }

  async complete(id: string, userId: string): Promise<Reminder> {
    const reminder = await this.findOne(id, userId);
    reminder.isCompleted = true;
    return this.remindersRepository.save(reminder);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const reminder = await this.findOne(id, userId);
    await this.remindersRepository.remove(reminder);
    return true;
  }
}
