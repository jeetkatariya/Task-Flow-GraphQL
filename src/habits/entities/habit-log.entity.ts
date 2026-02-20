import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Habit } from './habit.entity';

@ObjectType()
@Entity('habit_logs')
@Unique(['habit', 'date'])
export class HabitLog {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Habit)
  @ManyToOne(() => Habit, (habit) => habit.logs, { eager: true })
  @JoinColumn({ name: 'habit_id' })
  habit: Habit;

  @Field(() => String)
  @Column({ type: 'date' })
  date: string;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  notes?: string;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
