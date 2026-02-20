import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class RecurrencePatternType {
  @Field(() => String)
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';

  @Field(() => Int, { nullable: true })
  interval?: number;

  @Field(() => [Int], { nullable: true })
  byDay?: number[];

  @Field(() => [Int], { nullable: true })
  byMonth?: number[];

  @Field(() => [Int], { nullable: true })
  byMonthDay?: number[];

  @Field(() => Int, { nullable: true })
  count?: number;

  @Field({ nullable: true })
  until?: string;

  @Field({ nullable: true })
  timezone?: string;
}
