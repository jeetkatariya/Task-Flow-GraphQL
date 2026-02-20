import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional } from 'class-validator';

export enum TaskSortField {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
  DUE_DATE = 'due_date',
  PRIORITY = 'priority',
  STATUS = 'status',
  TITLE = 'title',
}

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

@InputType()
export class TaskSortInput {
  @Field(() => String, { nullable: true, defaultValue: 'created_at' })
  @IsOptional()
  @IsEnum(TaskSortField)
  field?: TaskSortField = TaskSortField.CREATED_AT;

  @Field(() => String, { nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsEnum(SortDirection)
  direction?: SortDirection = SortDirection.DESC;
}
