-- ============================================================================
-- COMPREHENSIVE PRODUCTIVITY SEED DATA
-- Covers ALL features for 4 users: Alice, Bob, Charlie, Diana
-- Run AFTER: 01_create_schema.sql, 02_seed_data.sql, 03_productivity_schema.sql
--
-- Every user gets:
--   Tasks  → todo, in_progress, done, overdue
--   Notes  → multiple, some pinned, full-text search content
--   Habits → daily, weekly, custom  + 14 days of logs
--   Reminders → upcoming, overdue, completed, recurring + regular
--
-- All passwords: password123
-- ============================================================================

-- ===========================================================================
-- ALICE  (Software Engineer)  550e8400-e29b-41d4-a716-446655440000
-- ===========================================================================

-- ── Task Categories ──
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('80000000-0000-4000-a000-000000000001', 'Work',     '#1976d2', '550e8400-e29b-41d4-a716-446655440000'),
    ('80000000-0000-4000-a000-000000000002', 'Personal', '#4caf50', '550e8400-e29b-41d4-a716-446655440000'),
    ('80000000-0000-4000-a000-000000000003', 'Learning', '#ff9800', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- ── Task Tags ──
INSERT INTO task_tags (id, name, user_id) VALUES
    ('90000000-0000-4000-a000-000000000001', 'urgent',        '550e8400-e29b-41d4-a716-446655440000'),
    ('90000000-0000-4000-a000-000000000002', 'important',     '550e8400-e29b-41d4-a716-446655440000'),
    ('90000000-0000-4000-a000-000000000003', 'review',        '550e8400-e29b-41d4-a716-446655440000'),
    ('90000000-0000-4000-a000-000000000004', 'documentation', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- ── Tasks ──
INSERT INTO tasks (id, title, description, priority, status, due_date, completed_at, user_id, category_id) VALUES
    -- TODO
    ('a0000000-0000-4000-a000-000000000001', 'Set up CI/CD pipeline',
     'Configure GitHub Actions for automated testing and deployment to AWS',
     'medium', 'todo', CURRENT_DATE + INTERVAL '10 days', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000002', 'Write unit tests for auth module',
     'Cover JWT validation, token refresh, and password hashing edge cases',
     'medium', 'todo', CURRENT_DATE + INTERVAL '7 days', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000003', 'Grocery shopping for meal prep',
     'Buy chicken, rice, broccoli, eggs, olive oil, and spices',
     'low', 'todo', CURRENT_DATE + INTERVAL '1 day', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000002'),

    -- IN PROGRESS
    ('a0000000-0000-4000-a000-000000000004', 'Complete GraphQL API',
     'Finish implementing all GraphQL endpoints including subscriptions and DataLoaders',
     'high', 'in_progress', CURRENT_DATE + INTERVAL '3 days', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000005', 'Implement Redis caching layer',
     'Add caching for frequent queries: tasks list, habit streaks, dashboard stats',
     'high', 'in_progress', CURRENT_DATE + INTERVAL '5 days', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    -- DONE
    ('a0000000-0000-4000-a000-000000000006', 'Deploy staging environment',
     'EC2 instance with PM2, Nginx, SSL, and PostgreSQL connection',
     'high', 'done', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days',
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000007', 'Create database schema and DDL scripts',
     'Design full schema with indexes, triggers, and seed data for all productivity tables',
     'urgent', 'done', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '6 days',
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000008', 'Review TypeScript design patterns',
     'Study builder, strategy, and observer patterns in TypeScript context',
     'medium', 'done', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days',
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000003'),

    -- OVERDUE (past due_date, NOT done)
    ('a0000000-0000-4000-a000-000000000009', 'Fix memory leak in worker service',
     'Node.js process gradually consuming 2GB+ RAM; likely unclosed DB connections',
     'urgent', 'in_progress', CURRENT_DATE - INTERVAL '2 days', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000001'),

    ('a0000000-0000-4000-a000-000000000010', 'Update API documentation',
     'Swagger/GraphQL playground docs are out of date after last sprint changes',
     'medium', 'todo', CURRENT_DATE - INTERVAL '1 day', NULL,
     '550e8400-e29b-41d4-a716-446655440000', '80000000-0000-4000-a000-000000000003')
ON CONFLICT DO NOTHING;

-- ── Task-Tag Relations ──
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a0000000-0000-4000-a000-000000000004', '90000000-0000-4000-a000-000000000001'),
    ('a0000000-0000-4000-a000-000000000004', '90000000-0000-4000-a000-000000000002'),
    ('a0000000-0000-4000-a000-000000000005', '90000000-0000-4000-a000-000000000002'),
    ('a0000000-0000-4000-a000-000000000009', '90000000-0000-4000-a000-000000000001'),
    ('a0000000-0000-4000-a000-000000000010', '90000000-0000-4000-a000-000000000004'),
    ('a0000000-0000-4000-a000-000000000002', '90000000-0000-4000-a000-000000000003')
ON CONFLICT DO NOTHING;

-- ── Note Categories ──
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b0000000-0000-4000-a000-000000000001', 'Interview Prep', '#9c27b0', '550e8400-e29b-41d4-a716-446655440000'),
    ('b0000000-0000-4000-a000-000000000002', 'Study Notes',    '#00bcd4', '550e8400-e29b-41d4-a716-446655440000'),
    ('b0000000-0000-4000-a000-000000000003', 'Accounts',       '#f44336', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- ── Notes ──
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c0000000-0000-4000-a000-000000000001',
     'GraphQL Best Practices',
     '# GraphQL Best Practices

## Query Optimization
- Use DataLoaders to prevent N+1 queries
- Implement query complexity analysis to block expensive queries
- Use fragments for reusable query parts
- Prefer pagination (cursor-based) over fetching all records

## Schema Design
- Use interfaces and unions for polymorphic types
- Implement proper error handling with custom error codes
- Design for future extensibility (nullable fields, input versioning)
- Use enums for fixed sets of values

## Security
- Always validate and sanitize inputs
- Rate-limit at the query level, not just HTTP
- Use depth limiting to prevent recursive query attacks',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000002', true),

    ('c0000000-0000-4000-a000-000000000002',
     'AWS Architecture Reference',
     '# AWS Architecture Notes

## EC2 Setup
- t3.medium for backend, auto-scaling group
- Application Load Balancer with SSL termination
- Security groups: 80/443 public, 3000 internal only

## Database (Aurora PostgreSQL)
- db.r6g.large, Multi-AZ for HA
- Read replicas for analytics queries
- Automated backups: 7-day retention
- Parameter group: shared_buffers, work_mem tuned

## Deployment Pipeline
- GitHub Actions → ECR → ECS Fargate
- Blue/green deployments for zero downtime
- CloudWatch alarms on 5xx rate and latency p99',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000002', true),

    ('c0000000-0000-4000-a000-000000000003',
     'System Design Interview Questions',
     '## Top System Design Questions

1. **URL Shortener** – hashing, base62, read-heavy
2. **Chat System** – WebSockets, message queue, presence
3. **Notification System** – fan-out, priority queues, delivery guarantee
4. **News Feed** – fan-out on write vs read, ranking, caching
5. **Rate Limiter** – token bucket, sliding window, distributed

## Framework (RESHADED)
- Requirements, Estimation, Storage, High-level design,
  API design, Detailed design, Evaluation, Deployment',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000001', false),

    ('c0000000-0000-4000-a000-000000000004',
     'Docker & Kubernetes Cheat Sheet',
     '## Docker Commands
```
docker build -t myapp .
docker run -p 3000:3000 --env-file .env myapp
docker compose up -d
docker logs -f container_name
docker exec -it container_name /bin/sh
```

## Kubernetes Essentials
```
kubectl get pods -n production
kubectl describe pod <pod-name>
kubectl logs <pod-name> --tail=100
kubectl apply -f deployment.yaml
kubectl rollout restart deployment/myapp
```',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000002', false),

    ('c0000000-0000-4000-a000-000000000005',
     'Sprint Planning - Feb 2026',
     '## Sprint 14 Goals
1. Complete habits feature with streak tracking
2. Add reminder notifications (email + in-app)
3. Performance optimization: query caching

## Velocity: 34 story points (up from 28)

## Action Items
- Alice: GraphQL subscriptions + DataLoader (8 pts)
- Team: Code review turnaround < 24h
- DevOps: Set up staging environment monitoring',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000003', false),

    ('c0000000-0000-4000-a000-000000000006',
     'Personal Subscriptions Tracker',
     '## Monthly Subscriptions
| Service        | Cost   | Renewal Date |
|---------------|--------|-------------|
| AWS (personal) | $45    | 1st         |
| GitHub Pro     | $4     | 15th        |
| ChatGPT Plus   | $20    | 22nd        |
| Spotify Family | $16.99 | 5th         |
| iCloud 200GB   | $2.99  | 10th        |

**Total: ~$89/month**

## Annual
- Domain (neuroscale.dev): $12/year – renews Aug
- SSL wildcard: Free (Let''s Encrypt)',
     '550e8400-e29b-41d4-a716-446655440000', 'b0000000-0000-4000-a000-000000000003', false)
ON CONFLICT DO NOTHING;

-- ── Habits ──
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d0000000-0000-4000-a000-000000000001',
     'Morning Exercise',
     '30 minutes of cardio + stretching before work',
     '550e8400-e29b-41d4-a716-446655440000', 'daily', ARRAY[0,1,2,3,4,5,6], '#4caf50'),

    ('d0000000-0000-4000-a000-000000000002',
     'Read Technical Articles',
     'Read at least one in-depth engineering blog post',
     '550e8400-e29b-41d4-a716-446655440000', 'weekly', ARRAY[1,2,3,4,5], '#2196f3'),

    ('d0000000-0000-4000-a000-000000000003',
     'Evening Meditation',
     '15 minutes guided meditation before bed',
     '550e8400-e29b-41d4-a716-446655440000', 'custom', ARRAY[0,1,3,5], '#9c27b0')
ON CONFLICT DO NOTHING;

-- ── Habit Logs (14 days history) ──
INSERT INTO habit_logs (habit_id, date, completed, notes) VALUES
    -- Morning Exercise (daily) – 12/14 completed, gaps on day -8 and day -3
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 13, true,  'Great run, 5K in 28 min'),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 11, true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 10, true,  'Yoga instead of cardio'),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 8,  false, 'Skipped – feeling sick'),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 7,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 5,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 4,  true,  'Strength training'),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 3,  false, 'Rain, skipped'),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 2,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE - 1,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000001', CURRENT_DATE,      true,  'Morning jog 4K'),

    -- Read Technical Articles (weekly Mon-Fri) – logs for weekdays in past 14 days
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 13, true,  'Martin Fowler on microservices'),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 11, true,  'NestJS official docs'),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 10, false, NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 5,  true,  'Apollo GraphQL blog'),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 4,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 2,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000002', CURRENT_DATE - 1,  true,  'TypeORM migration guide'),

    -- Evening Meditation (custom Sun,Mon,Wed,Fri) – logs on target days
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 13, true,  NULL),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 10, true,  'Headspace session'),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 8,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 5,  true,  NULL),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 3,  true,  'Body scan meditation'),
    ('d0000000-0000-4000-a000-000000000003', CURRENT_DATE - 1,  true,  NULL)
ON CONFLICT DO NOTHING;

SELECT update_habit_streak('d0000000-0000-4000-a000-000000000001');
SELECT update_habit_streak('d0000000-0000-4000-a000-000000000002');
SELECT update_habit_streak('d0000000-0000-4000-a000-000000000003');

-- ── Reminders ──
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring, recurrence_pattern, is_completed) VALUES
    -- Upcoming, regular
    ('e0000000-0000-4000-a000-000000000001',
     'Doctor''s appointment',
     'Annual checkup with Dr. Patel – bring insurance card',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE + INTERVAL '4 days' + TIME '10:00', 'America/New_York', false, NULL, false),

    -- Upcoming, recurring
    ('e0000000-0000-4000-a000-000000000002',
     'Daily standup review',
     'Check yesterday''s blockers and today''s plan',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '09:00', 'America/New_York', true,
     '{"frequency":"daily","interval":1}', false),

    -- Upcoming, linked to task
    ('e0000000-0000-4000-a000-000000000003',
     'GraphQL API deadline',
     'Complete all remaining resolvers before sprint end',
     '550e8400-e29b-41d4-a716-446655440000', 'a0000000-0000-4000-a000-000000000004',
     CURRENT_DATE + INTERVAL '3 days' + TIME '17:00', 'America/New_York', false, NULL, false),

    -- OVERDUE (past time, not completed)
    ('e0000000-0000-4000-a000-000000000004',
     'Submit tax documents',
     'Upload W-2 and 1099 forms to TurboTax',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE - INTERVAL '3 days' + TIME '18:00', 'America/New_York', false, NULL, false),

    ('e0000000-0000-4000-a000-000000000005',
     'Pay electricity bill',
     'ConEdison autopay failed – pay manually',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE - INTERVAL '1 day' + TIME '12:00', 'America/New_York', false, NULL, false),

    -- COMPLETED, regular
    ('e0000000-0000-4000-a000-000000000006',
     'Renew AWS certification',
     'Solutions Architect Associate renewal exam',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE - INTERVAL '5 days' + TIME '14:00', 'America/New_York', false, NULL, true),

    -- COMPLETED, recurring
    ('e0000000-0000-4000-a000-000000000007',
     'Weekly team sync',
     'Review sprint progress and blockers with the team',
     '550e8400-e29b-41d4-a716-446655440000', NULL,
     CURRENT_DATE - INTERVAL '2 days' + TIME '11:00', 'America/New_York', true,
     '{"frequency":"weekly","interval":1,"byDay":["MO"]}', true)
ON CONFLICT DO NOTHING;


-- ===========================================================================
-- BOB  (Full-stack Developer)  550e8400-e29b-41d4-a716-446655440001
-- ===========================================================================

-- ── Task Categories ──
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('80000000-0000-4000-b000-000000000001', 'Development',   '#2196f3', '550e8400-e29b-41d4-a716-446655440001'),
    ('80000000-0000-4000-b000-000000000002', 'Fitness',       '#e91e63', '550e8400-e29b-41d4-a716-446655440001'),
    ('80000000-0000-4000-b000-000000000003', 'Side Projects', '#ff5722', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- ── Task Tags ──
INSERT INTO task_tags (id, name, user_id) VALUES
    ('90000000-0000-4000-b000-000000000001', 'backend',  '550e8400-e29b-41d4-a716-446655440001'),
    ('90000000-0000-4000-b000-000000000002', 'frontend', '550e8400-e29b-41d4-a716-446655440001'),
    ('90000000-0000-4000-b000-000000000003', 'bug',      '550e8400-e29b-41d4-a716-446655440001'),
    ('90000000-0000-4000-b000-000000000004', 'devops',   '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- ── Tasks ──
INSERT INTO tasks (id, title, description, priority, status, due_date, completed_at, user_id, category_id) VALUES
    -- TODO
    ('a0000000-0000-4000-b000-000000000001', 'Design portfolio website',
     'Personal portfolio with React, Three.js hero section, project showcases',
     'low', 'todo', CURRENT_DATE + INTERVAL '14 days', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000003'),

    ('a0000000-0000-4000-b000-000000000002', 'Research serverless options',
     'Compare AWS Lambda vs Cloudflare Workers vs Vercel Edge Functions for API',
     'medium', 'todo', CURRENT_DATE + INTERVAL '8 days', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    -- IN PROGRESS
    ('a0000000-0000-4000-b000-000000000003', 'Build REST API for mobile app',
     'Express + Prisma endpoints for the React Native client',
     'high', 'in_progress', CURRENT_DATE + INTERVAL '3 days', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    ('a0000000-0000-4000-b000-000000000004', 'Fix authentication bug',
     'Users are getting logged out after 5 min – likely JWT exp misconfiguration',
     'urgent', 'in_progress', CURRENT_DATE + INTERVAL '1 day', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    -- DONE
    ('a0000000-0000-4000-b000-000000000005', 'Code review for PR #42',
     'Database migration PR – reviewed and merged',
     'high', 'done', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE - INTERVAL '1 day',
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    ('a0000000-0000-4000-b000-000000000006', 'Set up Grafana monitoring dashboard',
     'CPU, memory, request latency, error rate panels',
     'medium', 'done', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days',
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    ('a0000000-0000-4000-b000-000000000007', 'Complete 5K training plan week 8',
     'Long run Sunday + intervals Wednesday',
     'medium', 'done', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days',
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000002'),

    -- OVERDUE
    ('a0000000-0000-4000-b000-000000000008', 'Update client presentation slides',
     'Add Q4 metrics and new feature demo screenshots',
     'high', 'todo', CURRENT_DATE - INTERVAL '2 days', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001'),

    ('a0000000-0000-4000-b000-000000000009', 'Refactor user service to use repository pattern',
     'Extract data access into separate repository classes',
     'medium', 'in_progress', CURRENT_DATE - INTERVAL '1 day', NULL,
     '550e8400-e29b-41d4-a716-446655440001', '80000000-0000-4000-b000-000000000001')
ON CONFLICT DO NOTHING;

-- ── Task-Tag Relations ──
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a0000000-0000-4000-b000-000000000003', '90000000-0000-4000-b000-000000000001'),
    ('a0000000-0000-4000-b000-000000000004', '90000000-0000-4000-b000-000000000003'),
    ('a0000000-0000-4000-b000-000000000001', '90000000-0000-4000-b000-000000000002'),
    ('a0000000-0000-4000-b000-000000000006', '90000000-0000-4000-b000-000000000004'),
    ('a0000000-0000-4000-b000-000000000009', '90000000-0000-4000-b000-000000000001')
ON CONFLICT DO NOTHING;

-- ── Note Categories ──
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b0000000-0000-4000-b000-000000000001', 'Architecture',   '#673ab7', '550e8400-e29b-41d4-a716-446655440001'),
    ('b0000000-0000-4000-b000-000000000002', 'Meeting Notes',  '#009688', '550e8400-e29b-41d4-a716-446655440001'),
    ('b0000000-0000-4000-b000-000000000003', 'Recipes',        '#795548', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- ── Notes ──
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c0000000-0000-4000-b000-000000000001',
     'Microservices Architecture Notes',
     '# Microservices Patterns

## Key Principles
- Single Responsibility per service
- API Gateway for routing (Kong / AWS API Gateway)
- Event-driven communication (Kafka, RabbitMQ)

## Database per Service
- Each service owns its data – no shared DB
- Use sagas for distributed transactions
- CQRS for read-heavy analytics services

## Deployment
- Docker containers with Kubernetes orchestration
- Service mesh (Istio) for observability
- Circuit breakers (Hystrix pattern) for resilience',
     '550e8400-e29b-41d4-a716-446655440001', 'b0000000-0000-4000-b000-000000000001', true),

    ('c0000000-0000-4000-b000-000000000002',
     'Git Workflow & Branch Strategy',
     '# Git Workflow

## Branch Naming
- feature/TICKET-123-description
- bugfix/TICKET-456-description
- hotfix/critical-issue

## Rules
1. Never force push to main or develop
2. Squash commits on merge
3. PR requires 2 approvals
4. All CI checks must pass

## Useful Commands
```
git rebase -i HEAD~5
git stash push -m "WIP"
git cherry-pick <sha>
git bisect start/bad/good
```',
     '550e8400-e29b-41d4-a716-446655440001', 'b0000000-0000-4000-b000-000000000001', true),

    ('c0000000-0000-4000-b000-000000000003',
     'Sprint Retro – Feb 14',
     '## What went well
- Shipped auth module on time
- Zero production incidents this sprint

## What could improve
- Code review turnaround (avg 36h → target 24h)
- Flaky integration tests (3 failures this sprint)

## Action Items
- Bob: Set up test retry mechanism
- Team: Review PR within 24h or reassign',
     '550e8400-e29b-41d4-a716-446655440001', 'b0000000-0000-4000-b000-000000000002', false),

    ('c0000000-0000-4000-b000-000000000004',
     'Chicken Tikka Masala Recipe',
     '## Ingredients
- 500g chicken breast, cubed
- 200ml Greek yogurt
- 2 tbsp tikka masala paste
- 400ml coconut cream
- 1 can crushed tomatoes

## Steps
1. Marinate chicken in yogurt + spices overnight
2. Grill chicken on high heat until charred
3. Sauté onions, garlic, ginger in ghee
4. Add tomatoes, cream, and grilled chicken
5. Simmer 20 min, garnish with cilantro
6. Serve with basmati rice and naan',
     '550e8400-e29b-41d4-a716-446655440001', 'b0000000-0000-4000-b000-000000000003', false),

    ('c0000000-0000-4000-b000-000000000005',
     'AWS Lambda vs Cloudflare Workers',
     '## Comparison

| Feature         | Lambda           | CF Workers       |
|----------------|-----------------|-----------------|
| Cold start     | 100-500ms        | <1ms             |
| Max duration   | 15 min           | 30s (free), 15m  |
| Pricing        | Per invocation   | Per request      |
| Edge           | Lambda@Edge      | Global by default|
| DB access      | VPC needed       | D1 / Hyperdrive  |

## Verdict
- Use Lambda for long-running or heavy compute
- Use Workers for edge, low-latency API responses',
     '550e8400-e29b-41d4-a716-446655440001', 'b0000000-0000-4000-b000-000000000001', false)
ON CONFLICT DO NOTHING;

-- ── Habits ──
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d0000000-0000-4000-b000-000000000001',
     'Morning Run',
     '5K run before work – weekdays only',
     '550e8400-e29b-41d4-a716-446655440001', 'weekly', ARRAY[1,2,3,4,5], '#e91e63'),

    ('d0000000-0000-4000-b000-000000000002',
     'Read 30 Pages',
     'Read at least 30 pages of a book',
     '550e8400-e29b-41d4-a716-446655440001', 'daily', ARRAY[0,1,2,3,4,5,6], '#ff9800'),

    ('d0000000-0000-4000-b000-000000000003',
     'Gym Workout',
     'Strength training: push/pull/legs split',
     '550e8400-e29b-41d4-a716-446655440001', 'custom', ARRAY[1,3,5], '#9c27b0')
ON CONFLICT DO NOTHING;

-- ── Habit Logs ──
INSERT INTO habit_logs (habit_id, date, completed, notes) VALUES
    -- Morning Run (weekly Mon-Fri)
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 13, true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 12, true,  '5K in 26:30'),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 11, true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 10, false, 'Alarm failed'),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 5,  true,  'Personal best 25:45!'),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 4,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 2,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000001', CURRENT_DATE - 1,  true,  NULL),

    -- Read 30 Pages (daily)
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 13, true,  'Clean Code ch. 7'),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 11, true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 10, true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 8,  false, 'Traveling'),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 7,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 5,  true,  'DDIA chapter 5'),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 4,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 2,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE - 1,  true,  NULL),
    ('d0000000-0000-4000-b000-000000000002', CURRENT_DATE,      true,  NULL),

    -- Gym Workout (custom Mon,Wed,Fri)
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 13, true,  'Push day – bench 80kg'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 11, true,  'Pull day – deadlift 120kg'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 9,  true,  'Leg day'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 6,  true,  'Push day'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 4,  true,  'Pull day'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 2,  true,  'Leg day – squat PR'),
    ('d0000000-0000-4000-b000-000000000003', CURRENT_DATE - 1,  false, 'Skipped – sore')
ON CONFLICT DO NOTHING;

SELECT update_habit_streak('d0000000-0000-4000-b000-000000000001');
SELECT update_habit_streak('d0000000-0000-4000-b000-000000000002');
SELECT update_habit_streak('d0000000-0000-4000-b000-000000000003');

-- ── Reminders ──
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring, recurrence_pattern, is_completed) VALUES
    -- Upcoming, recurring
    ('e0000000-0000-4000-b000-000000000001',
     'Daily standup',
     'Team standup at 9:30 AM',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '09:30', 'America/Chicago', true,
     '{"frequency":"daily","interval":1}', false),

    -- Upcoming, regular (linked to task)
    ('e0000000-0000-4000-b000-000000000002',
     'Auth bug fix deadline',
     'Critical – users being logged out',
     '550e8400-e29b-41d4-a716-446655440001', 'a0000000-0000-4000-b000-000000000004',
     CURRENT_DATE + INTERVAL '1 day' + TIME '17:00', 'America/Chicago', false, NULL, false),

    -- Upcoming, regular
    ('e0000000-0000-4000-b000-000000000003',
     'Dentist appointment',
     'Cleaning at Dr. Kim''s office',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE + INTERVAL '6 days' + TIME '15:00', 'America/Chicago', false, NULL, false),

    -- Upcoming, recurring
    ('e0000000-0000-4000-b000-000000000004',
     'Gym time',
     'Strength training session',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '18:00', 'America/Chicago', true,
     '{"frequency":"weekly","interval":1,"byDay":["MO","WE","FR"]}', false),

    -- OVERDUE
    ('e0000000-0000-4000-b000-000000000005',
     'Pay credit card bill',
     'Chase Sapphire – balance $2,340',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE - INTERVAL '2 days' + TIME '23:59', 'America/Chicago', false, NULL, false),

    -- COMPLETED
    ('e0000000-0000-4000-b000-000000000006',
     'Submit quarterly report',
     'Q4 2025 engineering metrics to VP',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE - INTERVAL '4 days' + TIME '12:00', 'America/Chicago', false, NULL, true),

    -- COMPLETED, recurring
    ('e0000000-0000-4000-b000-000000000007',
     'Weekly 1:1 with manager',
     'Career growth discussion',
     '550e8400-e29b-41d4-a716-446655440001', NULL,
     CURRENT_DATE - INTERVAL '1 day' + TIME '10:00', 'America/Chicago', true,
     '{"frequency":"weekly","interval":1,"byDay":["TH"]}', true)
ON CONFLICT DO NOTHING;


-- ===========================================================================
-- CHARLIE  (Student / Job Seeker)  550e8400-e29b-41d4-a716-446655440002
-- ===========================================================================

-- ── Task Categories ──
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('80000000-0000-4000-c000-000000000001', 'Homework',   '#3f51b5', '550e8400-e29b-41d4-a716-446655440002'),
    ('80000000-0000-4000-c000-000000000002', 'Job Search', '#ff9800', '550e8400-e29b-41d4-a716-446655440002'),
    ('80000000-0000-4000-c000-000000000003', 'Household',  '#4caf50', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- ── Task Tags ──
INSERT INTO task_tags (id, name, user_id) VALUES
    ('90000000-0000-4000-c000-000000000001', 'deadline',  '550e8400-e29b-41d4-a716-446655440002'),
    ('90000000-0000-4000-c000-000000000002', 'interview', '550e8400-e29b-41d4-a716-446655440002'),
    ('90000000-0000-4000-c000-000000000003', 'study',     '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- ── Tasks ──
INSERT INTO tasks (id, title, description, priority, status, due_date, completed_at, user_id, category_id) VALUES
    -- TODO
    ('a0000000-0000-4000-c000-000000000001', 'System Design study – Chapters 5-8',
     'Designing Data-Intensive Applications: replication, partitioning, transactions, consistency',
     'high', 'todo', CURRENT_DATE + INTERVAL '7 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000001'),

    ('a0000000-0000-4000-c000-000000000002', 'Deep clean apartment',
     'Kitchen, bathroom, vacuum all rooms before parents visit',
     'medium', 'todo', CURRENT_DATE + INTERVAL '3 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000003'),

    -- IN PROGRESS
    ('a0000000-0000-4000-c000-000000000003', 'Prepare resume for Google',
     'Tailor resume for SDE-2 position – emphasize distributed systems experience',
     'urgent', 'in_progress', CURRENT_DATE + INTERVAL '2 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000002'),

    ('a0000000-0000-4000-c000-000000000004', 'LeetCode – Dynamic Programming set',
     'Solve 10 DP problems from Blind 75 (knapsack, LCS, LIS, matrix chain)',
     'high', 'in_progress', CURRENT_DATE + INTERVAL '4 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000001'),

    -- DONE
    ('a0000000-0000-4000-c000-000000000005', 'Submit February expense report',
     'Uploaded receipts from conference trip to Concur',
     'low', 'done', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE - INTERVAL '2 days',
     '550e8400-e29b-41d4-a716-446655440002', NULL),

    ('a0000000-0000-4000-c000-000000000006', 'Complete online course module',
     'Finished MIT OCW Distributed Systems lecture 8-12',
     'medium', 'done', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE - INTERVAL '4 days',
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000001'),

    ('a0000000-0000-4000-c000-000000000007', 'Mock interview with mentor',
     'Practiced system design: design a notification system',
     'high', 'done', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '3 days',
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000002'),

    -- OVERDUE
    ('a0000000-0000-4000-c000-000000000008', 'Return library books',
     '3 books overdue – "Cracking the Coding Interview", "DDIA", "Clean Architecture"',
     'low', 'todo', CURRENT_DATE - INTERVAL '4 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000003'),

    ('a0000000-0000-4000-c000-000000000009', 'Send thank-you email to Meta interviewer',
     'Phone screen went well – follow up within 24h (missed window)',
     'high', 'todo', CURRENT_DATE - INTERVAL '2 days', NULL,
     '550e8400-e29b-41d4-a716-446655440002', '80000000-0000-4000-c000-000000000002')
ON CONFLICT DO NOTHING;

-- ── Task-Tag Relations ──
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a0000000-0000-4000-c000-000000000003', '90000000-0000-4000-c000-000000000002'),
    ('a0000000-0000-4000-c000-000000000003', '90000000-0000-4000-c000-000000000001'),
    ('a0000000-0000-4000-c000-000000000004', '90000000-0000-4000-c000-000000000003'),
    ('a0000000-0000-4000-c000-000000000001', '90000000-0000-4000-c000-000000000003'),
    ('a0000000-0000-4000-c000-000000000009', '90000000-0000-4000-c000-000000000002')
ON CONFLICT DO NOTHING;

-- ── Note Categories ──
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b0000000-0000-4000-c000-000000000001', 'DSA Notes',        '#f44336', '550e8400-e29b-41d4-a716-446655440002'),
    ('b0000000-0000-4000-c000-000000000002', 'Company Research', '#607d8b', '550e8400-e29b-41d4-a716-446655440002'),
    ('b0000000-0000-4000-c000-000000000003', 'Personal Journal', '#8bc34a', '550e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- ── Notes ──
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c0000000-0000-4000-c000-000000000001',
     'Dynamic Programming Patterns',
     '# DP Patterns Cheat Sheet

## Common Patterns
1. **0/1 Knapsack** – subset sum, partition equal subset, target sum
2. **Unbounded Knapsack** – coin change, rod cutting, word break
3. **LCS** – longest common subsequence, edit distance, min deletions
4. **LIS** – longest increasing subsequence, Russian doll envelopes
5. **Matrix Chain** – burst balloons, MCM, optimal BST
6. **Interval DP** – palindrome partitioning, stone game

## Template
```
dp[i] = best answer considering elements 0..i
dp[i] = max/min(dp[i-1], dp[j] + value) for valid j
```

## Time Complexity
- Most 1D DP: O(n) or O(n²)
- Most 2D DP: O(n*m)
- Bitmask DP: O(2^n * n)',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000001', true),

    ('c0000000-0000-4000-c000-000000000002',
     'Google SDE-2 Interview Prep',
     '## Interview Format
- 1 Phone Screen (45 min coding on Google Docs)
- 4-5 Onsite Rounds:
  - 2 Coding rounds (medium-hard LC)
  - 1 System Design (design YouTube, Maps, etc.)
  - 1 Googleyness & Leadership (behavioral)
  - 1 Mixed (coding or design)

## Key Areas to Focus
- Graph algorithms (BFS, DFS, Dijkstra, topological sort)
- Trees (BST, segment trees, tries, LCA)
- Dynamic Programming (all patterns above)
- System Design (distributed systems, caching, sharding)

## Behavioral STAR Stories
1. Led migration from monolith → microservices
2. Resolved production outage affecting 10K users
3. Mentored 2 junior engineers',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000002', true),

    ('c0000000-0000-4000-c000-000000000003',
     'System Design – URL Shortener',
     '## Requirements
- Shorten URLs (write) + redirect (read, 100:1 ratio)
- Custom aliases, expiration, analytics

## High-Level Design
1. API Gateway → Write Service → DB (Postgres + Redis cache)
2. Read path: CDN → Redis → Postgres fallback
3. Hash: base62(counter) or MD5 first 7 chars

## Scale Estimates
- 100M URLs/day write = ~1200/sec
- 10B reads/day = ~115K/sec (need caching + CDN)
- Storage: 100B URLs * 500 bytes = 50TB over 5 years',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000001', false),

    ('c0000000-0000-4000-c000-000000000004',
     'Behavioral Interview STAR Examples',
     '## STAR Framework

### Story 1: Leading Under Pressure
- **S**: Production outage during peak Black Friday traffic
- **T**: Restore service within 30 min SLA
- **A**: Coordinated rollback, identified root cause (DB connection pool exhaustion)
- **R**: Restored in 18 min, implemented connection pooling, 99.99% uptime since

### Story 2: Disagreement with Team
- **S**: Team wanted to use MongoDB for relational data
- **T**: Convince team PostgreSQL was better fit
- **A**: Prepared benchmark comparison, prototype both approaches
- **R**: Team agreed, saved 3 months of future migration work',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000002', false),

    ('c0000000-0000-4000-c000-000000000005',
     'Weekly Reflection – Feb 17',
     '## Wins this week 🎉
- Solved 15 LeetCode problems (5 hard)
- Completed mock interview – got positive feedback
- Fixed portfolio website deployment on Vercel

## Areas to improve
- Need to practice system design verbally (not just writing)
- Time management during timed coding (going over 45 min)
- Sleep schedule: averaging 6h, need 7.5h

## Next week goals
1. Apply to 5 more companies (Amazon, Stripe, Coinbase, Datadog, Notion)
2. Finish DDIA chapters 5-8
3. Do 2 mock interviews on Pramp',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000003', false),

    ('c0000000-0000-4000-c000-000000000006',
     'Networking Contacts',
     '## Referrals Available
| Name            | Company  | Role         | Status       |
|----------------|----------|-------------|-------------|
| Sarah Kim      | Google   | L5 SWE      | Submitted    |
| Raj Patel      | Meta     | E5 SWE      | Pending      |
| Mike Chen      | Stripe   | Staff Eng   | Not yet asked|
| Lisa Wang      | Amazon   | SDE-2       | Will refer   |

## Recruiters
- Jennifer (Google) – jennifer@google.com
- David (Meta) – reached out on LinkedIn Feb 10',
     '550e8400-e29b-41d4-a716-446655440002', 'b0000000-0000-4000-c000-000000000002', false)
ON CONFLICT DO NOTHING;

-- ── Habits ──
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d0000000-0000-4000-c000-000000000001',
     'LeetCode Daily',
     'Solve at least 2 LeetCode problems (1 medium + 1 hard)',
     '550e8400-e29b-41d4-a716-446655440002', 'daily', ARRAY[0,1,2,3,4,5,6], '#f44336'),

    ('d0000000-0000-4000-c000-000000000002',
     'Mock Interviews',
     'Practice on Pramp or interviewing.io',
     '550e8400-e29b-41d4-a716-446655440002', 'weekly', ARRAY[2,4], '#3f51b5'),

    ('d0000000-0000-4000-c000-000000000003',
     'Journal Writing',
     'Daily reflections, gratitude, and planning',
     '550e8400-e29b-41d4-a716-446655440002', 'custom', ARRAY[0,1,3,5], '#8bc34a')
ON CONFLICT DO NOTHING;

-- ── Habit Logs ──
INSERT INTO habit_logs (habit_id, date, completed, notes) VALUES
    -- LeetCode Daily (all 7 days)
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 13, true,  'Two Sum + 3Sum'),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 11, true,  'Merge Intervals'),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 10, true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 8,  true,  'Word Break (Hard)'),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 7,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 5,  true,  'Coin Change + Rod Cutting'),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 4,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 2,  true,  'Trapping Rain Water'),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE - 1,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000001', CURRENT_DATE,      true,  'LRU Cache + LFU Cache'),

    -- Mock Interviews (weekly Tue,Thu)
    ('d0000000-0000-4000-c000-000000000002', CURRENT_DATE - 12, true,  'Pramp – system design: chat app'),
    ('d0000000-0000-4000-c000-000000000002', CURRENT_DATE - 10, true,  'Pramp – coding: graph problems'),
    ('d0000000-0000-4000-c000-000000000002', CURRENT_DATE - 5,  true,  'interviewing.io – coding'),
    ('d0000000-0000-4000-c000-000000000002', CURRENT_DATE - 3,  true,  'Peer mock – system design: URL shortener'),

    -- Journal Writing (custom Sun,Mon,Wed,Fri)
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 13, true,  NULL),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 12, true,  'Reflected on interview prep progress'),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 10, true,  NULL),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 8,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 6,  true,  'Gratitude: mentor feedback was great'),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 5,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-c000-000000000003', CURRENT_DATE - 1,  true,  'Weekly review written')
ON CONFLICT DO NOTHING;

SELECT update_habit_streak('d0000000-0000-4000-c000-000000000001');
SELECT update_habit_streak('d0000000-0000-4000-c000-000000000002');
SELECT update_habit_streak('d0000000-0000-4000-c000-000000000003');

-- ── Reminders ──
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring, recurrence_pattern, is_completed) VALUES
    -- Upcoming, recurring
    ('e0000000-0000-4000-c000-000000000001',
     'LeetCode morning session',
     'Solve 2 problems before noon',
     '550e8400-e29b-41d4-a716-446655440002', NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '08:00', 'America/Los_Angeles', true,
     '{"frequency":"daily","interval":1}', false),

    -- Upcoming, regular (linked to task)
    ('e0000000-0000-4000-c000-000000000002',
     'Google resume submission deadline',
     'Final review and submit through referral portal',
     '550e8400-e29b-41d4-a716-446655440002', 'a0000000-0000-4000-c000-000000000003',
     CURRENT_DATE + INTERVAL '2 days' + TIME '18:00', 'America/Los_Angeles', false, NULL, false),

    -- Upcoming, recurring
    ('e0000000-0000-4000-c000-000000000003',
     'Weekly review & planning',
     'Write reflection, plan next week''s goals',
     '550e8400-e29b-41d4-a716-446655440002', NULL,
     CURRENT_DATE + INTERVAL '5 days' + TIME '20:00', 'America/Los_Angeles', true,
     '{"frequency":"weekly","interval":1,"byDay":["SU"]}', false),

    -- OVERDUE
    ('e0000000-0000-4000-c000-000000000004',
     'Follow up with Meta recruiter',
     'Send thank-you note + availability for next round',
     '550e8400-e29b-41d4-a716-446655440002', NULL,
     CURRENT_DATE - INTERVAL '2 days' + TIME '10:00', 'America/Los_Angeles', false, NULL, false),

    ('e0000000-0000-4000-c000-000000000005',
     'Return library books',
     '3 books overdue – avoid $15 fine',
     '550e8400-e29b-41d4-a716-446655440002', 'a0000000-0000-4000-c000-000000000008',
     CURRENT_DATE - INTERVAL '3 days' + TIME '17:00', 'America/Los_Angeles', false, NULL, false),

    -- COMPLETED
    ('e0000000-0000-4000-c000-000000000006',
     'Apply to Amazon SDE-2',
     'Application submitted through referral',
     '550e8400-e29b-41d4-a716-446655440002', NULL,
     CURRENT_DATE - INTERVAL '6 days' + TIME '12:00', 'America/Los_Angeles', false, NULL, true),

    ('e0000000-0000-4000-c000-000000000007',
     'Complete HackerRank assessment',
     'Stripe coding assessment – 90 min, 3 problems',
     '550e8400-e29b-41d4-a716-446655440002', NULL,
     CURRENT_DATE - INTERVAL '4 days' + TIME '14:00', 'America/Los_Angeles', false, NULL, true)
ON CONFLICT DO NOTHING;


-- ===========================================================================
-- DIANA  (Product Manager)  550e8400-e29b-41d4-a716-446655440003
-- ===========================================================================

-- ── Task Categories ──
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('80000000-0000-4000-d000-000000000001', 'Product',   '#9c27b0', '550e8400-e29b-41d4-a716-446655440003'),
    ('80000000-0000-4000-d000-000000000002', 'Meetings',  '#00bcd4', '550e8400-e29b-41d4-a716-446655440003'),
    ('80000000-0000-4000-d000-000000000003', 'Wellness',  '#4caf50', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- ── Task Tags ──
INSERT INTO task_tags (id, name, user_id) VALUES
    ('90000000-0000-4000-d000-000000000001', 'strategic',     '550e8400-e29b-41d4-a716-446655440003'),
    ('90000000-0000-4000-d000-000000000002', 'data-driven',   '550e8400-e29b-41d4-a716-446655440003'),
    ('90000000-0000-4000-d000-000000000003', 'stakeholder',   '550e8400-e29b-41d4-a716-446655440003'),
    ('90000000-0000-4000-d000-000000000004', 'user-research', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- ── Tasks ──
INSERT INTO tasks (id, title, description, priority, status, due_date, completed_at, user_id, category_id) VALUES
    -- TODO
    ('a0000000-0000-4000-d000-000000000001', 'Write PRD for Q2 features',
     'Product Requirements Document covering: AI recommendations, social sharing, offline mode',
     'high', 'todo', CURRENT_DATE + INTERVAL '12 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    ('a0000000-0000-4000-d000-000000000002', 'Schedule user research interviews',
     'Recruit 8 participants for usability testing of new onboarding flow',
     'medium', 'todo', CURRENT_DATE + INTERVAL '5 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    ('a0000000-0000-4000-d000-000000000003', 'Book flight for product conference',
     'ProductCon NYC – March 15-17, early bird pricing ends soon',
     'low', 'todo', CURRENT_DATE + INTERVAL '8 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', NULL),

    -- IN PROGRESS
    ('a0000000-0000-4000-d000-000000000004', 'Analyze A/B test results',
     'New checkout flow A/B test – 2 weeks of data, need statistical significance check',
     'high', 'in_progress', CURRENT_DATE + INTERVAL '2 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    ('a0000000-0000-4000-d000-000000000005', 'Create Q2 product roadmap',
     'Prioritize features using RICE framework, align with engineering capacity',
     'urgent', 'in_progress', CURRENT_DATE + INTERVAL '4 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    -- DONE
    ('a0000000-0000-4000-d000-000000000006', 'Launch Feature X – Dark Mode',
     'Shipped to 100% of users, 92% positive feedback score',
     'high', 'done', CURRENT_DATE - INTERVAL '4 days', CURRENT_DATE - INTERVAL '3 days',
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    ('a0000000-0000-4000-d000-000000000007', 'Prepare board presentation',
     'Q1 metrics, product highlights, and Q2 strategy for board meeting',
     'urgent', 'done', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE - INTERVAL '6 days',
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000002'),

    ('a0000000-0000-4000-d000-000000000008', 'Competitive analysis: Notion vs Todoist',
     'Feature comparison matrix, pricing analysis, user sentiment from reviews',
     'medium', 'done', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE - INTERVAL '2 days',
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    -- OVERDUE
    ('a0000000-0000-4000-d000-000000000009', 'Review competitor analysis report',
     'Marketing team sent the Q1 competitor landscape – need to provide feedback',
     'medium', 'todo', CURRENT_DATE - INTERVAL '3 days', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000001'),

    ('a0000000-0000-4000-d000-000000000010', 'Update stakeholder report',
     'Monthly product update for VP of Product and CTO',
     'high', 'in_progress', CURRENT_DATE - INTERVAL '1 day', NULL,
     '550e8400-e29b-41d4-a716-446655440003', '80000000-0000-4000-d000-000000000002')
ON CONFLICT DO NOTHING;

-- ── Task-Tag Relations ──
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a0000000-0000-4000-d000-000000000001', '90000000-0000-4000-d000-000000000001'),
    ('a0000000-0000-4000-d000-000000000004', '90000000-0000-4000-d000-000000000002'),
    ('a0000000-0000-4000-d000-000000000005', '90000000-0000-4000-d000-000000000001'),
    ('a0000000-0000-4000-d000-000000000002', '90000000-0000-4000-d000-000000000004'),
    ('a0000000-0000-4000-d000-000000000010', '90000000-0000-4000-d000-000000000003'),
    ('a0000000-0000-4000-d000-000000000007', '90000000-0000-4000-d000-000000000003')
ON CONFLICT DO NOTHING;

-- ── Note Categories ──
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b0000000-0000-4000-d000-000000000001', 'Product Strategy', '#9c27b0', '550e8400-e29b-41d4-a716-446655440003'),
    ('b0000000-0000-4000-d000-000000000002', 'User Research',    '#00bcd4', '550e8400-e29b-41d4-a716-446655440003'),
    ('b0000000-0000-4000-d000-000000000003', 'Personal',         '#ff9800', '550e8400-e29b-41d4-a716-446655440003')
ON CONFLICT DO NOTHING;

-- ── Notes ──
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c0000000-0000-4000-d000-000000000001',
     'Product Metrics Dashboard',
     '# Key Metrics (Feb 2026)

## North Star: Weekly Active Users
- WAU: 142K (+12% MoM)
- DAU/MAU ratio: 0.45 (healthy engagement)

## Growth
- New signups: 18K/week
- Activation rate (7-day): 68%
- Referral rate: 4.2%

## Revenue
- MRR: $285K
- ARPU: $12.50
- Churn: 3.2% (target: <5%)

## Product
- Feature adoption (Dark Mode): 78%
- NPS: 52 (up from 44 last quarter)
- Support tickets: 340/week (down 15%)',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000001', true),

    ('c0000000-0000-4000-d000-000000000002',
     'OKRs Q1 2026',
     '# Q1 2026 Objectives & Key Results

## O1: Improve User Retention
- KR1: Increase D7 retention from 62% → 70%
- KR2: Reduce churn rate from 4.8% → 3.5%
- KR3: Launch re-engagement email sequence (target: 15% reactivation)

## O2: Expand Product Surface Area
- KR1: Ship Dark Mode to 100% ✅
- KR2: Launch habit analytics dashboard (in progress)
- KR3: Add 3 integrations (Google Cal, Slack, Notion)

## O3: Drive Revenue Growth
- KR1: Grow MRR from $240K → $300K
- KR2: Launch annual plan (target: 30% adoption)
- KR3: Increase ARPU from $11 → $13',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000001', true),

    ('c0000000-0000-4000-d000-000000000003',
     'User Interview Insights – Feb 2026',
     '## Key Findings (n=12 interviews)

### Pain Points
1. "I forget to check the app" – need push notifications (7/12 mentioned)
2. "Too many clicks to log a habit" – streamline to 1-tap (5/12)
3. "Can''t see my progress over time" – need monthly/yearly view (6/12)

### Feature Requests (ranked by frequency)
1. Push notifications / reminders (7)
2. Progress charts / analytics (6)
3. Habit templates (5)
4. Social accountability (4)
5. Widget for phone home screen (3)

### Positive Feedback
- "Love the simplicity" (8/12)
- "Weekly view is exactly what I need" (5/12)
- "Color coding helps me stay organized" (4/12)',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000002', false),

    ('c0000000-0000-4000-d000-000000000004',
     'Feature Prioritization – RICE Framework',
     '## RICE Scoring (Q2 Candidates)

| Feature              | Reach | Impact | Confidence | Effort | Score |
|---------------------|-------|--------|-----------|--------|-------|
| Push Notifications  | 80K   | 3      | 90%       | 3 wks  | 3600  |
| Progress Analytics  | 60K   | 2      | 80%       | 4 wks  | 2400  |
| Habit Templates     | 40K   | 2      | 70%       | 2 wks  | 2800  |
| Social Features     | 30K   | 2      | 50%       | 6 wks  | 500   |
| Offline Mode        | 50K   | 1      | 90%       | 5 wks  | 900   |

## Recommendation
Priority order: Push Notifications → Habit Templates → Progress Analytics',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000001', false),

    ('c0000000-0000-4000-d000-000000000005',
     'Team Retrospective Notes – Sprint 13',
     '## What went well
- Dark Mode shipped on time, 78% adoption in first week
- Zero critical bugs in production
- Team velocity up 20% from last sprint

## What to improve
- Design handoff process – 3 tickets had missing specs
- Flaky E2E tests caused 2 failed deployments
- Too many ad-hoc requests disrupting sprint

## Action Items
- Diana: Create spec template checklist
- Eng Lead: Fix flaky tests by end of sprint
- Team: Limit mid-sprint additions to P0 only',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000002', false),

    ('c0000000-0000-4000-d000-000000000006',
     'Book Notes: Inspired by Marty Cagan',
     '## Key Takeaways

1. **Product Discovery** – test ideas before building
   - Opportunity assessment: Is this worth solving?
   - Prototype testing: Can we build it right?
   - Feasibility assessment: Can engineering build it?

2. **Empowered Teams** vs Feature Teams
   - Give teams problems to solve, not features to build
   - Missionaries > Mercenaries

3. **Continuous Discovery**
   - Talk to users weekly (not quarterly)
   - Use dual-track agile: discovery + delivery in parallel

4. **Product Vision**
   - 3-10 year aspirational view
   - Product strategy: sequence of major releases to achieve vision',
     '550e8400-e29b-41d4-a716-446655440003', 'b0000000-0000-4000-d000-000000000003', false)
ON CONFLICT DO NOTHING;

-- ── Habits ──
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d0000000-0000-4000-d000-000000000001',
     'Morning Journaling',
     'Write 3 pages of morning pages + daily intentions',
     '550e8400-e29b-41d4-a716-446655440003', 'daily', ARRAY[0,1,2,3,4,5,6], '#ff9800'),

    ('d0000000-0000-4000-d000-000000000002',
     'Team 1:1 Prep',
     'Prepare talking points and feedback for direct reports',
     '550e8400-e29b-41d4-a716-446655440003', 'weekly', ARRAY[1,5], '#00bcd4'),

    ('d0000000-0000-4000-d000-000000000003',
     'Yoga',
     '45-minute vinyasa flow session',
     '550e8400-e29b-41d4-a716-446655440003', 'custom', ARRAY[2,4,6], '#4caf50')
ON CONFLICT DO NOTHING;

-- ── Habit Logs ──
INSERT INTO habit_logs (habit_id, date, completed, notes) VALUES
    -- Morning Journaling (daily)
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 13, true,  'Set quarterly intentions'),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 12, true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 11, true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 10, false, 'Overslept'),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 8,  true,  'Gratitude practice'),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 7,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 6,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 5,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 4,  true,  'Product vision brainstorm'),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 2,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE - 1,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000001', CURRENT_DATE,      true,  'Sprint reflection'),

    -- Team 1:1 Prep (weekly Mon,Fri)
    ('d0000000-0000-4000-d000-000000000002', CURRENT_DATE - 13, true,  'Prepped feedback for Sarah'),
    ('d0000000-0000-4000-d000-000000000002', CURRENT_DATE - 9,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000002', CURRENT_DATE - 6,  true,  'Career growth discussion prep'),
    ('d0000000-0000-4000-d000-000000000002', CURRENT_DATE - 2,  true,  NULL),

    -- Yoga (custom Tue,Thu,Sat)
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 12, true,  'Power vinyasa'),
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 10, true,  NULL),
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 8,  true,  'Yin yoga – recovery'),
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 5,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 3,  true,  NULL),
    ('d0000000-0000-4000-d000-000000000003', CURRENT_DATE - 1,  false, 'Skipped – travel day')
ON CONFLICT DO NOTHING;

SELECT update_habit_streak('d0000000-0000-4000-d000-000000000001');
SELECT update_habit_streak('d0000000-0000-4000-d000-000000000002');
SELECT update_habit_streak('d0000000-0000-4000-d000-000000000003');

-- ── Reminders ──
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring, recurrence_pattern, is_completed) VALUES
    -- Upcoming, recurring
    ('e0000000-0000-4000-d000-000000000001',
     'Weekly product sync',
     'Cross-functional sync: eng, design, data, marketing',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE + INTERVAL '2 days' + TIME '10:00', 'America/New_York', true,
     '{"frequency":"weekly","interval":1,"byDay":["WE"]}', false),

    -- Upcoming, recurring
    ('e0000000-0000-4000-d000-000000000002',
     'Daily metrics check',
     'Review dashboard: WAU, retention, activation funnel',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE + INTERVAL '1 day' + TIME '08:30', 'America/New_York', true,
     '{"frequency":"daily","interval":1}', false),

    -- Upcoming, regular (linked to task)
    ('e0000000-0000-4000-d000-000000000003',
     'A/B test analysis due',
     'Statistical significance check for new checkout flow',
     '550e8400-e29b-41d4-a716-446655440003', 'a0000000-0000-4000-d000-000000000004',
     CURRENT_DATE + INTERVAL '2 days' + TIME '17:00', 'America/New_York', false, NULL, false),

    -- Upcoming, regular
    ('e0000000-0000-4000-d000-000000000004',
     'User research session',
     'Remote usability test with participant #5 – new onboarding flow',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE + INTERVAL '3 days' + TIME '14:00', 'America/New_York', false, NULL, false),

    -- OVERDUE
    ('e0000000-0000-4000-d000-000000000005',
     'Send quarterly product report',
     'VP of Product needs Q1 summary by EOD Friday',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE - INTERVAL '2 days' + TIME '17:00', 'America/New_York', false, NULL, false),

    -- COMPLETED
    ('e0000000-0000-4000-d000-000000000006',
     'Finalize Q1 roadmap',
     'Lock in feature priorities and communicate to all teams',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE - INTERVAL '5 days' + TIME '12:00', 'America/New_York', false, NULL, true),

    -- COMPLETED, recurring
    ('e0000000-0000-4000-d000-000000000007',
     'Sprint planning prep',
     'Review backlog, prioritize stories, estimate capacity',
     '550e8400-e29b-41d4-a716-446655440003', NULL,
     CURRENT_DATE - INTERVAL '1 day' + TIME '09:00', 'America/New_York', true,
     '{"frequency":"weekly","interval":2,"byDay":["MO"]}', true)
ON CONFLICT DO NOTHING;


-- ============================================================================
-- VERIFICATION QUERY (run to confirm data was loaded)
-- ============================================================================
-- SELECT
--     u.username,
--     (SELECT COUNT(*) FROM tasks WHERE user_id = u.id) AS tasks,
--     (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND status = 'done') AS done_tasks,
--     (SELECT COUNT(*) FROM tasks WHERE user_id = u.id AND due_date < NOW() AND status != 'done') AS overdue_tasks,
--     (SELECT COUNT(*) FROM notes WHERE user_id = u.id) AS notes,
--     (SELECT COUNT(*) FROM notes WHERE user_id = u.id AND is_pinned = true) AS pinned_notes,
--     (SELECT COUNT(*) FROM habits WHERE user_id = u.id) AS habits,
--     (SELECT COUNT(*) FROM habit_logs hl JOIN habits h ON hl.habit_id = h.id WHERE h.user_id = u.id) AS habit_logs,
--     (SELECT COUNT(*) FROM reminders WHERE user_id = u.id) AS reminders,
--     (SELECT COUNT(*) FROM reminders WHERE user_id = u.id AND is_completed = true) AS completed_reminders,
--     (SELECT COUNT(*) FROM reminders WHERE user_id = u.id AND is_recurring = true) AS recurring_reminders
-- FROM users u
-- WHERE u.id IN (
--     '550e8400-e29b-41d4-a716-446655440000',
--     '550e8400-e29b-41d4-a716-446655440001',
--     '550e8400-e29b-41d4-a716-446655440002',
--     '550e8400-e29b-41d4-a716-446655440003'
-- )
-- ORDER BY u.username;
