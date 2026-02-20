import './polyfills';

import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD } from '@nestjs/core';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { NotesModule } from './notes/notes.module';
import { HabitsModule } from './habits/habits.module';
import { RemindersModule } from './reminders/reminders.module';
import { GqlThrottlerGuard } from './common/guards/gql-throttler.guard';
import { User } from './users/entities/user.entity';
import { Post } from './posts/entities/post.entity';
import { Comment } from './comments/entities/comment.entity';
import { Task } from './tasks/entities/task.entity';
import { TaskCategory } from './tasks/entities/task-category.entity';
import { TaskTag } from './tasks/entities/task-tag.entity';
import { TaskDependency } from './tasks/entities/task-dependency.entity';
import { Note } from './notes/entities/note.entity';
import { NoteCategory } from './notes/entities/note-category.entity';
import { NoteTag } from './notes/entities/note-tag.entity';
import { NoteAttachment } from './notes/entities/note-attachment.entity';
import { Habit } from './habits/entities/habit.entity';
import { HabitLog } from './habits/entities/habit-log.entity';
import { HabitStreak } from './habits/entities/habit-streak.entity';
import { Reminder } from './reminders/entities/reminder.entity';
import { ReminderNotification } from './reminders/entities/reminder-notification.entity';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      context: ({ req, res }) => ({ req, res }),
      subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': true,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{
        ttl: 60000,
        limit: 100,
      }],
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'graphql_demo',
      entities: [
        User, Post, Comment,
        Task, TaskCategory, TaskTag, TaskDependency,
        Note, NoteCategory, NoteTag, NoteAttachment,
        Habit, HabitLog, HabitStreak,
        Reminder, ReminderNotification,
      ],
      synchronize: false,
      logging: process.env.NODE_ENV === 'development',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    AuthModule,
    TasksModule,
    NotesModule,
    HabitsModule,
    RemindersModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
