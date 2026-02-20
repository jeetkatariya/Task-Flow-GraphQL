import DataLoader from 'dataloader';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { TaskCategory } from '../entities/task-category.entity';
import { TaskTag } from '../entities/task-tag.entity';

@Injectable()
export class TaskLoaders {
  constructor(
    @InjectRepository(TaskCategory)
    private categoryRepository: Repository<TaskCategory>,
    @InjectRepository(TaskTag)
    private tagRepository: Repository<TaskTag>,
  ) {}

  createCategoryLoader(): DataLoader<string, TaskCategory> {
    return new DataLoader<string, TaskCategory>(async (categoryIds: string[]) => {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });

      const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));
      return categoryIds.map((id) => categoryMap.get(id) || null);
    });
  }

  createTagLoader(): DataLoader<string, TaskTag> {
    return new DataLoader<string, TaskTag>(async (tagIds: string[]) => {
      const tags = await this.tagRepository.find({
        where: { id: In(tagIds) },
      });

      const tagMap = new Map(tags.map((tag) => [tag.id, tag]));
      return tagIds.map((id) => tagMap.get(id) || null);
    });
  }

  createTaskTagsLoader(): DataLoader<string, TaskTag[]> {
    return new DataLoader<string, TaskTag[]>(async (taskIds: string[]) => {
      const taskTags = await this.tagRepository
        .createQueryBuilder('tag')
        .innerJoin('task_tags_relation', 'ttr', 'ttr.tag_id = tag.id')
        .where('ttr.task_id IN (:...taskIds)', { taskIds })
        .getMany();

      return taskIds.map(() => []);
    });
  }
}
