import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from '../entities/habit.entity';
import { HabitLog } from '../entities/habit-log.entity';
import { HabitStreak } from '../entities/habit-streak.entity';
import { CreateHabitInput } from '../dto/create-habit.input';
import { UpdateHabitInput } from '../dto/update-habit.input';
import { HabitStreakService } from './habit-streak.service';
import { HabitAnalyticsService } from './habit-analytics.service';
import { HabitStats } from '../dto/habit-stats.type';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class HabitsService {
  constructor(
    @InjectRepository(Habit)
    private habitsRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private logRepository: Repository<HabitLog>,
    private streakService: HabitStreakService,
    private analyticsService: HabitAnalyticsService,
  ) {}

  async create(createHabitInput: CreateHabitInput, user: User): Promise<Habit> {
    const habit = this.habitsRepository.create({
      ...createHabitInput,
      targetDays: createHabitInput.targetDays || [0, 1, 2, 3, 4, 5, 6],
      user,
    });

    const savedHabit = await this.habitsRepository.save(habit);

    await this.streakService.updateStreak(savedHabit.id);

    return this.findOne(savedHabit.id, user.id);
  }

  async findAll(user: User): Promise<Habit[]> {
    return this.habitsRepository.find({
      where: { user: { id: user.id } },
      relations: ['streak'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitsRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['streak', 'logs'],
    });

    if (!habit) {
      throw new NotFoundException(`Habit with ID ${id} not found`);
    }

    return habit;
  }

  async update(id: string, updateHabitInput: UpdateHabitInput, user: User): Promise<Habit> {
    const habit = await this.findOne(id, user.id);

    if (updateHabitInput.name !== undefined) habit.name = updateHabitInput.name;
    if (updateHabitInput.description !== undefined) habit.description = updateHabitInput.description;
    if (updateHabitInput.frequency !== undefined) habit.frequency = updateHabitInput.frequency;
    if (updateHabitInput.targetDays !== undefined) habit.targetDays = updateHabitInput.targetDays;
    if (updateHabitInput.color !== undefined) habit.color = updateHabitInput.color;

    return this.habitsRepository.save(habit);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const habit = await this.findOne(id, userId);
    await this.habitsRepository.remove(habit);
    return true;
  }

  async logHabit(habitId: string, date: Date, completed: boolean, notes?: string, userId?: string): Promise<HabitLog> {
    if (userId) {
      await this.findOne(habitId, userId);
    }

    const habit = { id: habitId } as Habit;

    const existingLog = await this.logRepository.findOne({
      where: { habit: { id: habitId }, date },
    });

    if (existingLog) {
      existingLog.completed = completed;
      if (notes !== undefined) existingLog.notes = notes;
      const saved = await this.logRepository.save(existingLog);
      await this.streakService.updateStreak(habitId);
      return saved;
    }

    const log = this.logRepository.create({
      habit,
      date,
      completed,
      notes,
    });

    const saved = await this.logRepository.save(log);
    await this.streakService.updateStreak(habitId);

    return saved;
  }

  async getStreak(habitId: string, userId: string): Promise<HabitStreak> {
    await this.findOne(habitId, userId);
    return this.streakService.updateStreak(habitId);
  }

  async getStats(habitId: string, userId: string, periodDays?: number): Promise<HabitStats> {
    await this.findOne(habitId, userId);
    return this.analyticsService.getStats(habitId, periodDays);
  }
}
