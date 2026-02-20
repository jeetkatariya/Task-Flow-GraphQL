import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { PostsService } from '../posts/posts.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private postsService: PostsService,
  ) {}

  async create(createCommentInput: CreateCommentInput, author: User): Promise<Comment> {
    const post = await this.postsService.findOne(createCommentInput.postId);
    if (!post) {
      throw new NotFoundException(`Post with ID ${createCommentInput.postId} not found`);
    }

    const comment = this.commentsRepository.create({
      ...createCommentInput,
      author,
      post,
    });
    return this.commentsRepository.save(comment);
  }

  async findAll(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['author', 'post'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    return comment;
  }

  async findByPost(postId: string): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { post: { id: postId } },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, updateCommentInput: UpdateCommentInput, user: User): Promise<Comment> {
    const comment = await this.findOne(id);

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    Object.assign(comment, updateCommentInput);
    return this.commentsRepository.save(comment);
  }

  async remove(id: string, user: User): Promise<boolean> {
    const comment = await this.findOne(id);

    if (comment.author.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    const result = await this.commentsRepository.delete(id);
    return result.affected > 0;
  }
}
