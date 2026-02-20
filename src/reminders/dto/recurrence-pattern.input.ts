import { InputType, Field, Int } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsInt, IsDateString, IsString } from 'class-validator';

@InputType()
export class RecurrencePatternInput {
  @Field(() => String)
  @IsEnum(['daily', 'weekly', 'monthly', 'yearly'])
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  interval?: number;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  byDay?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  byMonth?: number[];

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  byMonthDay?: number[];

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  count?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  until?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  timezone?: string;
}
