import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Task } from '../entities/task.entity';
import { TaskLoaders } from '../loaders/task.loader';
import { TasksService } from '../services/tasks.service';

@Resolver(() => Task)
export class TaskFieldResolver {
  constructor(
    private readonly taskLoaders: TaskLoaders,
    private readonly tasksService: TasksService,
  ) {}

  @ResolveField(() => Boolean)
  isOverdue(@Parent() task: Task): boolean {
    if (!task.dueDate || task.status === 'done') {
      return false;
    }
    return new Date(task.dueDate) < new Date();
  }

  @ResolveField(() => Number, { nullable: true })
  daysUntilDue(@Parent() task: Task): number | null {
    if (!task.dueDate) {
      return null;
    }
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  @ResolveField(() => Number)
  completionPercentage(@Parent() task: Task): number {
    if (task.status === 'done') {
      return 100;
    }
    if (task.status === 'todo') {
      return 0;
    }
    if (task.status === 'in_progress') {
      return 50;
    }
    return 0;
  }

  @ResolveField(() => Number)
  priorityScore(@Parent() task: Task): number {
    const priorityMap = {
      low: 1,
      medium: 2,
      high: 3,
      urgent: 4,
    };
    return priorityMap[task.priority] || 0;
  }
}
