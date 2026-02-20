-- Migration script to add password column to users table
-- Run this if you have existing data and need to add the password column

-- Add password column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'password'
    ) THEN
        ALTER TABLE users ADD COLUMN password VARCHAR(255);
    END IF;
END $$;

-- Note: Existing users will need to reset their passwords
-- You may want to set a default password or require password reset for existing users
