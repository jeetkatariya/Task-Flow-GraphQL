import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskFilterInput } from '../dto/task-filter.input';
import { TaskSortInput, TaskSortField } from '../dto/task-sort.input';
import { QueryCondition, QueryOperator } from '../../shared/types';

@Injectable()
export class TaskQueryBuilderService {
  buildQuery(
    repository: Repository<Task>,
    userId: string,
    filter?: TaskFilterInput,
    sort?: TaskSortInput,
  ): SelectQueryBuilder<Task> {
    let query = repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags')
      .leftJoinAndSelect('task.user', 'user')
      .where('task.user_id = :userId', { userId });

    if (filter) {
      query = this.applyFilters(query, filter);
    }

    if (sort) {
      query = this.applySorting(query, sort);
    } else {
      query.orderBy('task.createdAt', 'DESC');
    }

    return query;
  }

  private applyFilters(
    query: SelectQueryBuilder<Task>,
    filter: TaskFilterInput,
  ): SelectQueryBuilder<Task> {
    if (filter.status && filter.status.length > 0) {
      query.andWhere('task.status IN (:...statuses)', { statuses: filter.status });
    }

    if (filter.priority && filter.priority.length > 0) {
      query.andWhere('task.priority IN (:...priorities)', { priorities: filter.priority });
    }

    if (filter.categoryId) {
      query.andWhere('task.category_id = :categoryId', { categoryId: filter.categoryId });
    }

    if (filter.tagIds && filter.tagIds.length > 0) {
      query
        .innerJoin('task_tags_relation', 'ttr', 'ttr.task_id = task.id')
        .andWhere('ttr.tag_id IN (:...tagIds)', { tagIds: filter.tagIds });
    }

    if (filter.dueDateFrom) {
      query.andWhere('task.due_date >= :dueDateFrom', { dueDateFrom: filter.dueDateFrom });
    }

    if (filter.dueDateTo) {
      query.andWhere('task.due_date <= :dueDateTo', { dueDateTo: filter.dueDateTo });
    }

    if (filter.createdFrom) {
      query.andWhere('task.created_at >= :createdFrom', { createdFrom: filter.createdFrom });
    }

    if (filter.createdTo) {
      query.andWhere('task.created_at <= :createdTo', { createdTo: filter.createdTo });
    }

    if (filter.search) {
      query.andWhere(
        `to_tsvector('english', task.title || ' ' || COALESCE(task.description, '')) @@ plainto_tsquery('english', :search)`,
        { search: filter.search },
      );
    }

    return query;
  }

  private applySorting(
    query: SelectQueryBuilder<Task>,
    sort: TaskSortInput,
  ): SelectQueryBuilder<Task> {
    const fieldMap: Record<TaskSortField, string> = {
      [TaskSortField.CREATED_AT]: 'task.createdAt',
      [TaskSortField.UPDATED_AT]: 'task.updatedAt',
      [TaskSortField.DUE_DATE]: 'task.dueDate',
      [TaskSortField.PRIORITY]: 'task.priority',
      [TaskSortField.STATUS]: 'task.status',
      [TaskSortField.TITLE]: 'task.title',
    };

    const field = fieldMap[sort.field] || 'task.createdAt';
    const direction = sort.direction || 'DESC';

    query.orderBy(field, direction);

    if (sort.field !== TaskSortField.PRIORITY) {
      query.addOrderBy('task.priority', 'DESC');
    }

    return query;
  }

  buildOverdueTasksQuery(repository: Repository<Task>, userId: string): SelectQueryBuilder<Task> {
    return repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.status != :doneStatus', { doneStatus: 'done' })
      .andWhere('task.due_date < :now', { now: new Date() })
      .orderBy('task.dueDate', 'ASC');
  }

  buildUpcomingTasksQuery(
    repository: Repository<Task>,
    userId: string,
    days: number = 7,
  ): SelectQueryBuilder<Task> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.status != :doneStatus', { doneStatus: 'done' })
      .andWhere('task.due_date >= :now', { now: new Date() })
      .andWhere('task.due_date <= :futureDate', { futureDate })
      .orderBy('task.dueDate', 'ASC');
  }

  buildTasksByCategoryQuery(
    repository: Repository<Task>,
    userId: string,
    categoryId: string,
  ): SelectQueryBuilder<Task> {
    return repository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags')
      .where('task.user_id = :userId', { userId })
      .andWhere('task.category_id = :categoryId', { categoryId })
      .orderBy('task.createdAt', 'DESC');
  }

  buildTasksByTagQuery(
    repository: Repository<Task>,
    userId: string,
    tagId: string,
  ): SelectQueryBuilder<Task> {
    return repository
      .createQueryBuilder('task')
      .innerJoin('task_tags_relation', 'ttr', 'ttr.task_id = task.id')
      .leftJoinAndSelect('task.category', 'category')
      .leftJoinAndSelect('task.tags', 'tags')
      .where('task.user_id = :userId', { userId })
      .andWhere('ttr.tag_id = :tagId', { tagId })
      .orderBy('task.createdAt', 'DESC');
  }

  buildDependencyChainQuery(repository: Repository<Task>, taskId: string): string {
    return `
      WITH RECURSIVE task_deps AS (
        SELECT task_id, depends_on_task_id, 1 as depth
        FROM task_dependencies
        WHERE task_id = $1
        
        UNION ALL
        
        SELECT td.task_id, td.depends_on_task_id, tdp.depth + 1
        FROM task_dependencies td
        INNER JOIN task_deps tdp ON td.task_id = tdp.depends_on_task_id
        WHERE tdp.depth < 10
      )
      SELECT DISTINCT depends_on_task_id as task_id
      FROM task_deps
      ORDER BY depth;
    `;
  }
}
