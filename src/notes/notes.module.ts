import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './services/notes.service';
import { NotesSearchService } from './services/notes-search.service';
import { NotesResolver } from './resolvers/notes.resolver';
import { Note } from './entities/note.entity';
import { NoteCategory } from './entities/note-category.entity';
import { NoteTag } from './entities/note-tag.entity';
import { NoteAttachment } from './entities/note-attachment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Note, NoteCategory, NoteTag, NoteAttachment]),
  ],
  providers: [NotesService, NotesSearchService, NotesResolver],
  exports: [NotesService],
})
export class NotesModule {}
