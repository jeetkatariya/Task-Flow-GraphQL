# User Data Association — Complete Audit & Guide

This document provides a comprehensive analysis of how all data (tasks, notes, habits, reminders, categories, tags) is associated with specific users in the Neuroscale productivity application. It covers the current state, any gaps, required changes, and provides multi-user sample data.

---

## Table of Contents

1. [Current State — What's Already in Place](#1-current-state--whats-already-in-place)
2. [Architecture Overview](#2-architecture-overview)
3. [Identified Gaps & Required Changes](#3-identified-gaps--required-changes)
4. [Database Changes](#4-database-changes)
5. [Backend Code Changes](#5-backend-code-changes)
6. [Multi-User Sample Data](#6-multi-user-sample-data)
7. [Testing Multi-User Isolation](#7-testing-multi-user-isolation)
8. [Optional Enhancements (Row-Level Security)](#8-optional-enhancements-row-level-security)

---

## 1. Current State — What's Already in Place

### ✅ Database Schema (All Tables Have `user_id`)

| Table               | `user_id` FK | ON DELETE | Unique Constraint               | Status |
|---------------------|:------------:|:---------:|----------------------------------|:------:|
| `tasks`             | ✅            | CASCADE   | —                                | ✅      |
| `task_categories`   | ✅            | CASCADE   | `(user_id, name)`                | ✅      |
| `task_tags`         | ✅            | CASCADE   | `(user_id, name)`                | ✅      |
| `notes`             | ✅            | CASCADE   | —                                | ✅      |
| `note_categories`   | ✅            | CASCADE   | `(user_id, name)`                | ✅      |
| `note_tags`         | ✅            | CASCADE   | `(user_id, name)`                | ✅      |
| `habits`            | ✅            | CASCADE   | —                                | ✅      |
| `reminders`         | ✅            | CASCADE   | —                                | ✅      |
| `habit_logs`        | —            | CASCADE   | `(habit_id, date)` — indirectly scoped via habit | ✅ |
| `habit_streaks`     | —            | CASCADE   | `(habit_id)` — indirectly scoped via habit | ✅ |
| `note_attachments`  | —            | CASCADE   | — indirectly scoped via note     | ✅      |
| `reminder_notifications` | —       | CASCADE   | — indirectly scoped via reminder | ✅      |
| `task_dependencies` | —            | CASCADE   | `(task_id, depends_on_task_id)` — indirectly scoped | ✅ |
| `task_tags_relation` | —           | CASCADE   | PK `(task_id, tag_id)` — indirectly scoped | ✅ |
| `note_tags_relation` | —           | CASCADE   | PK `(note_id, tag_id)` — indirectly scoped | ✅ |

### ✅ TypeORM Entities (All Have User Relationships)

Every productivity entity has a `@ManyToOne(() => User)` relationship with `@JoinColumn({ name: 'user_id' })`:
- `Task.user` ✅
- `TaskCategory.user` ✅
- `TaskTag.user` ✅
- `Note.user` ✅
- `NoteCategory.user` ✅
- `NoteTag.user` ✅
- `Habit.user` ✅
- `Reminder.user` ✅

Child entities (`HabitLog`, `HabitStreak`, `NoteAttachment`, `ReminderNotification`, `TaskDependency`) are scoped through their parent entity.

### ✅ Services (All Filter by User)

| Service                   | Filters by `user.id` | Ownership Verification |
|---------------------------|:--------------------:|:---------------------:|
| `TasksService`            | ✅ All methods        | ✅ `findOne` checks user |
| `TaskQueryBuilderService` | ✅ All queries        | ✅ WHERE `user_id`      |
| `NotesService`            | ✅ All methods        | ✅ `findOne` checks user |
| `NotesSearchService`      | ✅ All queries        | ✅ WHERE `user_id`      |
| `HabitsService`           | ✅ All methods        | ✅ `findOne` checks user |
| `RemindersService`        | ✅ All methods        | ✅ `findOne` checks user |

### ✅ Resolvers (All Use Auth Guards)

Every productivity resolver uses `@UseGuards(JwtAuthGuard)` and `@CurrentUser()` decorator:
- `TasksResolver` — all queries/mutations ✅
- `NotesResolver` — all queries/mutations ✅
- `HabitsResolver` — all queries/mutations ✅
- `RemindersResolver` — all queries/mutations ✅

### ✅ Performance Indexes (All Include `user_id`)

All composite indexes include `user_id` for optimal query performance:
- `idx_tasks_user_status`, `idx_tasks_user_priority`, `idx_tasks_user_due_date`
- `idx_notes_user_pinned`, `idx_notes_user_archived`
- `idx_habits_user`
- `idx_reminders_user_time`

---

## 2. Architecture Overview

```
┌────────────────┐     JWT Token      ┌──────────────────────┐
│   Frontend     │ ──────────────────► │  JwtAuthGuard        │
│  (React App)   │                     │  Extracts user from  │
│                │                     │  Authorization header│
└────────────────┘                     └──────────┬───────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  @CurrentUser()      │
                                       │  Injects User entity │
                                       │  into resolver       │
                                       └──────────┬───────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  Service Layer       │
                                       │  All queries include │
                                       │  WHERE user_id = ?   │
                                       └──────────┬───────────┘
                                                  │
                                                  ▼
                                       ┌──────────────────────┐
                                       │  PostgreSQL          │
                                       │  FK: user_id → users │
                                       │  CASCADE ON DELETE   │
                                       └──────────────────────┘
```

**Data flow for every request:**
1. Frontend sends JWT token in `Authorization` header
2. `JwtAuthGuard` validates the token and extracts the user ID
3. `@CurrentUser()` decorator injects the full `User` entity
4. Service layer **always** filters by `user.id` in every query
5. Database enforces referential integrity via foreign keys

---

## 3. Identified Gaps & Required Changes

### Gap 1: `User` Entity Missing `OneToMany` Relationships

**Current:** The `User` entity only declares `OneToMany` for `posts`, `comments`, and `tasks`.  
**Missing:** `notes`, `habits`, `reminders` (and optionally `taskCategories`, `taskTags`, `noteCategories`, `noteTags`).

**Impact:** Low. This doesn't break user isolation (services use direct queries), but prevents navigating from `User → Notes/Habits/Reminders` through TypeORM relations.

**Fix (in `src/users/entities/user.entity.ts`):**

```typescript
// Add these imports
import { Note } from '../../notes/entities/note.entity';
import { Habit } from '../../habits/entities/habit.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';

// Add these relationships to the User class:

@Field(() => [Note], { nullable: true })
@OneToMany(() => Note, (note) => note.user)
notes?: Note[];

@Field(() => [Habit], { nullable: true })
@OneToMany(() => Habit, (habit) => habit.user)
habits?: Habit[];

@Field(() => [Reminder], { nullable: true })
@OneToMany(() => Reminder, (reminder) => reminder.user)
reminders?: Reminder[];
```

### Gap 2: Seed Data Only for One User

**Current:** All productivity seed data (`06_productivity_seed_data.sql`) is assigned to Alice (`550e8400-...440000`). Bob and Charlie have no tasks, notes, habits, or reminders.

**Impact:** Cannot demonstrate multi-user isolation. When logging in as Bob or Charlie, the dashboard appears empty.

**Fix:** See [Section 6: Multi-User Sample Data](#6-multi-user-sample-data) below.

### Gap 3: `UsersResolver` Has No Auth Guards

**Current:** The `UsersResolver` exposes `users` (list all), `user` (get by ID), `createUser`, `updateUser`, and `removeUser` without any authentication.

**Impact:** Medium. Any unauthenticated request can list all users, or update/delete any user.

**Fix (in `src/users/users.resolver.ts`):**

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  // ...

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  // Remove or guard findAll, findOne, updateUser, removeUser
  // At minimum, add @UseGuards(JwtAuthGuard) to mutations
}
```

### Gap 4: Posts/Comments Are Not User-Scoped (By Design)

**Current:** Posts and comments are a "social/public" feature — `findAll` for posts returns all published posts, not just the current user's. `findAll` for comments returns all comments.

**Impact:** None for the productivity features. Posts/comments are a separate domain. If you want them user-scoped, add `user.id` filtering to `PostsService.findAll()` and `CommentsService.findAll()`.

**No change needed** — this is intentional for the blog/social demo module.

---

## 4. Database Changes

### No DDL Changes Required

The database schema **already has all necessary `user_id` columns and foreign keys.** Every productivity table is correctly linked to the `users` table with `ON DELETE CASCADE`.

The only database work needed is **inserting additional seed data** for Bob and Charlie (see Section 6).

### Summary of Existing Database Protections

| Protection                   | Status |
|------------------------------|:------:|
| `user_id NOT NULL` on all tables | ✅ |
| Foreign key to `users(id)`   | ✅     |
| `ON DELETE CASCADE`          | ✅     |
| Unique constraints per user  | ✅ (categories, tags) |
| Performance indexes with `user_id` | ✅ |

---

## 5. Backend Code Changes

### Change 1: Update `User` Entity (Gap 1)

**File:** `src/users/entities/user.entity.ts`

Add missing `OneToMany` relationships:

```typescript
import { Note } from '../../notes/entities/note.entity';
import { Habit } from '../../habits/entities/habit.entity';
import { Reminder } from '../../reminders/entities/reminder.entity';

// Inside the User class, add:

@Field(() => [Note], { nullable: true })
@OneToMany(() => Note, (note) => note.user)
notes?: Note[];

@Field(() => [Habit], { nullable: true })
@OneToMany(() => Habit, (habit) => habit.user)
habits?: Habit[];

@Field(() => [Reminder], { nullable: true })
@OneToMany(() => Reminder, (reminder) => reminder.user)
reminders?: Reminder[];
```

### Change 2: Add Auth Guards to `UsersResolver` (Gap 3)

**File:** `src/users/users.resolver.ts`

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: 'me' })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: User) {
    return this.usersService.findOne(user.id);
  }

  @Query(() => [User], { name: 'users' })
  @UseGuards(JwtAuthGuard)  // <-- ADD THIS
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)  // <-- ADD THIS
  updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser() user: User,  // <-- ADD THIS
  ) {
    // Optional: Verify user can only update themselves
    if (id !== user.id) {
      throw new ForbiddenException('You can only update your own profile');
    }
    return this.usersService.update(id, updateUserInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)  // <-- ADD THIS
  async removeUser(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,  // <-- ADD THIS
  ) {
    if (id !== user.id) {
      throw new ForbiddenException('You can only delete your own account');
    }
    return this.usersService.remove(id);
  }
}
```

### No Other Backend Changes Needed

All services, resolvers, and guards for productivity features (Tasks, Notes, Habits, Reminders) are **already correctly scoped to the authenticated user**.

---

## 6. Multi-User Sample Data

### New DDL Script: `ddl/08_multi_user_seed_data.sql`

This script adds productivity data for Bob and Charlie. Run this **after** the existing seed scripts.

```sql
-- ============================================================
-- Multi-User Seed Data
-- Adds productivity data for Bob and Charlie
-- Run AFTER: 02_seed_data.sql and 06_productivity_seed_data.sql
-- ============================================================

-- ============================================================
-- BOB'S DATA (550e8400-e29b-41d4-a716-446655440001)
-- ============================================================

-- Bob's Task Categories
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('800e8400-e29b-41d4-a716-446655440010', 'Development', '#2196f3', '550e8400-e29b-41d4-a716-446655440001'),
    ('800e8400-e29b-41d4-a716-446655440011', 'Fitness', '#e91e63', '550e8400-e29b-41d4-a716-446655440001'),
    ('800e8400-e29b-41d4-a716-446655440012', 'Side Projects', '#ff5722', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- Bob's Task Tags
INSERT INTO task_tags (id, name, user_id) VALUES
    ('900e8400-e29b-41d4-a716-446655440010', 'backend', '550e8400-e29b-41d4-a716-446655440001'),
    ('900e8400-e29b-41d4-a716-446655440011', 'frontend', '550e8400-e29b-41d4-a716-446655440001'),
    ('900e8400-e29b-41d4-a716-446655440012', 'bug', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- Bob's Tasks
INSERT INTO tasks (id, title, description, priority, status, due_date, user_id, category_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440010', 'Build REST API for mobile app', 'Create REST endpoints for the mobile client', 'high', 'in_progress', CURRENT_DATE + INTERVAL '3 days', '550e8400-e29b-41d4-a716-446655440001', '800e8400-e29b-41d4-a716-446655440010'),
    ('a00e8400-e29b-41d4-a716-446655440011', 'Fix authentication bug', 'Users are getting logged out unexpectedly', 'urgent', 'todo', CURRENT_DATE + INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440001', '800e8400-e29b-41d4-a716-446655440010'),
    ('a00e8400-e29b-41d4-a716-446655440012', 'Gym session - Leg day', 'Squats, lunges, leg press, calf raises', 'medium', 'todo', CURRENT_DATE, '550e8400-e29b-41d4-a716-446655440001', '800e8400-e29b-41d4-a716-446655440011'),
    ('a00e8400-e29b-41d4-a716-446655440013', 'Design portfolio website', 'Create a personal portfolio with React', 'low', 'todo', CURRENT_DATE + INTERVAL '14 days', '550e8400-e29b-41d4-a716-446655440001', '800e8400-e29b-41d4-a716-446655440012'),
    ('a00e8400-e29b-41d4-a716-446655440014', 'Code review for PR #42', 'Review the database migration PR', 'high', 'done', CURRENT_DATE - INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440001', '800e8400-e29b-41d4-a716-446655440010')
ON CONFLICT DO NOTHING;

-- Bob's Task-Tag Relations
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440010', '900e8400-e29b-41d4-a716-446655440010'),
    ('a00e8400-e29b-41d4-a716-446655440011', '900e8400-e29b-41d4-a716-446655440012'),
    ('a00e8400-e29b-41d4-a716-446655440013', '900e8400-e29b-41d4-a716-446655440011')
ON CONFLICT DO NOTHING;

-- Bob's Note Categories
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b00e8400-e29b-41d4-a716-446655440010', 'Architecture', '#673ab7', '550e8400-e29b-41d4-a716-446655440001'),
    ('b00e8400-e29b-41d4-a716-446655440011', 'Meeting Notes', '#009688', '550e8400-e29b-41d4-a716-446655440001'),
    ('b00e8400-e29b-41d4-a716-446655440012', 'Recipes', '#795548', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- Bob's Notes
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c00e8400-e29b-41d4-a716-446655440010', 'Microservices Architecture Notes', '# Microservices Patterns

## Key Principles
- Single Responsibility per service
- API Gateway for routing
- Event-driven communication (Kafka/RabbitMQ)

## Database per Service
- Each service owns its data
- Use sagas for distributed transactions
- CQRS for read-heavy services', '550e8400-e29b-41d4-a716-446655440001', 'b00e8400-e29b-41d4-a716-446655440010', true),
    ('c00e8400-e29b-41d4-a716-446655440011', 'Sprint Planning - Feb 2026', '## Sprint Goals
1. Complete authentication module
2. Deploy staging environment
3. Write integration tests

## Action Items
- Bob: REST API endpoints
- Team: Code review process', '550e8400-e29b-41d4-a716-446655440001', 'b00e8400-e29b-41d4-a716-446655440011', false),
    ('c00e8400-e29b-41d4-a716-446655440012', 'Chicken Tikka Masala Recipe', '## Ingredients
- 500g chicken breast
- 200ml yogurt
- Tikka masala paste
- Coconut cream

## Steps
1. Marinate chicken overnight
2. Grill on high heat
3. Prepare sauce
4. Combine and simmer 20 min', '550e8400-e29b-41d4-a716-446655440001', 'b00e8400-e29b-41d4-a716-446655440012', false)
ON CONFLICT DO NOTHING;

-- Bob's Habits
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d00e8400-e29b-41d4-a716-446655440010', 'Morning Run', '5K run every morning before work', '550e8400-e29b-41d4-a716-446655440001', 'daily', ARRAY[1,2,3,4,5], '#e91e63'),
    ('d00e8400-e29b-41d4-a716-446655440011', 'Read 30 Pages', 'Read at least 30 pages of a book daily', '550e8400-e29b-41d4-a716-446655440001', 'daily', ARRAY[0,1,2,3,4,5,6], '#ff9800'),
    ('d00e8400-e29b-41d4-a716-446655440012', 'Meditate', '15 minutes of guided meditation', '550e8400-e29b-41d4-a716-446655440001', 'daily', ARRAY[0,1,2,3,4,5,6], '#9c27b0')
ON CONFLICT DO NOTHING;

-- Bob's Habit Logs
INSERT INTO habit_logs (habit_id, date, completed) VALUES
    ('d00e8400-e29b-41d4-a716-446655440010', CURRENT_DATE - INTERVAL '5 days', true),
    ('d00e8400-e29b-41d4-a716-446655440010', CURRENT_DATE - INTERVAL '4 days', true),
    ('d00e8400-e29b-41d4-a716-446655440010', CURRENT_DATE - INTERVAL '3 days', false),
    ('d00e8400-e29b-41d4-a716-446655440010', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440010', CURRENT_DATE - INTERVAL '1 day', true),
    ('d00e8400-e29b-41d4-a716-446655440011', CURRENT_DATE - INTERVAL '4 days', true),
    ('d00e8400-e29b-41d4-a716-446655440011', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440011', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440011', CURRENT_DATE - INTERVAL '1 day', true),
    ('d00e8400-e29b-41d4-a716-446655440012', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440012', CURRENT_DATE - INTERVAL '1 day', true)
ON CONFLICT DO NOTHING;

-- Update Bob's habit streaks
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440010');
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440011');
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440012');

-- Bob's Reminders
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring) VALUES
    ('e00e8400-e29b-41d4-a716-446655440010', 'Stand-up Meeting', 'Daily standup at 9:30 AM', '550e8400-e29b-41d4-a716-446655440001', NULL, CURRENT_DATE + INTERVAL '1 day' + TIME '09:30:00', 'UTC', true),
    ('e00e8400-e29b-41d4-a716-446655440011', 'Fix auth bug deadline', 'Critical bug fix due', '550e8400-e29b-41d4-a716-446655440001', 'a00e8400-e29b-41d4-a716-446655440011', CURRENT_DATE + INTERVAL '1 day' + TIME '17:00:00', 'UTC', false),
    ('e00e8400-e29b-41d4-a716-446655440012', 'Gym Time', 'Time for workout', '550e8400-e29b-41d4-a716-446655440001', NULL, CURRENT_DATE + TIME '18:00:00', 'UTC', true)
ON CONFLICT DO NOTHING;


-- ============================================================
-- CHARLIE'S DATA (550e8400-e29b-41d4-a716-446655440002)
-- ============================================================

-- Charlie's Task Categories
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('800e8400-e29b-41d4-a716-446655440020', 'Homework', '#3f51b5', '550e8400-e29b-41d4-a716-446655440002'),
    ('800e8400-e29b-41d4-a716-446655440021', 'Job Search', '#ff9800', '550e8400-e29b-41d4-a716-446655440002'),
    ('800e8400-e29b-41d4-a716-446655440022', 'Household', '#4caf50', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Charlie's Task Tags
INSERT INTO task_tags (id, name, user_id) VALUES
    ('900e8400-e29b-41d4-a716-446655440020', 'deadline', '550e8400-e29b-41d4-a716-446655440002'),
    ('900e8400-e29b-41d4-a716-446655440021', 'interview', '550e8400-e29b-41d4-a716-446655440002'),
    ('900e8400-e29b-41d4-a716-446655440022', 'study', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Charlie's Tasks
INSERT INTO tasks (id, title, description, priority, status, due_date, user_id, category_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440020', 'Prepare resume for Google', 'Tailor resume for SDE-2 position at Google', 'urgent', 'in_progress', CURRENT_DATE + INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440002', '800e8400-e29b-41d4-a716-446655440021'),
    ('a00e8400-e29b-41d4-a716-446655440021', 'LeetCode - Dynamic Programming', 'Solve 10 DP problems from Blind 75', 'high', 'in_progress', CURRENT_DATE + INTERVAL '4 days', '550e8400-e29b-41d4-a716-446655440002', '800e8400-e29b-41d4-a716-446655440020'),
    ('a00e8400-e29b-41d4-a716-446655440022', 'System Design study', 'Review Designing Data-Intensive Applications Ch. 5-8', 'high', 'todo', CURRENT_DATE + INTERVAL '7 days', '550e8400-e29b-41d4-a716-446655440002', '800e8400-e29b-41d4-a716-446655440020'),
    ('a00e8400-e29b-41d4-a716-446655440023', 'Clean apartment', 'Deep clean before guests arrive', 'medium', 'todo', CURRENT_DATE + INTERVAL '3 days', '550e8400-e29b-41d4-a716-446655440002', '800e8400-e29b-41d4-a716-446655440022'),
    ('a00e8400-e29b-41d4-a716-446655440024', 'Submit expense report', 'February expenses from trip', 'low', 'done', CURRENT_DATE - INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440002', NULL)
ON CONFLICT DO NOTHING;

-- Charlie's Task-Tag Relations
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440020', '900e8400-e29b-41d4-a716-446655440021'),
    ('a00e8400-e29b-41d4-a716-446655440020', '900e8400-e29b-41d4-a716-446655440020'),
    ('a00e8400-e29b-41d4-a716-446655440021', '900e8400-e29b-41d4-a716-446655440022'),
    ('a00e8400-e29b-41d4-a716-446655440022', '900e8400-e29b-41d4-a716-446655440022')
ON CONFLICT DO NOTHING;

-- Charlie's Note Categories
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b00e8400-e29b-41d4-a716-446655440020', 'DSA Notes', '#f44336', '550e8400-e29b-41d4-a716-446655440002'),
    ('b00e8400-e29b-41d4-a716-446655440021', 'Company Research', '#607d8b', '550e8400-e29b-41d4-a716-446655440002'),
    ('b00e8400-e29b-41d4-a716-446655440022', 'Personal Journal', '#8bc34a', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Charlie's Notes
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c00e8400-e29b-41d4-a716-446655440020', 'Dynamic Programming Patterns', '# DP Patterns Cheat Sheet

## Common Patterns
1. **0/1 Knapsack** - subset sum, partition equal subset
2. **Unbounded Knapsack** - coin change, rod cutting
3. **LCS** - longest common subsequence/substring
4. **LIS** - longest increasing subsequence
5. **Matrix Chain** - burst balloons, MCM

## Template
```
dp[i] = best answer considering elements 0..i
dp[i] = max(dp[i-1], dp[j] + value[i]) for valid j
```', '550e8400-e29b-41d4-a716-446655440002', 'b00e8400-e29b-41d4-a716-446655440020', true),
    ('c00e8400-e29b-41d4-a716-446655440021', 'Google Interview Prep', '## Google SDE-2 Interview Format
- 1 Phone Screen (45 min coding)
- 4-5 Onsite Rounds:
  - 2 Coding rounds
  - 1 System Design
  - 1 Googleyness & Leadership
  - 1 mixed

## Key Areas
- Graph algorithms (BFS, DFS, Dijkstra)
- Trees (BST, segment trees, tries)
- Dynamic Programming
- System Design (distributed systems)', '550e8400-e29b-41d4-a716-446655440002', 'b00e8400-e29b-41d4-a716-446655440021', true),
    ('c00e8400-e29b-41d4-a716-446655440022', 'Weekly Reflection - Feb 17', '## Wins this week
- Solved 15 LeetCode problems
- Completed mock interview with mentor
- Fixed portfolio website deployment

## Areas to improve
- Need to practice system design verbally
- Time management during timed coding
- Sleep schedule is inconsistent', '550e8400-e29b-41d4-a716-446655440002', 'b00e8400-e29b-41d4-a716-446655440022', false)
ON CONFLICT DO NOTHING;

-- Charlie's Habits
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d00e8400-e29b-41d4-a716-446655440020', 'LeetCode Daily', 'Solve at least 2 LeetCode problems', '550e8400-e29b-41d4-a716-446655440002', 'daily', ARRAY[0,1,2,3,4,5,6], '#f44336'),
    ('d00e8400-e29b-41d4-a716-446655440021', 'Mock Interviews', 'Practice mock interviews on Pramp/Interviewing.io', '550e8400-e29b-41d4-a716-446655440002', 'weekly', ARRAY[2,4], '#3f51b5'),
    ('d00e8400-e29b-41d4-a716-446655440022', 'Journal Writing', 'Write daily reflections and gratitude', '550e8400-e29b-41d4-a716-446655440002', 'daily', ARRAY[0,1,2,3,4,5,6], '#8bc34a')
ON CONFLICT DO NOTHING;

-- Charlie's Habit Logs
INSERT INTO habit_logs (habit_id, date, completed) VALUES
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '6 days', true),
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '5 days', true),
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '4 days', true),
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE - INTERVAL '1 day', true),
    ('d00e8400-e29b-41d4-a716-446655440021', CURRENT_DATE - INTERVAL '5 days', true),
    ('d00e8400-e29b-41d4-a716-446655440021', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - INTERVAL '4 days', true),
    ('d00e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440022', CURRENT_DATE - INTERVAL '1 day', true)
ON CONFLICT DO NOTHING;

-- Update Charlie's habit streaks
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440020');
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440021');
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440022');

-- Charlie's Reminders
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring) VALUES
    ('e00e8400-e29b-41d4-a716-446655440020', 'LeetCode Time', 'Time to solve LeetCode problems', '550e8400-e29b-41d4-a716-446655440002', NULL, CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00', 'UTC', true),
    ('e00e8400-e29b-41d4-a716-446655440021', 'Google Resume Deadline', 'Submit resume by end of day', '550e8400-e29b-41d4-a716-446655440002', 'a00e8400-e29b-41d4-a716-446655440020', CURRENT_DATE + INTERVAL '2 days' + TIME '18:00:00', 'UTC', false),
    ('e00e8400-e29b-41d4-a716-446655440022', 'Weekly Review', 'Write weekly reflection and plan next week', '550e8400-e29b-41d4-a716-446655440002', NULL, CURRENT_DATE + INTERVAL '5 days' + TIME '20:00:00', 'UTC', true)
ON CONFLICT DO NOTHING;
```

---

## 7. Testing Multi-User Isolation

### Login as Each User

All users have the same default password: `password123`

| User    | Email               | Password      |
|---------|---------------------|---------------|
| Alice   | alice@example.com   | password123   |
| Bob     | bob@example.com     | password123   |
| Charlie | charlie@example.com | password123   |

### Verify Data Isolation via GraphQL Playground

**Step 1: Login as Alice**
```graphql
mutation {
  login(loginInput: { email: "alice@example.com", password: "password123" }) {
    access_token
  }
}
```

**Step 2: Query tasks (should only see Alice's 3 tasks)**
```graphql
# Set Authorization header: Bearer <alice_token>
query {
  tasks {
    tasks {
      id
      title
      user { username }
    }
    meta { total }
  }
}
```

**Step 3: Login as Bob and query tasks (should only see Bob's 5 tasks)**
```graphql
# Set Authorization header: Bearer <bob_token>
query {
  tasks {
    tasks {
      id
      title
      user { username }
    }
    meta { total }
  }
}
```

### Expected Results

| Query          | Alice            | Bob              | Charlie          |
|----------------|:----------------:|:----------------:|:----------------:|
| Tasks          | 3 tasks          | 5 tasks          | 5 tasks          |
| Notes          | 2 notes          | 3 notes          | 3 notes          |
| Habits         | 2 habits         | 3 habits         | 3 habits         |
| Reminders      | 2 reminders      | 3 reminders      | 3 reminders      |
| Task Categories| 3 (Work, Personal, Learning) | 3 (Development, Fitness, Side Projects) | 3 (Homework, Job Search, Household) |

### Cross-User Access Test

Attempt to access Bob's task while logged in as Alice:
```graphql
# Set Authorization header: Bearer <alice_token>
query {
  task(id: "a00e8400-e29b-41d4-a716-446655440010") {
    title
  }
}
```
**Expected result:** `NotFoundException: Task with ID ... not found` (Alice cannot see Bob's data)

---

## 8. Optional Enhancements (Row-Level Security)

For defense-in-depth, you can enable PostgreSQL Row-Level Security (RLS). This ensures data isolation at the database level, even if the application layer has a bug.

> **Note:** RLS requires setting `current_setting('app.current_user_id')` on each database connection, which needs TypeORM subscriber or connection pool hooks. This is an **advanced enhancement** for production deployments.

```sql
-- Enable RLS on productivity tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_tags ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY tasks_user_policy ON tasks
    USING (user_id::text = current_setting('app.current_user_id'));

CREATE POLICY notes_user_policy ON notes
    USING (user_id::text = current_setting('app.current_user_id'));

CREATE POLICY habits_user_policy ON habits
    USING (user_id::text = current_setting('app.current_user_id'));

CREATE POLICY reminders_user_policy ON reminders
    USING (user_id::text = current_setting('app.current_user_id'));

-- In NestJS, set the user ID on each request:
-- await queryRunner.query(`SET LOCAL app.current_user_id = '${user.id}'`);
```

---

## Summary

| Area                    | Status    | Action Required |
|-------------------------|:---------:|-----------------|
| Database schema         | ✅ Done    | No DDL changes needed |
| Foreign keys            | ✅ Done    | All tables have `user_id` FK |
| ON DELETE CASCADE       | ✅ Done    | All FKs cascade on user delete |
| TypeORM entities        | ⚠️ Minor  | Add `OneToMany` for notes, habits, reminders on User entity |
| Services (filtering)    | ✅ Done    | All queries filter by `user.id` |
| Resolvers (auth guards) | ✅ Done    | All productivity resolvers use `JwtAuthGuard` |
| Users resolver           | ⚠️ Minor  | Add `JwtAuthGuard` to mutations |
| Seed data               | ⚠️ Gap    | Add data for Bob and Charlie (script provided) |
| Performance indexes     | ✅ Done    | All include `user_id` |
| Row-Level Security      | ❌ Optional| For production hardening (guide provided) |
