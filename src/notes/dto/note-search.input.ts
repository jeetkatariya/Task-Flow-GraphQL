import { InputType, Field, ID } from '@nestjs/graphql';
import { IsOptional, IsUUID, IsArray } from 'class-validator';

@InputType()
export class NoteSearchInput {
  @Field({ nullable: true })
  @IsOptional()
  search?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  tagIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  isPinned?: boolean;

  @Field({ nullable: true })
  @IsOptional()
  isArchived?: boolean;
}
