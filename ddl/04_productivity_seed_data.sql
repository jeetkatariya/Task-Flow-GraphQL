-- Seed data for productivity app
-- Sample data for testing and demonstration

-- Task Categories
INSERT INTO task_categories (id, name, color, user_id) VALUES
    ('800e8400-e29b-41d4-a716-446655440000', 'Work', '#1976d2', '550e8400-e29b-41d4-a716-446655440000'),
    ('800e8400-e29b-41d4-a716-446655440001', 'Personal', '#4caf50', '550e8400-e29b-41d4-a716-446655440000'),
    ('800e8400-e29b-41d4-a716-446655440002', 'Learning', '#ff9800', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Task Tags
INSERT INTO task_tags (id, name, user_id) VALUES
    ('900e8400-e29b-41d4-a716-446655440000', 'urgent', '550e8400-e29b-41d4-a716-446655440000'),
    ('900e8400-e29b-41d4-a716-446655440001', 'important', '550e8400-e29b-41d4-a716-446655440000'),
    ('900e8400-e29b-41d4-a716-446655440002', 'review', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Tasks
INSERT INTO tasks (id, title, description, priority, status, due_date, user_id, category_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440000', 'Complete GraphQL API', 'Finish implementing all GraphQL endpoints for the productivity app', 'high', 'in_progress', CURRENT_DATE + INTERVAL '2 days', '550e8400-e29b-41d4-a716-446655440000', '800e8400-e29b-41d4-a716-446655440000'),
    ('a00e8400-e29b-41d4-a716-446655440001', 'Review TypeScript patterns', 'Study advanced TypeScript patterns and apply them', 'medium', 'todo', CURRENT_DATE + INTERVAL '5 days', '550e8400-e29b-41d4-a716-446655440000', '800e8400-e29b-41d4-a716-446655440002'),
    ('a00e8400-e29b-41d4-a716-446655440002', 'Grocery shopping', 'Buy ingredients for meal prep', 'low', 'todo', CURRENT_DATE + INTERVAL '1 day', '550e8400-e29b-41d4-a716-446655440000', '800e8400-e29b-41d4-a716-446655440001')
ON CONFLICT DO NOTHING;

-- Task-Tag Relations
INSERT INTO task_tags_relation (task_id, tag_id) VALUES
    ('a00e8400-e29b-41d4-a716-446655440000', '900e8400-e29b-41d4-a716-446655440000'),
    ('a00e8400-e29b-41d4-a716-446655440000', '900e8400-e29b-41d4-a716-446655440001'),
    ('a00e8400-e29b-41d4-a716-446655440001', '900e8400-e29b-41d4-a716-446655440002')
ON CONFLICT DO NOTHING;

-- Note Categories
INSERT INTO note_categories (id, name, color, user_id) VALUES
    ('b00e8400-e29b-41d4-a716-446655440000', 'Interview Prep', '#9c27b0', '550e8400-e29b-41d4-a716-446655440000'),
    ('b00e8400-e29b-41d4-a716-446655440001', 'Study Notes', '#00bcd4', '550e8400-e29b-41d4-a716-446655440000'),
    ('b00e8400-e29b-41d4-a716-446655440002', 'Accounts', '#f44336', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;

-- Notes
INSERT INTO notes (id, title, content, user_id, category_id, is_pinned) VALUES
    ('c00e8400-e29b-41d4-a716-446655440000', 'GraphQL Best Practices', '# GraphQL Best Practices

## Query Optimization
- Use data loaders to prevent N+1 queries
- Implement query complexity analysis
- Use fragments for reusable queries

## Schema Design
- Use interfaces for shared types
- Implement proper error handling
- Design for future extensibility', '550e8400-e29b-41d4-a716-446655440000', 'b00e8400-e29b-41d4-a716-446655440001', true),
    ('c00e8400-e29b-41d4-a716-446655440001', 'Interview Questions - System Design', '## Common System Design Questions

1. Design a URL shortener
2. Design a chat system
3. Design a notification system

## Key Concepts
- Scalability
- Availability
- Consistency', '550e8400-e29b-41d4-a716-446655440000', 'b00e8400-e29b-41d4-a716-446655440000', false)
ON CONFLICT DO NOTHING;

-- Habits
INSERT INTO habits (id, name, description, user_id, frequency, target_days, color) VALUES
    ('d00e8400-e29b-41d4-a716-446655440000', 'Daily Exercise', '30 minutes of exercise every day', '550e8400-e29b-41d4-a716-446655440000', 'daily', ARRAY[0,1,2,3,4,5,6], '#4caf50'),
    ('d00e8400-e29b-41d4-a716-446655440001', 'Read Technical Articles', 'Read at least one technical article daily', '550e8400-e29b-41d4-a716-446655440000', 'daily', ARRAY[0,1,2,3,4,5,6], '#2196f3')
ON CONFLICT DO NOTHING;

-- Habit Logs (last 7 days)
INSERT INTO habit_logs (habit_id, date, completed) VALUES
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '6 days', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '5 days', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '4 days', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE - INTERVAL '1 day', true),
    ('d00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE, false),
    ('d00e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', true),
    ('d00e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '2 days', true),
    ('d00e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', true),
    ('d00e8400-e29b-41d4-a716-446655440001', CURRENT_DATE, false)
ON CONFLICT DO NOTHING;

-- Update habit streaks
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440000');
SELECT update_habit_streak('d00e8400-e29b-41d4-a716-446655440001');

-- Reminders
INSERT INTO reminders (id, title, description, user_id, task_id, reminder_time, timezone, is_recurring) VALUES
    ('e00e8400-e29b-41d4-a716-446655440000', 'Review tasks', 'Check your tasks for today', '550e8400-e29b-41d4-a716-446655440000', NULL, CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00', 'UTC', true),
    ('e00e8400-e29b-41d4-a716-446655440001', 'Complete GraphQL API', 'Reminder to finish the GraphQL implementation', '550e8400-e29b-41d4-a716-446655440000', 'a00e8400-e29b-41d4-a716-446655440000', CURRENT_DATE + INTERVAL '2 days' + TIME '14:00:00', 'UTC', false)
ON CONFLICT DO NOTHING;
