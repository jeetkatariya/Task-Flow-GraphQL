import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID, IsArray } from 'class-validator';

@InputType()
export class CreateNoteInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @Field({ nullable: true, defaultValue: false })
  @IsOptional()
  isPinned?: boolean;
}
