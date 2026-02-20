import { Resolver, Query, Mutation, Args, ID, Subscription, ResolveField } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { RemindersService } from '../services/reminders.service';
import { Reminder } from '../entities/reminder.entity';
import { CreateReminderInput } from '../dto/create-reminder.input';
import { UpdateReminderInput } from '../dto/update-reminder.input';
import { RecurrencePatternType } from '../dto/recurrence-pattern.type';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

const pubSub: any = new PubSub();

@Resolver(() => Reminder)
export class RemindersResolver {
  constructor(private readonly remindersService: RemindersService) {}

  @ResolveField(() => RecurrencePatternType, { nullable: true })
  recurrencePattern(reminder: Reminder): RecurrencePatternType | null {
    if (!reminder.recurrencePattern) {
      return null;
    }
    return reminder.recurrencePattern as any;
  }

  @Mutation(() => Reminder)
  @UseGuards(JwtAuthGuard)
  async createReminder(
    @Args('createReminderInput') createReminderInput: CreateReminderInput,
    @CurrentUser() user: User,
  ): Promise<Reminder> {
    const reminder = await this.remindersService.create(createReminderInput, user);
    await pubSub.publish('reminderCreated', { reminderCreated: reminder });
    return reminder;
  }

  @Query(() => [Reminder], { name: 'reminders' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Args('upcoming', { nullable: true }) upcoming?: boolean,
  ): Promise<Reminder[]> {
    return this.remindersService.findAll(user, upcoming);
  }

  @Query(() => Reminder, { name: 'reminder' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Reminder> {
    return this.remindersService.findOne(id, user.id);
  }

  @Query(() => [Reminder], { name: 'remindersForDate' })
  @UseGuards(JwtAuthGuard)
  async findForDate(
    @Args('date') date: string,
    @CurrentUser() user: User,
  ): Promise<Reminder[]> {
    return this.remindersService.findForDate(user, new Date(date));
  }

  @Mutation(() => Reminder)
  @UseGuards(JwtAuthGuard)
  async updateReminder(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateReminderInput') updateReminderInput: UpdateReminderInput,
    @CurrentUser() user: User,
  ): Promise<Reminder> {
    return this.remindersService.update(id, updateReminderInput, user);
  }

  @Mutation(() => Reminder)
  @UseGuards(JwtAuthGuard)
  async snoozeReminder(
    @Args('id', { type: () => ID }) id: string,
    @Args('minutes', { type: () => Number }) minutes: number,
    @CurrentUser() user: User,
  ): Promise<Reminder> {
    return this.remindersService.snooze(id, minutes, user.id);
  }

  @Mutation(() => Reminder)
  @UseGuards(JwtAuthGuard)
  async completeReminder(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Reminder> {
    const reminder = await this.remindersService.complete(id, user.id);
    await pubSub.publish('reminderDue', { reminderDue: reminder });
    return reminder;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeReminder(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.remindersService.remove(id, user.id);
  }

  @Subscription(() => Reminder, {
    filter: (payload, variables, context) => {
      return payload.reminderCreated.user.id === context.req.user.id;
    },
  })
  @UseGuards(JwtAuthGuard)
  reminderCreated() {
    return pubSub.asyncIterator('reminderCreated');
  }

  @Subscription(() => Reminder, {
    filter: (payload, variables, context) => {
      return payload.reminderDue.user.id === context.req.user.id;
    },
  })
  @UseGuards(JwtAuthGuard)
  reminderDue() {
    return pubSub.asyncIterator('reminderDue');
  }
}
