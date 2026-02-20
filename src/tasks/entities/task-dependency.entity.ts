import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Task } from './task.entity';

@ObjectType()
@Entity('task_dependencies')
@Index(['task', 'dependsOn'], { unique: true })
export class TaskDependency {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Task)
  @ManyToOne(() => Task, (task) => task.dependencies)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Field(() => Task)
  @ManyToOne(() => Task, (task) => task.dependents)
  @JoinColumn({ name: 'depends_on_task_id' })
  dependsOn: Task;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
