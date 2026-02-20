import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Post } from '../../posts/entities/post.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Note } from '../../notes/entities/note.entity';
import { Habit } from '../../habits/entities/habit.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field()
  @Column({ unique: true })
  username: string;

  @Field()
  @Column({ name: 'first_name' })
  firstName: string;

  @Field()
  @Column({ name: 'last_name' })
  lastName: string;

  @Column({ select: false })
  password: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.author)
  posts?: Post[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.author)
  comments?: Comment[];

  @Field(() => [Task], { nullable: true })
  @OneToMany(() => Task, (task) => task.user)
  tasks?: Task[];

  @Field(() => [Note], { nullable: true })
  @OneToMany(() => Note, (note) => note.user)
  notes?: Note[];

  @Field(() => [Habit], { nullable: true })
  @OneToMany(() => Habit, (habit) => habit.user)
  habits?: Habit[];

  @Field(() => [Reminder], { nullable: true })
  @OneToMany(() => Reminder, (reminder) => reminder.user)
  reminders?: Reminder[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
