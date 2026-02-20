import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './services/tasks.service';
import { TaskQueryBuilderService } from './services/task-query-builder.service';
import { TasksResolver } from './resolvers/tasks.resolver';
import { TaskFieldResolver } from './resolvers/task-field.resolver';
import { Task } from './entities/task.entity';
import { TaskCategory } from './entities/task-category.entity';
import { TaskTag } from './entities/task-tag.entity';
import { TaskDependency } from './entities/task-dependency.entity';
import { TaskLoaders } from './loaders/task.loader';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, TaskCategory, TaskTag, TaskDependency]),
  ],
  providers: [
    TasksService,
    TaskQueryBuilderService,
    TasksResolver,
    TaskFieldResolver,
    TaskLoaders,
  ],
  exports: [TasksService, TaskLoaders],
})
export class TasksModule {}
