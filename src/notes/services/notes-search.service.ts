import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Note } from '../entities/note.entity';
import { NoteSearchInput } from '../dto/note-search.input';

@Injectable()
export class NotesSearchService {
  constructor(
    @InjectRepository(Note)
    private notesRepository: Repository<Note>,
  ) {}

  buildSearchQuery(
    userId: string,
    searchInput?: NoteSearchInput,
  ): SelectQueryBuilder<Note> {
    let query = this.notesRepository
      .createQueryBuilder('note')
      .leftJoinAndSelect('note.category', 'category')
      .leftJoinAndSelect('note.tags', 'tags')
      .leftJoinAndSelect('note.user', 'user')
      .where('note.user_id = :userId', { userId });

    if (searchInput) {
      if (searchInput.search) {
        query
          .addSelect(
            `ts_rank(note.search_vector, plainto_tsquery('english', :search))`,
            'rank',
          )
          .andWhere(
            `note.search_vector @@ plainto_tsquery('english', :search)`,
            { search: searchInput.search },
          )
          .orderBy('rank', 'DESC');
      }

      if (searchInput.categoryId) {
        query.andWhere('note.category_id = :categoryId', {
          categoryId: searchInput.categoryId,
        });
      }

      if (searchInput.tagIds && searchInput.tagIds.length > 0) {
        query
          .innerJoin('note_tags_relation', 'ntr', 'ntr.note_id = note.id')
          .andWhere('ntr.tag_id IN (:...tagIds)', { tagIds: searchInput.tagIds });
      }

      if (searchInput.isPinned !== undefined) {
        query.andWhere('note.is_pinned = :isPinned', {
          isPinned: searchInput.isPinned,
        });
      }

      if (searchInput.isArchived !== undefined) {
        query.andWhere('note.is_archived = :isArchived', {
          isArchived: searchInput.isArchived,
        });
      }
    }

    if (!searchInput?.search) {
      query.orderBy('note.created_at', 'DESC');
    }

    return query;
  }

  async search(userId: string, searchInput?: NoteSearchInput): Promise<Note[]> {
    const query = this.buildSearchQuery(userId, searchInput);
    return query.getMany();
  }

  async findPinned(userId: string): Promise<Note[]> {
    return this.notesRepository.find({
      where: { user: { id: userId }, isPinned: true },
      relations: ['category', 'tags'],
      order: { createdAt: 'DESC' },
    });
  }

  async findRecent(userId: string, limit: number = 10): Promise<Note[]> {
    return this.notesRepository.find({
      where: { user: { id: userId }, isArchived: false },
      relations: ['category', 'tags'],
      order: { updatedAt: 'DESC' },
      take: limit,
    });
  }
}
