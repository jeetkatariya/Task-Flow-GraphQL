import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, Index } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { NoteCategory } from './note-category.entity';
import { NoteTag } from './note-tag.entity';
import { NoteAttachment } from './note-attachment.entity';

@ObjectType()
@Entity('notes')
@Index(['user', 'isPinned'])
export class Note {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column('text')
  content: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => NoteCategory, { nullable: true })
  @ManyToOne(() => NoteCategory, (category) => category.notes, { nullable: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  category?: NoteCategory;

  @Field(() => [NoteTag], { nullable: true })
  @ManyToMany(() => NoteTag, (tag) => tag.notes)
  @JoinTable({
    name: 'note_tags_relation',
    joinColumn: { name: 'note_id' },
    inverseJoinColumn: { name: 'tag_id' },
  })
  tags?: NoteTag[];

  @Field(() => [NoteAttachment], { nullable: true })
  @OneToMany(() => NoteAttachment, (attachment) => attachment.note)
  attachments?: NoteAttachment[];

  @Field()
  @Column({ name: 'is_pinned', default: false })
  isPinned: boolean;

  @Field()
  @Column({ name: 'is_archived', default: false })
  isArchived: boolean;

  @Column({ name: 'search_vector', type: 'tsvector', nullable: true, select: false })
  searchVector?: any;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Field()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
