import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn, IsDateString, IsArray, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from '../../shared/types';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true, defaultValue: 'medium' })
  @IsOptional()
  @IsIn(['low', 'medium', 'high', 'urgent'])
  priority?: TaskPriority;

  @Field(() => String, { nullable: true, defaultValue: 'todo' })
  @IsOptional()
  @IsIn(['todo', 'in_progress', 'done', 'archived'])
  status?: TaskStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  dependsOnTaskIds?: string[];
}
