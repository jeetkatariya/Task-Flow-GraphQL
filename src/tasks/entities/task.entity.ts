import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { TaskCategory } from './task-category.entity';
import { TaskTag } from './task-tag.entity';
import { TaskDependency } from './task-dependency.entity';
import { TaskPriority, TaskStatus } from '../../shared/types';

@ObjectType()
@Entity('tasks')
export class Task {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column('text', { nullable: true })
  description?: string;

  @Field(() => String)
  @Column({ type: 'varchar', default: 'medium' })
  priority: TaskPriority;

  @Field(() => String)
  @Column({ type: 'varchar', default: 'todo' })
  status: TaskStatus;

  @Field({ nullable: true })
  @Column({ name: 'due_date', type: 'timestamptz', nullable: true })
  dueDate?: Date;

  @Field({ nullable: true })
  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt?: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.tasks, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => TaskCategory, { nullable: true })
  @ManyToOne(() => TaskCategory, (category) => category.tasks, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  category?: TaskCategory;

  @Field(() => [TaskTag], { nullable: true })
  @ManyToMany(() => TaskTag, (tag) => tag.tasks)
  @JoinTable({
    name: 'task_tags_relation',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags?: TaskTag[];

  @Field(() => [TaskDependency], { nullable: true })
  @OneToMany(() => TaskDependency, (dep) => dep.task)
  dependencies?: TaskDependency[];

  @Field(() => [TaskDependency], { nullable: true })
  @OneToMany(() => TaskDependency, (dep) => dep.dependsOn)
  dependents?: TaskDependency[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Field(() => Boolean)
  isOverdue?: boolean;

  @Field(() => Number, { nullable: true })
  daysUntilDue?: number | null;

  @Field(() => Number)
  completionPercentage?: number;

  @Field(() => Number)
  priorityScore?: number;
}
