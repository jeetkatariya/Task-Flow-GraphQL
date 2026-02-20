import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HabitLog } from '../entities/habit-log.entity';
import { HabitStats } from '../dto/habit-stats.type';

@Injectable()
export class HabitAnalyticsService {
  constructor(
    @InjectRepository(HabitLog)
    private logRepository: Repository<HabitLog>,
    private dataSource: DataSource,
  ) {}

  async getStats(habitId: string, periodDays: number = 30): Promise<HabitStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const completionStats = await this.dataSource.query(
      `
      SELECT 
        COUNT(*) FILTER (WHERE date >= $2) as total_days,
        COUNT(*) FILTER (WHERE date >= $2 AND completed = true) as completed_days
      FROM habit_logs
      WHERE habit_id = $1 AND date >= $2
    `,
      [habitId, startDate],
    );

    const totalDays = parseInt(completionStats[0]?.total_days || '0', 10);
    const completedDays = parseInt(completionStats[0]?.completed_days || '0', 10);
    const completionRate = totalDays > 0 ? completedDays / totalDays : 0;

    const streakInfo = await this.dataSource.query(
      `
      SELECT current_streak, longest_streak
      FROM habit_streaks
      WHERE habit_id = $1
    `,
      [habitId],
    );

    const currentStreak = parseInt(streakInfo[0]?.current_streak || '0', 10);
    const longestStreak = parseInt(streakInfo[0]?.longest_streak || '0', 10);

    const weeklyCompletion = await this.getWeeklyCompletion(habitId, 7);

    return {
      totalDays,
      completedDays,
      completionRate,
      currentStreak,
      longestStreak,
      weeklyCompletion,
    };
  }

  private async getWeeklyCompletion(habitId: string, weeks: number): Promise<number[]> {
    const result = await this.dataSource.query(
      `
      WITH weeks AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '${weeks} weeks',
          CURRENT_DATE,
          '1 week'::interval
        ) as week_start
      ),
      weekly_stats AS (
        SELECT 
          w.week_start,
          COUNT(hl.id) FILTER (WHERE hl.completed = true) as completed,
          COUNT(hl.id) as total
        FROM weeks w
        LEFT JOIN habit_logs hl ON 
          hl.habit_id = $1 AND
          hl.date >= w.week_start AND
          hl.date < w.week_start + INTERVAL '1 week'
        GROUP BY w.week_start
        ORDER BY w.week_start
      )
      SELECT 
        CASE 
          WHEN total > 0 THEN (completed::float / total * 100)::int
          ELSE 0
        END as completion_rate
      FROM weekly_stats
    `,
      [habitId],
    );

    return result.map((row: any) => row.completion_rate || 0);
  }
}
