import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Habit } from './habit.entity';

@ObjectType()
@Entity('habit_streaks')
export class HabitStreak {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Habit)
  @OneToOne(() => Habit, (habit) => habit.streak)
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Field(() => Int)
  @Column({ name: 'current_streak', default: 0 })
  currentStreak: number;

  @Field(() => Int)
  @Column({ name: 'longest_streak', default: 0 })
  longestStreak: number;

  @Field(() => String, { nullable: true })
  @Column({ name: 'last_completed_date', type: 'date', nullable: true })
  lastCompletedDate?: string;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
