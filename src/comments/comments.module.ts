import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { Comment } from './entities/comment.entity';
import { PostsModule } from '../posts/posts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), PostsModule],
  providers: [CommentsResolver, CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
