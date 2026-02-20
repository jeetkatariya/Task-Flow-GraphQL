import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';

@ObjectType()
@Entity('task_tags')
export class TaskTag {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Task], { nullable: true })
  @ManyToMany(() => Task, (task) => task.tags)
  tasks?: Task[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
