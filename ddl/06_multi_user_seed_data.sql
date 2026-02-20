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
1. 0/1 Knapsack - subset sum, partition equal subset
2. Unbounded Knapsack - coin change, rod cutting
3. LCS - longest common subsequence/substring
4. LIS - longest increasing subsequence
5. Matrix Chain - burst balloons, MCM

## Template
dp[i] = best answer considering elements 0..i
dp[i] = max(dp[i-1], dp[j] + value[i]) for valid j', '550e8400-e29b-41d4-a716-446655440002', 'b00e8400-e29b-41d4-a716-446655440020', true),
    ('c00e8400-e29b-41d4-a716-446655440021', 'Google Interview Prep', '## Google SDE-2 Interview Format
- 1 Phone Screen (45 min coding)
- 4-5 Onsite Rounds:
  - 2 Coding rounds
  - 1 System Design
  - 1 Googleyness and Leadership
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
