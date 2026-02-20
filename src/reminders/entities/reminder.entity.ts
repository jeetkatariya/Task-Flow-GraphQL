import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Note } from '../../notes/entities/note.entity';
import { ReminderNotification } from './reminder-notification.entity';
import { RecurrencePattern } from '../../shared/types';
import { RecurrencePatternType } from '../dto/recurrence-pattern.type';

@ObjectType()
@Entity('reminders')
export class Reminder {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => Task, { nullable: true })
  @ManyToOne(() => Task, { nullable: true })
  @JoinColumn({ name: 'task_id' })
  task?: Task;

  @Field(() => Note, { nullable: true })
  @ManyToOne(() => Note, { nullable: true })
  @JoinColumn({ name: 'note_id' })
  note?: Note;

  @Field()
  @Column({ name: 'reminder_time', type: 'timestamptz' })
  reminderTime: Date;

  @Field()
  @Column({ default: 'UTC' })
  timezone: string;

  @Field()
  @Column({ name: 'is_recurring', default: false })
  isRecurring: boolean;

  @Column({ name: 'recurrence_pattern', type: 'jsonb', nullable: true })
  recurrencePattern?: RecurrencePattern;

  @Field()
  @Column({ name: 'is_completed', default: false })
  isCompleted: boolean;

  @Field(() => [ReminderNotification], { nullable: true })
  @OneToMany(() => ReminderNotification, (notification) => notification.reminder)
  notifications?: ReminderNotification[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
