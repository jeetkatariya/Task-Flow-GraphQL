# Neuroscale — Full-Stack Productivity Platform

A production-grade productivity application built with **NestJS**, **GraphQL**, **PostgreSQL**, and **React**. Designed to demonstrate expertise in TypeScript, GraphQL API design, relational database modeling, and modern full-stack architecture.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS 10, TypeScript 5, Apollo Server 4 |
| **API** | GraphQL (code-first), Subscriptions (WebSocket) |
| **Database** | PostgreSQL 15 (Aurora-compatible), TypeORM |
| **Frontend** | React 18, Vite 5, Apollo Client 3, Material-UI 5 |
| **Auth** | JWT (Passport.js), bcrypt password hashing |
| **Infra** | Docker Compose, PM2, Nginx, Let's Encrypt SSL |
| **Deployment** | EC2 (backend), Vercel (frontend) |

## Features

### Task Management
- CRUD with priority, status, due dates, and completion tracking
- Category and tag organization with many-to-many relations
- Task dependencies (self-referential graph with cycle prevention)
- Full-text search using PostgreSQL `tsvector` / GIN indexes
- Overdue and upcoming task queries
- Bulk update and dependency chain resolution (recursive CTE)
- Real-time subscriptions for task events
- Computed fields via GraphQL field resolvers (overdue flag, days-until-due, priority score)

### Notes
- Rich text notes with pinning, archiving, and category/tag filtering
- Full-text search with weighted ranking (`ts_rank`, `setweight`)
- Attachments support (schema-ready)

### Habits
- Daily/weekly/custom frequency tracking
- Habit logging with streak calculation (PostgreSQL stored function)
- Analytics service with weekly completion rates (window functions, CTEs)

### Reminders
- Time-based reminders with timezone support
- JSONB recurrence patterns (daily/weekly/monthly/yearly)
- Cron-based scheduler (`@nestjs/schedule`) for due-reminder processing
- Snooze and completion workflows

### Auth & Security
- JWT authentication with Passport strategies
- Password hashing (bcrypt, 10 rounds)
- Helmet security headers
- Rate limiting via custom GraphQL throttler guard
- CORS configuration
- Query complexity analysis plugin

## Project Structure

```
├── src/                          # NestJS backend
│   ├── app.module.ts             # Root module (GraphQL, TypeORM, throttler, scheduler)
│   ├── main.ts                   # Bootstrap with global pipes, filters, interceptors
│   ├── polyfills.ts              # crypto.randomUUID polyfill for @nestjs/schedule
│   ├── auth/                     # JWT auth module (service, resolver, guards, strategies)
│   ├── tasks/                    # Tasks module
│   │   ├── entities/             # Task, TaskCategory, TaskTag, TaskDependency
│   │   ├── dto/                  # Input types, filter, sort, pagination, response
│   │   ├── services/             # TasksService, TaskQueryBuilderService
│   │   ├── resolvers/            # TasksResolver, TaskFieldResolver
│   │   └── loaders/              # DataLoader for N+1 prevention
│   ├── notes/                    # Notes module (search service with tsvector)
│   ├── habits/                   # Habits module (streak + analytics services)
│   ├── reminders/                # Reminders module (scheduler service with cron)
│   ├── users/                    # Users module
│   ├── posts/                    # Posts module (blog-style CRUD)
│   ├── comments/                 # Comments module
│   ├── common/                   # Guards, filters, interceptors, plugins
│   └── shared/                   # Shared TypeScript types
├── frontend/                     # React + Vite frontend
│   └── src/
│       ├── pages/                # Dashboard, Tasks, Notes, Habits, Reminders, etc.
│       ├── graphql/              # Queries and mutations per feature
│       ├── components/           # Reusable UI components
│       ├── contexts/             # AuthContext (JWT storage + Apollo link)
│       ├── lib/                  # Apollo Client setup (auth link, error link)
│       └── theme/                # Material-UI theme
├── ddl/                          # PostgreSQL DDL scripts (ordered migration files)
├── scripts/                      # Deployment scripts (EC2, SSL, DB setup)
├── docker-compose.yml            # Local PostgreSQL container
├── ecosystem.config.js           # PM2 production config
├── nginx.conf                    # Nginx reverse proxy + SSL
└── vercel.json                   # Vercel frontend deployment config
```

## Database Design

### Schema Highlights
- **16 tables** across users, posts, comments, tasks, notes, habits, and reminders
- UUID primary keys (`uuid_generate_v4()`)
- Composite and partial indexes for query optimization
- `tsvector` columns with GIN indexes for full-text search
- `JSONB` columns for flexible recurrence patterns
- Self-referential many-to-many (task dependencies) with cycle check constraints
- Stored functions: `update_habit_streak()`, `update_note_search_vector()`
- Triggers for `updated_at` timestamps and search vector maintenance

### DDL Scripts (run in order)
| File | Purpose |
|------|---------|
| `01_create_schema.sql` | Core tables (users, posts, comments), indexes, triggers |
| `02_seed_data.sql` | Sample users with hashed passwords, posts, comments |
| `04_add_password_column.sql` | Migration: add password column to users |
| `05_productivity_schema.sql` | Productivity tables, indexes, triggers, stored functions |
| `06_productivity_seed_data.sql` | Sample tasks, notes, habits, reminders |
| `07_performance_indexes.sql` | Additional performance indexes |

## Quick Start

### Prerequisites
- Node.js ≥ 18
- Docker & Docker Compose
- npm or yarn

### 1. Clone and install

```bash
git clone <repo-url> && cd Neuroscale
npm install
cd frontend && npm install && cd ..
```

### 2. Start PostgreSQL

```bash
docker compose up -d
```

### 3. Run DDL scripts

```bash
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/01_create_schema.sql
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/04_add_password_column.sql
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/02_seed_data.sql
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/05_productivity_schema.sql
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/06_productivity_seed_data.sql
docker exec -i graphql-demo-db psql -U postgres -d graphql_demo < ddl/07_performance_indexes.sql
```

### 4. Start the backend

```bash
npm run start:dev
```

Backend runs at `http://localhost:3000/graphql`

### 5. Start the frontend

```bash
cd frontend && npm run dev
```

Frontend runs at `http://localhost:3001`

### 6. Login

| Email | Password |
|-------|----------|
| alice@example.com | password123 |
| bob@example.com | password123 |
| charlie@example.com | password123 |

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=graphql_demo
DB_SSL=false
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3001
NODE_ENV=development
PORT=3000
```

## GraphQL API

### Key Queries
- `tasks(filter, sort, pagination)` — paginated task list with filtering and sorting
- `task(id)` — single task with dependencies and computed fields
- `overdueTasks` / `upcomingTasks(days)` — deadline-based queries
- `taskDependencyChain(taskId)` — recursive CTE dependency resolution
- `notes(search)` — full-text search with tsvector ranking
- `habits` / `habitStats(habitId, periodDays)` — habit analytics
- `reminders(upcoming)` / `remindersForDate(date)` — reminder queries

### Key Mutations
- `createTask` / `updateTask` / `removeTask` / `completeTask` / `bulkUpdateTasks`
- `createNote` / `updateNote` / `pinNote` / `archiveNote`
- `createHabit` / `logHabit` / `updateHabit`
- `createReminder` / `snoozeReminder` / `completeReminder`
- `login` / `signup`

### Subscriptions
- `taskCreated` / `taskUpdated` / `taskCompleted`
- `reminderCreated` / `reminderDue`

## Production Deployment

### Backend (EC2 + PM2)

```bash
npm run build
pm2 start ecosystem.config.js
```

### Frontend (Vercel)

Push to GitHub and connect the repository in Vercel. Configuration is in `vercel.json`.

### Nginx + SSL

See `nginx.conf` for the reverse proxy configuration. Use the scripts in `scripts/` for automated setup:

```bash
./scripts/setup-ec2.sh    # EC2 instance setup
./scripts/setup-ssl.sh    # Let's Encrypt SSL
./scripts/deploy.sh       # Deployment automation
```

## Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| Code-first GraphQL | Type safety from TypeScript decorators; single source of truth |
| TypeORM with manual DDL | `synchronize: false` for production safety; versioned migrations |
| DataLoader pattern | Prevents N+1 queries in nested GraphQL resolvers |
| Custom query builder | Composable, testable query construction for complex filters |
| JSONB for recurrence | Flexible schema for varying recurrence patterns |
| tsvector + GIN indexes | Native PostgreSQL full-text search without external dependencies |
| Stored functions | Streak calculation in the database for atomicity and performance |
| Global exception filter | Consistent error handling across HTTP and GraphQL contexts |
| Throttler guard | Rate limiting adapted for GraphQL context extraction |

## License

MIT
