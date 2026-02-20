import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Reminder } from './reminder.entity';

@ObjectType()
@Entity('reminder_notifications')
export class ReminderNotification {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Reminder)
  @ManyToOne(() => Reminder, (reminder) => reminder.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reminder_id' })
  reminder: Reminder;

  @Field()
  @CreateDateColumn({ name: 'sent_at' })
  sentAt: Date;

  @Field()
  @Column({ name: 'notification_type', default: 'in_app' })
  notificationType: string;
}
