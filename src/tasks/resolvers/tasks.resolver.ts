import { Resolver, Query, Mutation, Args, ID, Int, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TasksService } from '../services/tasks.service';
import { Task } from '../entities/task.entity';
import { CreateTaskInput } from '../dto/create-task.input';
import { UpdateTaskInput } from '../dto/update-task.input';
import { TaskFilterInput } from '../dto/task-filter.input';
import { TaskSortInput } from '../dto/task-sort.input';
import { PaginationInput } from '../dto/pagination.input';
import { TasksResponse } from '../dto/tasks-response.type';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

const pubSub: any = new PubSub();

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.create(createTaskInput, user);
    await pubSub.publish('taskCreated', { taskCreated: task });
    return task;
  }

  @Query(() => TasksResponse, { name: 'tasks' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Args('filter', { nullable: true }) filter?: TaskFilterInput,
    @Args('sort', { nullable: true }) sort?: TaskSortInput,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<TasksResponse> {
    return this.tasksService.findAll(user, filter, sort, pagination);
  }

  @Query(() => Task, { name: 'task' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.tasksService.findOne(id, user.id);
  }

  @Query(() => [Task], { name: 'overdueTasks' })
  @UseGuards(JwtAuthGuard)
  async findOverdue(@CurrentUser() user: User): Promise<Task[]> {
    return this.tasksService.findOverdue(user);
  }

  @Query(() => [Task], { name: 'upcomingTasks' })
  @UseGuards(JwtAuthGuard)
  async findUpcoming(
    @CurrentUser() user: User,
    @Args('days', { type: () => Int, nullable: true, defaultValue: 7 }) days?: number,
  ): Promise<Task[]> {
    return this.tasksService.findUpcoming(user, days);
  }

  @Query(() => [Task], { name: 'tasksByCategory' })
  @UseGuards(JwtAuthGuard)
  async findByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findByCategory(user, categoryId);
  }

  @Query(() => [Task], { name: 'tasksByTag' })
  @UseGuards(JwtAuthGuard)
  async findByTag(
    @Args('tagId', { type: () => ID }) tagId: string,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.findByTag(user, tagId);
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateTaskInput') updateTaskInput: UpdateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.update(id, updateTaskInput, user);
    await pubSub.publish('taskUpdated', { taskUpdated: task });
    return task;
  }

  @Mutation(() => Task)
  @UseGuards(JwtAuthGuard)
  async completeTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Task> {
    const task = await this.tasksService.complete(id, user.id);
    await pubSub.publish('taskCompleted', { taskCompleted: task });
    return task;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeTask(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.tasksService.remove(id, user.id);
  }

  @Mutation(() => [Task])
  @UseGuards(JwtAuthGuard)
  async bulkUpdateTasks(
    @Args('taskIds', { type: () => [ID] }) taskIds: string[],
    @Args('updateData') updateData: UpdateTaskInput,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.bulkUpdate(taskIds, updateData, user.id);
  }

  @Query(() => [Task], { name: 'taskDependencyChain' })
  @UseGuards(JwtAuthGuard)
  async getDependencyChain(
    @Args('taskId', { type: () => ID }) taskId: string,
    @CurrentUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getDependencyChain(taskId, user.id);
  }

  @Subscription(() => Task, {
    filter: (payload, variables, context) => {
      return payload.taskCreated.user.id === context.req.user.id;
    },
  })
  @UseGuards(JwtAuthGuard)
  taskCreated() {
    return pubSub.asyncIterator('taskCreated');
  }

  @Subscription(() => Task, {
    filter: (payload, variables, context) => {
      return payload.taskUpdated.user.id === context.req.user.id;
    },
  })
  @UseGuards(JwtAuthGuard)
  taskUpdated() {
    return pubSub.asyncIterator('taskUpdated');
  }

  @Subscription(() => Task, {
    filter: (payload, variables, context) => {
      return payload.taskCompleted.user.id === context.req.user.id;
    },
  })
  @UseGuards(JwtAuthGuard)
  taskCompleted() {
    return pubSub.asyncIterator('taskCompleted');
  }
}
