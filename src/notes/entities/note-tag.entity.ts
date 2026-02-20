import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Note } from './note.entity';

@ObjectType()
@Entity('note_tags')
export class NoteTag {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => User)
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Field(() => [Note], { nullable: true })
  @ManyToMany(() => Note, (note) => note.tags)
  notes?: Note[];

  @Field()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
