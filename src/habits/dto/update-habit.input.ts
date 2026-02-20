import { InputType, PartialType } from '@nestjs/graphql';
import { CreateHabitInput } from './create-habit.input';

@InputType()
export class UpdateHabitInput extends PartialType(CreateHabitInput) {}
