import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsDateString, IsBoolean, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RecurrencePatternInput } from './recurrence-pattern.input';

@InputType()
export class CreateReminderInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  taskId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  noteId?: string;

  @Field()
  @IsDateString()
  reminderTime: string;

  @Field({ nullable: true, defaultValue: 'UTC' })
  @IsOptional()
  timezone?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @Field(() => RecurrencePatternInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => RecurrencePatternInput)
  recurrencePattern?: RecurrencePatternInput;
}
