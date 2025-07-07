-- V2 avec la table user_stats et des types plus précis

-- Suppression des tables existantes pour une recréation propre
DROP TABLE IF EXISTS user_stats, goals, workouts, users CASCADE;

-- Table des utilisateurs
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age > 0),
    weight DECIMAL(5,2) CHECK (weight > 0),
    height INTEGER CHECK (height > 0),
    fitness_level VARCHAR(50),
    goals_description VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des entraînements
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0), -- en minutes
    distance DECIMAL(6,2) CHECK (distance >= 0), -- en km
    calories INTEGER CHECK (calories >= 0),
    intensity VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des objectifs
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table des statistiques utilisateur (pour la performance)
CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_workouts INTEGER NOT NULL DEFAULT 0,
    total_calories INTEGER NOT NULL DEFAULT 0,
    total_duration INTEGER NOT NULL DEFAULT 0, -- en minutes
    current_streak INTEGER NOT NULL DEFAULT 0, -- en jours
    last_workout_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour accélérer les requêtes courantes
CREATE INDEX IF NOT EXISTS idx_workouts_user_date ON workouts(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_goals_user_active ON goals(user_id, is_active);

-- Trigger pour mettre à jour automatiquement 'updated_at'
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_goals
BEFORE UPDATE ON goals
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_user_stats
BEFORE UPDATE ON user_stats
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();
