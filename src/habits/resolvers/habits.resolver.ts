import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { HabitsService } from '../services/habits.service';
import { Habit } from '../entities/habit.entity';
import { HabitLog } from '../entities/habit-log.entity';
import { HabitStreak } from '../entities/habit-streak.entity';
import { HabitStats } from '../dto/habit-stats.type';
import { CreateHabitInput } from '../dto/create-habit.input';
import { UpdateHabitInput } from '../dto/update-habit.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Resolver(() => Habit)
export class HabitsResolver {
  constructor(private readonly habitsService: HabitsService) {}

  @Mutation(() => Habit)
  @UseGuards(JwtAuthGuard)
  async createHabit(
    @Args('createHabitInput') createHabitInput: CreateHabitInput,
    @CurrentUser() user: User,
  ): Promise<Habit> {
    return this.habitsService.create(createHabitInput, user);
  }

  @Query(() => [Habit], { name: 'habits' })
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User): Promise<Habit[]> {
    return this.habitsService.findAll(user);
  }

  @Query(() => Habit, { name: 'habit' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Habit> {
    return this.habitsService.findOne(id, user.id);
  }

  @Query(() => HabitStreak, { name: 'habitStreak' })
  @UseGuards(JwtAuthGuard)
  async getStreak(
    @Args('habitId', { type: () => ID }) habitId: string,
    @CurrentUser() user: User,
  ): Promise<HabitStreak> {
    return this.habitsService.getStreak(habitId, user.id);
  }

  @Query(() => HabitStats, { name: 'habitStats' })
  @UseGuards(JwtAuthGuard)
  async getStats(
    @Args('habitId', { type: () => ID }) habitId: string,
    @CurrentUser() user: User,
    @Args('periodDays', { nullable: true, type: () => Int }) periodDays?: number,
  ): Promise<HabitStats> {
    return this.habitsService.getStats(habitId, user.id, periodDays);
  }

  @Mutation(() => Habit)
  @UseGuards(JwtAuthGuard)
  async updateHabit(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateHabitInput') updateHabitInput: UpdateHabitInput,
    @CurrentUser() user: User,
  ): Promise<Habit> {
    return this.habitsService.update(id, updateHabitInput, user);
  }

  @Mutation(() => HabitLog)
  @UseGuards(JwtAuthGuard)
  async logHabit(
    @Args('habitId', { type: () => ID }) habitId: string,
    @Args('date') date: string,
    @Args('completed') completed: boolean,
    @CurrentUser() user: User,
    @Args('notes', { nullable: true }) notes?: string,
  ): Promise<HabitLog> {
    return this.habitsService.logHabit(habitId, new Date(date), completed, notes, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeHabit(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.habitsService.remove(id, user.id);
  }
}
