-- Add is_hidden column to board_posts
ALTER TABLE board_posts ADD COLUMN is_hidden boolean NOT NULL DEFAULT false;
