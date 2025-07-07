-- Schéma complet de la base de données FitTracker
-- Avec contraintes, index et triggers

-- Suppression des tables existantes pour une recréation propre
DROP TABLE IF EXISTS user_stats, goals, workouts, users CASCADE;

-- =============================================
-- TABLE USERS (Utilisateurs)
-- =============================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    age INTEGER CHECK (age > 0 AND age < 150),
    weight DECIMAL(5,2) CHECK (weight > 0 AND weight < 1000),
    height INTEGER CHECK (height > 0 AND height < 300),
    fitness_level VARCHAR(50) CHECK (fitness_level IN ('débutant', 'intermédiaire', 'avancé', 'expert')),
    goals_description VARCHAR(255),
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE WORKOUTS (Séances d'Entraînement)
-- =============================================
CREATE TABLE workouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('cardio', 'musculation', 'yoga', 'pilates', 'natation', 'course', 'vélo', 'boxe', 'crossfit', 'marche', 'autre')),
    date DATE NOT NULL,
    duration INTEGER NOT NULL CHECK (duration > 0 AND duration <= 1440), -- max 24h
    distance DECIMAL(6,2) CHECK (distance >= 0 AND distance <= 1000), -- max 1000km
    calories INTEGER CHECK (calories >= 0 AND calories <= 10000), -- max 10000 cal
    intensity VARCHAR(20) NOT NULL CHECK (intensity IN ('faible', 'modérée', 'élevée', 'très_élevée')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE GOALS (Objectifs)
-- =============================================
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    goal_type VARCHAR(50) NOT NULL CHECK (goal_type IN ('poids', 'distance', 'durée', 'répétitions', 'calories', 'fréquence')),
    target_value DECIMAL(10,2) NOT NULL CHECK (target_value > 0),
    current_value DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (current_value >= 0),
    unit VARCHAR(20) NOT NULL CHECK (unit IN ('kg', 'km', 'min', 'reps', 'cal', 'séances')),
    start_date DATE NOT NULL,
    end_date DATE CHECK (end_date IS NULL OR end_date >= start_date),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- TABLE USER_STATS (Statistiques Utilisateur)
-- =============================================
CREATE TABLE user_stats (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    total_workouts INTEGER NOT NULL DEFAULT 0 CHECK (total_workouts >= 0),
    total_calories INTEGER NOT NULL DEFAULT 0 CHECK (total_calories >= 0),
    total_duration INTEGER NOT NULL DEFAULT 0 CHECK (total_duration >= 0), -- en minutes
    total_distance DECIMAL(8,2) NOT NULL DEFAULT 0 CHECK (total_distance >= 0), -- en km
    current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0), -- en jours
    best_streak INTEGER NOT NULL DEFAULT 0 CHECK (best_streak >= 0), -- en jours
    last_workout_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================
-- INDEX POUR LES PERFORMANCES
-- =============================================
CREATE INDEX idx_workouts_user_date ON workouts(user_id, date DESC);
CREATE INDEX idx_workouts_type ON workouts(type);
CREATE INDEX idx_goals_user_active ON goals(user_id, is_active);
CREATE INDEX idx_goals_end_date ON goals(end_date) WHERE end_date IS NOT NULL;
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================
-- TRIGGERS POUR LA MISE À JOUR AUTOMATIQUE
-- =============================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
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

-- =============================================
-- TRIGGER POUR MISE À JOUR DES STATISTIQUES
-- =============================================

-- Fonction pour mettre à jour les statistiques utilisateur
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Mise à jour des stats après insertion d'une séance
    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_stats (user_id, total_workouts, total_calories, total_duration, total_distance, last_workout_date)
        VALUES (NEW.user_id, 1, COALESCE(NEW.calories, 0), NEW.duration, COALESCE(NEW.distance, 0), NEW.date)
        ON CONFLICT (user_id) DO UPDATE SET
            total_workouts = user_stats.total_workouts + 1,
            total_calories = user_stats.total_calories + COALESCE(NEW.calories, 0),
            total_duration = user_stats.total_duration + NEW.duration,
            total_distance = user_stats.total_distance + COALESCE(NEW.distance, 0),
            last_workout_date = GREATEST(user_stats.last_workout_date, NEW.date),
            updated_at = NOW();
        RETURN NEW;
    END IF;
    
    -- Mise à jour des stats après suppression d'une séance
    IF TG_OP = 'DELETE' THEN
        UPDATE user_stats SET
            total_workouts = GREATEST(0, total_workouts - 1),
            total_calories = GREATEST(0, total_calories - COALESCE(OLD.calories, 0)),
            total_duration = GREATEST(0, total_duration - OLD.duration),
            total_distance = GREATEST(0, total_distance - COALESCE(OLD.distance, 0)),
            updated_at = NOW()
        WHERE user_id = OLD.user_id;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour les statistiques
CREATE TRIGGER trigger_update_user_stats_insert
    AFTER INSERT ON workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

CREATE TRIGGER trigger_update_user_stats_delete
    AFTER DELETE ON workouts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_stats();

-- =============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- =============================================

-- Insertion d'un utilisateur admin par défaut
INSERT INTO users (email, password, first_name, last_name, role) 
VALUES ('admin@fittracker.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Admin', 'FitTracker', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insertion d'un utilisateur de démonstration
INSERT INTO users (email, password, first_name, last_name, age, weight, height, fitness_level, goals_description) 
VALUES ('demo@fittracker.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq9w5KS', 'Demo', 'User', 28, 70.5, 175, 'intermédiaire', 'Perdre 5kg et courir un semi-marathon')
ON CONFLICT (email) DO NOTHING;

-- Commentaires sur les tables
COMMENT ON TABLE users IS 'Table des utilisateurs de l''application FitTracker';
COMMENT ON TABLE workouts IS 'Table des séances d''entraînement enregistrées par les utilisateurs';
COMMENT ON TABLE goals IS 'Table des objectifs personnels définis par les utilisateurs';
COMMENT ON TABLE user_stats IS 'Table des statistiques agrégées par utilisateur pour optimiser les performances';

-- Commentaires sur les colonnes importantes
COMMENT ON COLUMN users.role IS 'Rôle de l''utilisateur: user (utilisateur standard) ou admin (administrateur)';
COMMENT ON COLUMN workouts.intensity IS 'Niveau d''intensité de la séance: faible, modérée, élevée, très_élevée';
COMMENT ON COLUMN goals.goal_type IS 'Type d''objectif: poids, distance, durée, répétitions, calories, fréquence';
COMMENT ON COLUMN user_stats.current_streak IS 'Nombre de jours consécutifs avec au moins une séance d''entraînement';
