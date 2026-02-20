import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsOptional, IsEnum, IsDateString, IsArray, IsUUID } from 'class-validator';
import { CreateTaskInput } from './create-task.input';
import { TaskPriority, TaskStatus } from '../../shared/types';

@InputType()
export class UpdateTaskInput extends PartialType(CreateTaskInput) {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  id?: string;
}
