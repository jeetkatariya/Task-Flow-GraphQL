import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user' })
  @UseGuards(JwtAuthGuard)
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOne(id);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,
  ) {
    if (id !== user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ) {
    if (id !== user.id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }
}
