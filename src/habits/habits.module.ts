import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitsService } from './services/habits.service';
import { HabitStreakService } from './services/habit-streak.service';
import { HabitAnalyticsService } from './services/habit-analytics.service';
import { HabitsResolver } from './resolvers/habits.resolver';
import { Habit } from './entities/habit.entity';
import { HabitLog } from './entities/habit-log.entity';
import { HabitStreak } from './entities/habit-streak.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitLog, HabitStreak]),
  ],
  providers: [HabitsService, HabitStreakService, HabitAnalyticsService, HabitsResolver],
  exports: [HabitsService],
})
export class HabitsModule {}
