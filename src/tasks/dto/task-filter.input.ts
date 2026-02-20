import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsIn, IsDateString, IsUUID, IsArray } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../shared/types';

@InputType()
export class TaskFilterInput {
  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsIn(['todo', 'in_progress', 'done', 'archived'], { each: true })
  status?: TaskStatus[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsIn(['low', 'medium', 'high', 'urgent'], { each: true })
  priority?: TaskPriority[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDateFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDateTo?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @Field({ nullable: true })
  @IsOptional()
  search?: string;
}
