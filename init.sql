-- FitTracker Database Schema
-- Version: 2.0
-- Description: Corrected and finalized database schema.

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main table for users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(50),
    height_cm INT,
    weight_kg NUMERIC(5, 2),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMPTZ
);

-- Table for workout sessions
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    workout_type VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    calories_burned INT,
    intensity_level INT,
    notes TEXT,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table for user goals
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    goal_type VARCHAR(100) NOT NULL,
    target_value NUMERIC(10, 2),
    current_value NUMERIC(10, 2) DEFAULT 0,
    target_unit VARCHAR(50),
    start_date DATE DEFAULT CURRENT_DATE,
    target_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress', -- e.g., 'in_progress', 'achieved', 'abandoned'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking user stats over time (e.g., weight, body fat)
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_workouts INT DEFAULT 0,
    total_calories INT DEFAULT 0,
    total_duration INT DEFAULT 0, -- en minutes
    last_workout_date DATE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);

-- Trigger function to automatically update the 'updated_at' timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Applying the trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- View for user dashboard statistics (calculates stats on the fly)
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT
    u.id AS user_id,
    u.first_name,
    u.last_name,
    (SELECT COUNT(*) FROM workouts w WHERE w.user_id = u.id) AS total_workouts,
    (SELECT SUM(w.duration_minutes) FROM workouts w WHERE w.user_id = u.id) AS total_minutes,
    (SELECT SUM(w.calories_burned) FROM workouts w WHERE w.user_id = u.id) AS total_calories,
    (SELECT COUNT(*) FROM workouts w WHERE w.user_id = u.id AND w.workout_date >= date_trunc('week', CURRENT_DATE)) AS workouts_this_week,
    (SELECT COUNT(*) FROM goals g WHERE g.user_id = u.id) AS total_goals,
    (SELECT COUNT(*) FROM goals g WHERE g.user_id = u.id AND g.status = 'achieved') AS achieved_goals
FROM
    users u;

-- SEED DATA --

-- Insert default admin user (password: admin123)
INSERT INTO users (id, email, password_hash, first_name, last_name, is_admin, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@fittracker.com', '$2a$12$tP8Y.N4.L4F.XfK2.iU21eB3eF6aC8b9dE0gH2iJ4kL6mN8oP0qS', 'Admin', 'User', TRUE, TRUE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'aris.abrous@efrei.net', '$2a$12$1SZSU5Nc95IOiDb70FO/qu5Kord0ePKROXvpdfzOGIwpSEI0h.95W', 'John', 'Doe', FALSE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert some workout data for the test users
INSERT INTO workouts (user_id, name, workout_type, duration_minutes, calories_burned, workout_date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Morning Run', 'running', 30, 350, '2025-07-01'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Full Body Strength', 'weightlifting', 60, 500, '2025-07-02'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Evening Yoga', 'yoga', 45, 150, '2025-07-03')
ON CONFLICT DO NOTHING;

-- Insert some goal data for the test users
INSERT INTO goals (user_id, title, goal_type, target_value, current_value, target_unit, target_date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Run a 5k', 'distance', 5, 2.5, 'km', '2025-08-01'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Lose 5kg', 'weight', 75, 78, 'kg', '2025-09-01')
ON CONFLICT DO NOTHING;

-- Manually update user stats for the test data
-- In production, this logic will be in your application's API.
INSERT INTO user_stats (user_id, total_workouts, total_calories, total_duration, last_workout_date) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 3, 1000, 135, '2025-07-03')
ON CONFLICT (user_id) DO UPDATE SET
    total_workouts = EXCLUDED.total_workouts,
    total_calories = EXCLUDED.total_calories,
    total_duration = EXCLUDED.total_duration,
    last_workout_date = EXCLUDED.last_workout_date;
