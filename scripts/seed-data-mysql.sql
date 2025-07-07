-- Utiliser la base fittracker
USE fittracker;

-- Utilisateur de test (mot de passe: "password123")
INSERT IGNORE INTO users (email, password, first_name, last_name, age, weight, height, fitness_level, goals) 
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
);

-- Récupérer l'ID de l'utilisateur demo
SET @demo_user_id = (SELECT id FROM users WHERE email = 'demo@fittracker.fr');

-- Séances d'exemple
INSERT IGNORE INTO workouts (user_id, type, duration, intensity, calories, notes, date) VALUES
(@demo_user_id, 'running', 30, 'moderate', 300, 'Belle course matinale dans le parc', DATE_SUB(CURDATE(), INTERVAL 1 DAY)),
(@demo_user_id, 'weightlifting', 45, 'high', 250, 'Séance haut du corps - bon feeling', DATE_SUB(CURDATE(), INTERVAL 2 DAY)),
(@demo_user_id, 'yoga', 60, 'low', 150, 'Séance relaxante après le travail', DATE_SUB(CURDATE(), INTERVAL 3 DAY)),
(@demo_user_id, 'cycling', 40, 'moderate', 320, 'Sortie vélo en campagne', DATE_SUB(CURDATE(), INTERVAL 4 DAY)),
(@demo_user_id, 'swimming', 35, 'high', 280, 'Natation en piscine - bon rythme', DATE_SUB(CURDATE(), INTERVAL 5 DAY));

-- Objectifs d'exemple
INSERT IGNORE INTO goals (user_id, title, description, target_value, current_value, unit, goal_type, start_date, end_date) VALUES
(@demo_user_id, 'Séances par semaine', 'Faire au moins 4 séances de sport par semaine', 4, 3, 'séances', 'weekly', DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY)),
(@demo_user_id, 'Calories mensuelles', 'Brûler 8000 calories ce mois-ci', 8000, 1300, 'calories', 'monthly', DATE_FORMAT(CURDATE(), '%Y-%m-01'), LAST_DAY(CURDATE())),
(@demo_user_id, 'Course hebdomadaire', 'Courir 2 fois par semaine minimum', 2, 1, 'séances', 'weekly', DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), DATE_ADD(DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY), INTERVAL 6 DAY));

-- Notifications d'exemple
INSERT IGNORE INTO notifications (user_id, title, message, type, scheduled_for) VALUES
(@demo_user_id, 'Rappel d\'entraînement', 'Il est temps de faire votre séance de sport !', 'reminder', DATE_ADD(NOW(), INTERVAL 1 HOUR)),
(@demo_user_id, 'Objectif atteint !', 'Félicitations ! Vous avez atteint votre objectif de calories cette semaine.', 'achievement', NOW());
