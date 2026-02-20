import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsNotEmpty()
  content: string;

  @Field(() => ID)
  @IsUUID()
  postId: string;
}
