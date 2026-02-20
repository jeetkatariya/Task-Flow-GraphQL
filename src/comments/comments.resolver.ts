import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.create(createCommentInput, user);
  }

  @Query(() => [Comment], { name: 'comments' })
  findAll() {
    return this.commentsService.findAll();
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.commentsService.findOne(id);
  }

  @Query(() => [Comment], { name: 'commentsByPost' })
  findByPost(@Args('postId', { type: () => ID }) postId: string) {
    return this.commentsService.findByPost(postId);
  }

  @Mutation(() => Comment)
  @UseGuards(JwtAuthGuard)
  updateComment(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.update(id, updateCommentInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeComment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.commentsService.remove(id, user);
  }
}
