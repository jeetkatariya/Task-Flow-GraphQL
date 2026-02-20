import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { HabitLog } from './habit-log.entity';
import { HabitStreak } from './habit-streak.entity';
import { HabitFrequency } from '../../shared/types';

@ObjectType()
@Entity('habits')
export class Habit {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => String)
  @Column({ type: 'varchar', default: 'daily' })
  frequency: HabitFrequency;

  @Field(() => [Int])
  @Column('int', { name: 'target_days', array: true, default: [0, 1, 2, 3, 4, 5, 6] })
  targetDays: number[];

  @Field()
  @Column({ default: '#4caf50' })
  color: string;

  @Field(() => [HabitLog], { nullable: true })
  @OneToMany(() => HabitLog, (log) => log.habit)
  logs?: HabitLog[];

  @Field(() => HabitStreak, { nullable: true })
  @OneToOne(() => HabitStreak, (streak) => streak.habit, { eager: true })
  streak?: HabitStreak;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
