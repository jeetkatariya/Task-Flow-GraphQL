import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { Note } from '../entities/note.entity';
import { CreateNoteInput } from '../dto/create-note.input';
import { UpdateNoteInput } from '../dto/update-note.input';
import { NoteSearchInput } from '../dto/note-search.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../users/entities/user.entity';

@Resolver(() => Note)
export class NotesResolver {
  constructor(private readonly notesService: NotesService) {}

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async createNote(
    @Args('createNoteInput') createNoteInput: CreateNoteInput,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.create(createNoteInput, user);
  }

  @Query(() => [Note], { name: 'notes' })
  @UseGuards(JwtAuthGuard)
  async findAll(
    @CurrentUser() user: User,
    @Args('search', { nullable: true }) search?: NoteSearchInput,
  ): Promise<Note[]> {
    return this.notesService.findAll(user, search);
  }

  @Query(() => Note, { name: 'note' })
  @UseGuards(JwtAuthGuard)
  async findOne(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.findOne(id, user.id);
  }

  @Query(() => [Note], { name: 'pinnedNotes' })
  @UseGuards(JwtAuthGuard)
  async findPinned(@CurrentUser() user: User): Promise<Note[]> {
    return this.notesService.findPinned(user);
  }

  @Query(() => [Note], { name: 'recentNotes' })
  @UseGuards(JwtAuthGuard)
  async findRecent(
    @CurrentUser() user: User,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit?: number,
  ): Promise<Note[]> {
    return this.notesService.findRecent(user, limit);
  }

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async updateNote(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateNoteInput') updateNoteInput: UpdateNoteInput,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteInput, user);
  }

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async pinNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.pin(id, user.id);
  }

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async unpinNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.unpin(id, user.id);
  }

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async archiveNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.archive(id, user.id);
  }

  @Mutation(() => Note)
  @UseGuards(JwtAuthGuard)
  async unarchiveNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<Note> {
    return this.notesService.unarchive(id, user.id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async removeNote(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.notesService.remove(id, user.id);
  }
}
