import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Note } from './note.entity';

@ObjectType()
@Entity('note_attachments')
export class NoteAttachment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Note)
  @ManyToOne(() => Note, (note) => note.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'note_id' })
  note: Note;

  @Field()
  @Column({ name: 'file_url' })
  fileUrl: string;

  @Field()
  @Column({ name: 'file_name' })
  fileName: string;

  @Field({ nullable: true })
  @Column({ name: 'file_type', nullable: true })
  fileType?: string;

  @Field(() => Int, { nullable: true })
  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize?: number;

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
