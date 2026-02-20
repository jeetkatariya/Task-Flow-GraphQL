-- Performance Optimization Indexes
-- These indexes improve query performance for common operations

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_user_priority ON tasks(user_id, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_date ON tasks(user_id, due_date) WHERE due_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tasks_completed_at ON tasks(completed_at) WHERE completed_at IS NOT NULL;

-- Full-text search index for tasks (using GIN for better performance)
CREATE INDEX IF NOT EXISTS idx_tasks_title_search ON tasks USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Note indexes
CREATE INDEX IF NOT EXISTS idx_notes_user_pinned ON notes(user_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_notes_user_archived ON notes(user_id, is_archived) WHERE is_archived = false;
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);

-- Full-text search index for notes (using GIN)
CREATE INDEX IF NOT EXISTS idx_notes_search_vector ON notes USING gin(search_vector) WHERE search_vector IS NOT NULL;

-- Habit indexes
CREATE INDEX IF NOT EXISTS idx_habits_user ON habits(user_id);
CREATE INDEX IF NOT EXISTS idx_habit_logs_habit_date ON habit_logs(habit_id, date);
CREATE INDEX IF NOT EXISTS idx_habit_logs_completed ON habit_logs(habit_id, date) WHERE completed = true;

-- Reminder indexes
CREATE INDEX IF NOT EXISTS idx_reminders_user_time ON reminders(user_id, reminder_time);
CREATE INDEX IF NOT EXISTS idx_reminders_time_completed ON reminders(reminder_time, is_completed) WHERE is_completed = false;
CREATE INDEX IF NOT EXISTS idx_reminders_recurring ON reminders(is_recurring) WHERE is_recurring = true;

-- Task-Tag relation index
CREATE INDEX IF NOT EXISTS idx_task_tags_task ON task_tags_relation(task_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_tag ON task_tags_relation(tag_id);

-- Note-Tag relation index
CREATE INDEX IF NOT EXISTS idx_note_tags_note ON note_tags_relation(note_id);
CREATE INDEX IF NOT EXISTS idx_note_tags_tag ON note_tags_relation(tag_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_tasks_user_status_priority ON tasks(user_id, status, priority);
CREATE INDEX IF NOT EXISTS idx_tasks_user_due_status ON tasks(user_id, due_date, status) WHERE due_date IS NOT NULL;

-- Partial indexes for active/incomplete items
CREATE INDEX IF NOT EXISTS idx_tasks_active ON tasks(user_id, due_date) WHERE status != 'done' AND status != 'archived';
CREATE INDEX IF NOT EXISTS idx_reminders_active ON reminders(user_id, reminder_time) WHERE is_completed = false;
