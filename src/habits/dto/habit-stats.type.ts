import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class HabitStats {
  @Field(() => Int)
  totalDays: number;

  @Field(() => Int)
  completedDays: number;

  @Field(() => Float)
  completionRate: number;

  @Field(() => Int)
  currentStreak: number;

  @Field(() => Int)
  longestStreak: number;

  @Field(() => [Int])
  weeklyCompletion: number[];
}
