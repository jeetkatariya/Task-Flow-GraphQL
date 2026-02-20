import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostInput: CreatePostInput, author: User): Promise<Post> {
    const post = this.postsRepository.create({
      ...createPostInput,
      author,
    });
    return this.postsRepository.save(post);
  }

  async findAll(published?: boolean): Promise<Post[]> {
    const where = published !== undefined ? { published } : {};
    return this.postsRepository.find({
      where,
      relations: ['author', 'comments'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'comments', 'comments.author'],
    });
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async update(id: string, updatePostInput: UpdatePostInput, user: User): Promise<Post> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }

    Object.assign(post, updatePostInput);
    return this.postsRepository.save(post);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const post = await this.findOne(id);

    if (post.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    const result = await this.postsRepository.delete(id);
    return result.affected > 0;
  }
}
