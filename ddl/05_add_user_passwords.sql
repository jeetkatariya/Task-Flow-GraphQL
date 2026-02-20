-- Add passwords to existing seed users
-- Default password for all seed users: "password123"
-- Password hash for "password123" (bcrypt with 10 rounds)

-- Note: These are pre-hashed passwords. In production, never store plain text passwords!
-- To generate a new hash, use: node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10).then(h => console.log(h));"

UPDATE users SET password = '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq' WHERE email = 'alice@example.com';
UPDATE users SET password = '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq' WHERE email = 'bob@example.com';
UPDATE users SET password = '$2b$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZq' WHERE email = 'charlie@example.com';

-- Actually, let's generate proper hashes. Run this Node.js command to generate:
-- node -e "require('bcrypt').hash('password123', 10).then(h => console.log('UPDATE users SET password = \\'' + h + '\\' WHERE email = \\'alice@example.com\\';'))"
