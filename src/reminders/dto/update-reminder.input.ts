import { InputType, PartialType } from '@nestjs/graphql';
import { CreateReminderInput } from './create-reminder.input';

@InputType()
export class UpdateReminderInput extends PartialType(CreateReminderInput) {}
