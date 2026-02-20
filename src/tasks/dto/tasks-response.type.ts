import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Task } from '../entities/task.entity';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  totalPages: number;
}

@ObjectType()
export class TasksResponse {
  @Field(() => [Task])
  tasks: Task[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
