import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Note } from '../entities/note.entity';
import { NoteCategory } from '../entities/note-category.entity';
import { NoteTag } from '../entities/note-tag.entity';
import { CreateNoteInput } from '../dto/create-note.input';
import { UpdateNoteInput } from '../dto/update-note.input';
import { NoteSearchInput } from '../dto/note-search.input';
import { NotesSearchService } from './notes-search.service';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
    @InjectRepository(NoteCategory)
    private categoryRepository: Repository<NoteCategory>,
    @InjectRepository(NoteTag)
    private tagRepository: Repository<NoteTag>,
    private searchService: NotesSearchService,
    private dataSource: DataSource,
  ) {}

  async create(createNoteInput: CreateNoteInput, user: User): Promise<Note> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const note = this.notesRepository.create({
        title: createNoteInput.title,
        content: createNoteInput.content,
        isPinned: createNoteInput.isPinned || false,
        user,
      });

      if (createNoteInput.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: createNoteInput.categoryId, user: { id: user.id } },
        });
        if (!category) {
          throw new NotFoundException(`Category not found`);
        }
        note.category = category;
      }

      const savedNote = await queryRunner.manager.save(note);

      if (createNoteInput.tagIds && createNoteInput.tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: createNoteInput.tagIds as any, user: { id: user.id } },
        });
        savedNote.tags = tags;
        await queryRunner.manager.save(savedNote);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedNote.id, user.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(user: User, searchInput?: NoteSearchInput): Promise<Note[]> {
    return this.searchService.search(user.id, searchInput);
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.notesRepository.findOne({
      where: { id, user: { id: userId } },
      relations: ['category', 'tags', 'attachments', 'user'],
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(id: string, updateNoteInput: UpdateNoteInput, user: User): Promise<Note> {
    const note = await this.findOne(id, user.id);

    if (updateNoteInput.title !== undefined) note.title = updateNoteInput.title;
    if (updateNoteInput.content !== undefined) note.content = updateNoteInput.content;
    if (updateNoteInput.isPinned !== undefined) note.isPinned = updateNoteInput.isPinned;

    if (updateNoteInput.categoryId !== undefined) {
      if (updateNoteInput.categoryId) {
        const category = await this.categoryRepository.findOne({
          where: { id: updateNoteInput.categoryId, user: { id: user.id } },
        });
        if (!category) {
          throw new NotFoundException(`Category not found`);
        }
        note.category = category;
      } else {
        note.category = null;
      }
    }

    if (updateNoteInput.tagIds !== undefined) {
      if (updateNoteInput.tagIds.length > 0) {
        const tags = await this.tagRepository.find({
          where: { id: updateNoteInput.tagIds as any, user: { id: user.id } },
        });
        note.tags = tags;
      } else {
        note.tags = [];
      }
    }

    return this.notesRepository.save(note);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    const note = await this.findOne(id, userId);
    await this.notesRepository.remove(note);
    return true;
  }

  async pin(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isPinned = true;
    return this.notesRepository.save(note);
  }

  async unpin(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isPinned = false;
    return this.notesRepository.save(note);
  }

  async archive(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isArchived = true;
    return this.notesRepository.save(note);
  }

  async unarchive(id: string, userId: string): Promise<Note> {
    const note = await this.findOne(id, userId);
    note.isArchived = false;
    return this.notesRepository.save(note);
  }

  async findPinned(user: User): Promise<Note[]> {
    return this.searchService.findPinned(user.id);
  }

  async findRecent(user: User, limit: number = 10): Promise<Note[]> {
    return this.searchService.findRecent(user.id, limit);
  }
}
