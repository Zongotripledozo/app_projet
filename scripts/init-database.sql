-- FitTracker Database Schema
-- Version: 1.0
-- Description: Complete database schema for fitness tracking application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg < 1000),
    activity_level VARCHAR(20) DEFAULT 'moderate' CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- Workouts table
CREATE TABLE IF NOT EXISTS workouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    workout_type VARCHAR(50) NOT NULL CHECK (workout_type IN ('cardio', 'strength', 'flexibility', 'sports', 'other')),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
    calories_burned INTEGER CHECK (calories_burned >= 0),
    intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
    notes TEXT,
    workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goals table
CREATE TABLE IF NOT EXISTS goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'muscle_gain', 'endurance', 'strength', 'other')),
    target_value DECIMAL(10,2),
    target_unit VARCHAR(20),
    current_value DECIMAL(10,2) DEFAULT 0,
    target_date DATE,
    is_achieved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    achieved_at TIMESTAMP WITH TIME ZONE
);

-- User stats table (for tracking progress over time)
CREATE TABLE IF NOT EXISTS user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    weight_kg DECIMAL(5,2),
    body_fat_percentage DECIMAL(4,2) CHECK (body_fat_percentage >= 0 AND body_fat_percentage <= 100),
    muscle_mass_kg DECIMAL(5,2),
    recorded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recorded_date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_type ON workouts(workout_type);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_active ON goals(is_active);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_date ON user_stats(recorded_date);

-- Triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at BEFORE UPDATE ON workouts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate user's total workouts
CREATE OR REPLACE FUNCTION get_user_workout_count(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM workouts WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate user's total calories burned
CREATE OR REPLACE FUNCTION get_user_total_calories(user_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN COALESCE((SELECT SUM(calories_burned) FROM workouts WHERE user_id = user_uuid), 0);
END;
$$ LANGUAGE plpgsql;

-- View for user dashboard statistics
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(w.id) as total_workouts,
    COALESCE(SUM(w.duration_minutes), 0) as total_minutes,
    COALESCE(SUM(w.calories_burned), 0) as total_calories,
    COUNT(CASE WHEN w.workout_date >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as workouts_this_week,
    COUNT(CASE WHEN w.workout_date >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as workouts_this_month,
    COUNT(g.id) as total_goals,
    COUNT(CASE WHEN g.is_achieved = true THEN 1 END) as achieved_goals
FROM users u
LEFT JOIN workouts w ON u.id = w.user_id
LEFT JOIN goals g ON u.id = g.user_id AND g.is_active = true
WHERE u.is_active = true
GROUP BY u.id, u.first_name, u.last_name, u.email;

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, is_admin) 
VALUES (
    'admin@fittracker.com', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 
    'Admin', 
    'User', 
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert test user (password: test123)
INSERT INTO users (email, password_hash, first_name, last_name, height_cm, weight_kg) 
VALUES (
    'test@fittracker.com', 
    '$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'Test', 
    'User',
    175,
    70.5
) ON CONFLICT (email) DO NOTHING;
