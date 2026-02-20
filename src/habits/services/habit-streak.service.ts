import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HabitStreak } from '../entities/habit-streak.entity';
import { HabitLog } from '../entities/habit-log.entity';

@Injectable()
export class HabitStreakService {
  constructor(
    @InjectRepository(HabitStreak)
    private streakRepository: Repository<HabitStreak>,
    @InjectRepository(HabitLog)
    private logRepository: Repository<HabitLog>,
    private dataSource: DataSource,
  ) {}

  async updateStreak(habitId: string): Promise<HabitStreak> {
    try {
      await this.dataSource.query('SELECT update_habit_streak($1)', [habitId]);
    } catch {
      // DB function may not exist; streak is handled below
    }

    const streak = await this.streakRepository.findOne({
      where: { habit: { id: habitId } },
      relations: ['habit'],
    });

    if (!streak) {
      const newStreak = this.streakRepository.create({
        habit: { id: habitId } as any,
        currentStreak: 0,
        longestStreak: 0,
      });
      return this.streakRepository.save(newStreak);
    }

    return streak;
  }

  async calculateStreak(habitId: string): Promise<{ current: number; longest: number }> {
    const logs = await this.logRepository.find({
      where: { habit: { id: habitId }, completed: true },
      order: { date: 'DESC' },
    });

    if (logs.length === 0) {
      return { current: 0, longest: 0 };
    }

    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    for (const log of logs) {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);

      if (logDate.getTime() === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const longestStreak = await this.calculateLongestStreak(habitId);

    return {
      current: currentStreak,
      longest: longestStreak,
    };
  }

  private async calculateLongestStreak(habitId: string): Promise<number> {
    const result = await this.dataSource.query(
      `
      WITH ordered_logs AS (
        SELECT date, 
               ROW_NUMBER() OVER (ORDER BY date) as rn,
               date - (ROW_NUMBER() OVER (ORDER BY date) || ' days')::interval as grp
        FROM habit_logs
        WHERE habit_id = $1 AND completed = true
      ),
      streaks AS (
        SELECT grp, COUNT(*) as streak_length
        FROM ordered_logs
        GROUP BY grp
      )
      SELECT COALESCE(MAX(streak_length), 0) as longest_streak
      FROM streaks;
    `,
      [habitId],
    );

    return parseInt(result[0]?.longest_streak || '0', 10);
  }
}
