import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskCategory } from '../entities/task-category.entity';
import { TaskTag } from '../entities/task-tag.entity';
import { TaskDependency } from '../entities/task-dependency.entity';
import { CreateTaskInput } from '../dto/create-task.input';
import { UpdateTaskInput } from '../dto/update-task.input';
import { TaskFilterInput } from '../dto/task-filter.input';
import { TaskSortInput } from '../dto/task-sort.input';
import { PaginationInput } from '../dto/pagination.input';
import { TasksResponse, PaginationMeta } from '../dto/tasks-response.type';
import { TaskQueryBuilderService } from './task-query-builder.service';
import { User } from '../../users/entities/user.entity';
import { TaskStatus } from '../../shared/types';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskCategory)
    private categoryRepository: Repository<TaskCategory>,
    @InjectRepository(TaskTag)
    private tagRepository: Repository<TaskTag>,
    @InjectRepository(TaskDependency)
    private dependencyRepository: Repository<TaskDependency>,
    private queryBuilder: TaskQueryBuilderService,
    private dataSource: DataSource,
  ) {}

  async create(createTaskInput: CreateTaskInput, user: User): Promise<Task> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const task = this.tasksRepository.create({
        title: createTaskInput.title,
        description: createTaskInput.description,
        priority: createTaskInput.priority || 'medium',
        status: createTaskInput.status || 'todo',
        dueDate: createTaskInput.dueDate ? new Date(createTaskInput.dueDate) : null,
        user,
      });

      if (createTaskInput.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: createTaskInput.categoryId, user: { id: user.id } },
        });
        if (!category) {
          throw new NotFoundException(`Category with ID ${createTaskInput.categoryId} not found`);
        }
        task.category = category;
      }

      const savedTask = await queryRunner.manager.save(task);

      if (createTaskInput.tagIds && createTaskInput.tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: createTaskInput.tagIds as any, user: { id: user.id } },
        });
        if (tags.length !== createTaskInput.tagIds.length) {
          throw new BadRequestException('One or more tags not found');
        }
        savedTask.tags = tags;
        await queryRunner.manager.save(savedTask);
      }

      if (createTaskInput.dependsOnTaskIds && createTaskInput.dependsOnTaskIds.length > 0) {
        const dependencies = createTaskInput.dependsOnTaskIds.map((dependsOnId) =>
          this.dependencyRepository.create({
            task: savedTask,
            dependsOn: { id: dependsOnId } as Task,
          }),
        );
        await queryRunner.manager.save(dependencies);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedTask.id, user.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(
    user: User,
    filter?: TaskFilterInput,
    sort?: TaskSortInput,
    pagination?: PaginationInput,
  ): Promise<TasksResponse> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 20;
    const offset = (page - 1) * limit;

    const query = this.queryBuilder.buildQuery(
      this.tasksRepository,
      user.id,
      filter,
      sort,
    );

    const total = await query.getCount();

    const tasks = await query.skip(offset).take(limit).getMany();

    const meta: PaginationMeta = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return { tasks, meta };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'tags', 'user', 'dependencies', 'dependencies.dependsOn'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskInput: UpdateTaskInput, user: User): Promise<Task> {
    const task = await this.findOne(id, user.id);

    if (updateTaskInput.title !== undefined) task.title = updateTaskInput.title;
    if (updateTaskInput.description !== undefined) task.description = updateTaskInput.description;
    if (updateTaskInput.priority !== undefined) task.priority = updateTaskInput.priority;
    if (updateTaskInput.status !== undefined) {
      task.status = updateTaskInput.status;
      if (updateTaskInput.status === 'done' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (updateTaskInput.status !== 'done') {
        task.completedAt = null;
      }
    }
    if (updateTaskInput.dueDate !== undefined) {
      task.dueDate = updateTaskInput.dueDate ? new Date(updateTaskInput.dueDate) : null;
    }

    if (updateTaskInput.categoryId !== undefined) {
      if (updateTaskInput.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateTaskInput.categoryId, user: { id: user.id } },
        });
        if (!category) {
          throw new NotFoundException(`Category not found`);
        }
        task.category = category;
      } else {
        task.category = null;
      }
    }

    if (updateTaskInput.tagIds !== undefined) {
      if (updateTaskInput.tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: updateTaskInput.tagIds as any, user: { id: user.id } },
        });
        task.tags = tags;
      } else {
        task.tags = [];
      }
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const task = await this.findOne(id, userId);
    await this.tasksRepository.remove(task);
    return true;
  }

  async complete(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.status = 'done';
    task.completedAt = new Date();
    return this.tasksRepository.save(task);
  }

  async findOverdue(user: User): Promise<Task[]> {
    const query = this.queryBuilder.buildOverdueTasksQuery(this.tasksRepository, user.id);
    return query.getMany();
  }

  async findUpcoming(user: User, days: number = 7): Promise<Task[]> {
    const query = this.queryBuilder.buildUpcomingTasksQuery(this.tasksRepository, user.id, days);
    return query.getMany();
  }

  async findByCategory(user: User, categoryId: string): Promise<Task[]> {
    const query = this.queryBuilder.buildTasksByCategoryQuery(
      this.tasksRepository,
      user.id,
      categoryId,
    );
    return query.getMany();
  }

  async findByTag(user: User, tagId: string): Promise<Task[]> {
    const query = this.queryBuilder.buildTasksByTagQuery(this.tasksRepository, user.id, tagId);
    return query.getMany();
  }

  async bulkUpdate(
    taskIds: string[],
    updateData: Partial<UpdateTaskInput>,
    userId: string,
  ): Promise<Task[]> {
    const tasks = await this.tasksRepository.find({
      where: { id: taskIds as any, user: { id: userId } },
    });

    if (tasks.length !== taskIds.length) {
      throw new BadRequestException('One or more tasks not found');
    }

    tasks.forEach((task) => {
      if (updateData.status !== undefined) {
        task.status = updateData.status as TaskStatus;
        if (task.status === 'done' && !task.completedAt) {
          task.completedAt = new Date();
        }
      }
      if (updateData.priority !== undefined) {
        task.priority = updateData.priority;
      }
    });

    return this.tasksRepository.save(tasks);
  }

  async getDependencyChain(taskId: string, userId: string): Promise<Task[]> {
    await this.findOne(taskId, userId);

    const query = this.queryBuilder.buildDependencyChainQuery(this.tasksRepository, taskId);
    const result = await this.dataSource.query(query, [taskId]);

    if (result.length === 0) {
      return [];
    }

    const dependentTaskIds = result.map((row: any) => row.task_id);
    return this.tasksRepository.find({
      where: { id: dependentTaskIds as any, user: { id: userId } },
      relations: ['category', 'tags'],
    });
  }
}
