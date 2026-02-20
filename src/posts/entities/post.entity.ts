import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';

@ObjectType()
@Entity('posts')
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field()
  @Column({ default: false })
  published: boolean;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
