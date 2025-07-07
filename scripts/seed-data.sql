-- Données d'exemple pour tester l'application
-- Utilisateur de test (mot de passe: "password123")
INSERT INTO users (email, password, first_name, last_name, age, weight, height, fitness_level, goals) 
VALUES (
    'demo@fittracker.fr', 
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/VcSAg/9qm', 
    'Jean', 
    'Dupont', 
    30, 
    75.5, 
    175, 
    'intermediate', 
    'weight_loss'
) ON CONFLICT (email) DO NOTHING;

-- Séances d'exemple pour l'utilisateur demo
INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
SELECT 
    u.id,
    'running',
    30,
    'moderate',
    300,
    'Belle course matinale dans le parc',
    CURRENT_DATE - INTERVAL '1 day'
FROM users u WHERE u.email = 'demo@fittracker.fr'
ON CONFLICT DO NOTHING;

INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
SELECT 
    u.id,
    'weightlifting',
    45,
    'high',
    250,
    'Séance haut du corps - bon feeling',
    CURRENT_DATE - INTERVAL '2 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
SELECT 
    u.id,
    'yoga',
    60,
    'low',
    150,
    'Séance relaxante après le travail',
    CURRENT_DATE - INTERVAL '3 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
SELECT 
    u.id,
    'cycling',
    40,
    'moderate',
    320,
    'Sortie vélo en campagne',
    CURRENT_DATE - INTERVAL '4 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
SELECT 
    u.id,
    'swimming',
    35,
    'high',
    280,
    'Natation en piscine - bon rythme',
    CURRENT_DATE - INTERVAL '5 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

-- Objectifs d'exemple
INSERT INTO goals (user_id, title, description, target_value, current_value, unit, goal_type, start_date, end_date) 
SELECT 
    u.id,
    'Séances par semaine',
    'Faire au moins 4 séances de sport par semaine',
    4,
    3,
    'séances',
    'weekly',
    DATE_TRUNC('week', CURRENT_DATE),
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO goals (user_id, title, description, target_value, current_value, unit, goal_type, start_date, end_date) 
SELECT 
    u.id,
    'Calories mensuelles',
    'Brûler 8000 calories ce mois-ci',
    8000,
    1300,
    'calories',
    'monthly',
    DATE_TRUNC('month', CURRENT_DATE),
    DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO goals (user_id, title, description, target_value, current_value, unit, goal_type, start_date, end_date) 
SELECT 
    u.id,
    'Course hebdomadaire',
    'Courir 2 fois par semaine minimum',
    2,
    1,
    'séances',
    'weekly',
    DATE_TRUNC('week', CURRENT_DATE),
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days'
FROM users u WHERE u.email = 'demo@fittracker.fr';

-- Notifications d'exemple
INSERT INTO notifications (user_id, title, message, type, scheduled_for) 
SELECT 
    u.id,
    'Rappel d''entraînement',
    'Il est temps de faire votre séance de sport !',
    'reminder',
    CURRENT_TIMESTAMP + INTERVAL '1 hour'
FROM users u WHERE u.email = 'demo@fittracker.fr';

INSERT INTO notifications (user_id, title, message, type) 
SELECT 
    u.id,
    'Objectif atteint !',
    'Félicitations ! Vous avez atteint votre objectif de calories cette semaine.',
    'achievement'
FROM users u WHERE u.email = 'demo@fittracker.fr';
