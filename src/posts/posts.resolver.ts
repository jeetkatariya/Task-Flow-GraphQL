import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.create(createPostInput, user);
  }

  @Query(() => [Post], { name: 'posts' })
  findAll(@Args('published', { nullable: true, type: () => Boolean }) published?: boolean) {
    return this.postsService.findAll(published);
  }

  @Query(() => Post, { name: 'post' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  @UseGuards(JwtAuthGuard)
  updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
    @CurrentUser() user: User,
  ) {
    return this.postsService.update(id, updatePostInput, user);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removePost(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.postsService.remove(id, user);
  }
}
