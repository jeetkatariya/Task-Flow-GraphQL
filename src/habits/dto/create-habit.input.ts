import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsIn, IsArray, IsInt, Min, Max } from 'class-validator';
import { HabitFrequency } from '../../shared/types';

@InputType()
export class CreateHabitInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => String, { nullable: true, defaultValue: 'daily' })
  @IsOptional()
  @IsIn(['daily', 'weekly', 'custom'])
  frequency?: HabitFrequency;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  targetDays?: number[];

  @Field({ nullable: true })
  @IsOptional()
  color?: string;
}
