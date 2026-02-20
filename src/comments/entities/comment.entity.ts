import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';

@ObjectType()
@Entity('comments')
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column('text')
  content: string;

  @Field(() => Post)
  @ManyToOne(() => Post, (post) => post.comments, { eager: true })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.comments, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
