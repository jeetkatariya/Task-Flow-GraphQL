-- Seed data for demo purposes
-- Default password for all users: "password123"

INSERT INTO users (id, email, username, first_name, last_name, password) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'alice@example.com', 'alice', 'Alice', 'Johnson', '$2b$10$RAFlFycSQG2BrQVB0HHOe.6FTj9i0fPfcQhauSMmwr0ddy0DEMm2.'),
    ('550e8400-e29b-41d4-a716-446655440001', 'bob@example.com', 'bob', 'Bob', 'Smith', '$2b$10$IUwVK0FqvvaGIwxtyap4DeWeY1dRrQBknj/Ql0VFuiNM61i.yrkYK'),
    ('550e8400-e29b-41d4-a716-446655440002', 'charlie@example.com', 'charlie', 'Charlie', 'Brown', '$2b$10$ucM4FdOxPmio7CwVWFqUhefHKwW/i81gjAWug/oJasH6MBtDFkq1G'),
    ('550e8400-e29b-41d4-a716-446655440003', 'diana@example.com', 'diana', 'Diana', 'Chen', '$2b$10$RAFlFycSQG2BrQVB0HHOe.6FTj9i0fPfcQhauSMmwr0ddy0DEMm2.')
ON CONFLICT (id) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (id, title, content, author_id, published) VALUES
    ('660e8400-e29b-41d4-a716-446655440000', 'Welcome to GraphQL', 'This is a demo post about GraphQL with NestJS and Aurora Postgres.', '550e8400-e29b-41d4-a716-446655440000', true),
    ('660e8400-e29b-41d4-a716-446655440001', 'TypeScript Best Practices', 'Here are some best practices for TypeScript development.', '550e8400-e29b-41d4-a716-446655440001', true),
    ('660e8400-e29b-41d4-a716-446655440002', 'Draft Post', 'This is a draft post that is not published yet.', '550e8400-e29b-41d4-a716-446655440000', false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample comments
INSERT INTO comments (id, content, post_id, author_id) VALUES
    ('770e8400-e29b-41d4-a716-446655440000', 'Great post! Thanks for sharing.', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001'),
    ('770e8400-e29b-41d4-a716-446655440001', 'I found this very helpful.', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002'),
    ('770e8400-e29b-41d4-a716-446655440002', 'Looking forward to more content!', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;
