# 🏋️ FitTracker - Votre Partenaire Fitness Ultime

FitTracker est une application web complète et moderne conçue pour les passionnés de fitness. Suivez vos entraînements, fixez-vous des objectifs ambitieux, analysez vos performances avec des graphiques détaillés et gérez votre parcours sportif, le tout depuis une interface intuitive et réactive.

![FitTracker Dashboard](https://storage.googleapis.com/v0-public/dev/images/fittracker-dashboard.png)

---

## 📋 Table des matières

- [À propos du projet](#-à-propos-du-projet)
- [🛠️ Stack Technique](#️-stack-technique)
- [✨ Fonctionnalités Clés](#-fonctionnalités-clés)
- [🚀 Démarrage Rapide (Installation Locale)](#-démarrage-rapide-installation-locale)
- [🐳 Commandes Docker Essentielles](#-commandes-docker-essentielles)
- [🔐 Comptes de Démonstration](#-comptes-de-démonstration)
- [📝 Endpoints de l'API](#-endpoints-de-lapi)
- [📂 Structure du Projet](#-structure-du-projet)

---

## 🎯 À propos du projet

L'objectif de FitTracker est de fournir une solution tout-en-un pour le suivi de la condition physique. Que vous soyez un athlète débutant ou confirmé, l'application vous offre les outils nécessaires pour :

-   **Enregistrer** chaque séance d'entraînement avec des détails précis (exercices, séries, répétitions, poids).
-   **Visualiser** votre progression grâce à un tableau de bord personnel et des statistiques claires.
-   **Gérer** vos objectifs personnels et suivre leur accomplissement.
-   **Administrer** la plateforme via un panel d'administration complet.

Le projet est entièrement conteneurisé avec Docker, garantissant un environnement de développement et de production cohérent et facile à déployer sur n'importe quel système d'exploitation (Windows, macOS, Linux).

---

## 🛠️ Stack Technique

FitTracker est construit avec des technologies modernes, performantes et fiables.

| Catégorie          | Technologie                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| **Framework**      | [**Next.js 14**](https://nextjs.org/) (React) - App Router, Server Components, API Routes                |
| **Langage**        | [**TypeScript**](https://www.typescriptlang.org/) - Pour un code robuste et maintenable                 |
| **Base de Données**| [**PostgreSQL**](https://www.postgresql.org/) - Système de gestion de base de données relationnelle open-source |
| **Style & UI**     | [**Tailwind CSS**](https://tailwindcss.com/) & [**shadcn/ui**](https://ui.shadcn.com/) - Design moderne et composants réutilisables |
| **Authentification**| **JWT** (JSON Web Tokens) & **bcrypt** - Sécurisation des comptes et des sessions                       |
| **Conteneurisation**| [**Docker**](https://www.docker.com/) & **Docker Compose** - Pour la reproductibilité et le déploiement |

---

## ✨ Fonctionnalités Clés

### Pour les Utilisateurs
-   **Tableau de Bord Personnel** : Vue d'ensemble des dernières activités, statistiques clés et progression vers les objectifs.
-   **Gestion des Séances** : Ajout, modification et consultation de l'historique des entraînements.
-   **Suivi des Performances** : Graphiques interactifs pour visualiser l'évolution (poids soulevé, volume total, etc.).
-   **Définition d'Objectifs** : Créez des objectifs (ex: "Courir 10km" ou "Soulever 100kg au développé couché").
-   **Profil Utilisateur** : Gérez vos informations personnelles.

### Pour les Administrateurs
-   **Panel d'Administration** : Tableau de bord avec des statistiques globales sur l'application.
-   **Gestion des Utilisateurs** : Visualisez, modifiez ou supprimez des comptes utilisateurs.
-   **Supervision de l'Activité** : Accédez aux données d'utilisation de la plateforme.

---

## 🚀 Démarrage Rapide (Installation Locale)

Grâce à Docker, lancer le projet est simple et ne requiert aucune installation complexe de base de données ou de dépendances sur votre machine.

### Prérequis
-   [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) : Assurez-vous qu'il est installé et en cours d'exécution.
-   [**Git**](https://git-scm.com/) : Pour cloner le projet.

### Étapes d'installation

1.  **Clonez le dépôt :**
    Ouvrez un terminal (PowerShell, CMD ou Git Bash sur Windows) et exécutez la commande suivante.
    \`\`\`bash
    git clone <URL_DU_DEPOT_GIT>
    cd fittracker
    \`\`\`

2.  **Créez votre fichier d'environnement :**
    Copiez le fichier d'exemple `.env.example` pour créer votre configuration locale. Ce fichier est crucial car il contient les secrets de l'application.
    \`\`\`bash
    # Sur Windows (CMD)
    copy .env.example .env.local

    # Sur Windows (PowerShell) ou autres systèmes
    cp .env.example .env.local
    \`\`\`
    *Ce fichier est déjà ignoré par Git, vos secrets ne seront jamais partagés.*

3.  **Lancez l'application avec Docker Compose :**
    Cette commande unique va construire l'image de l'application et démarrer tous les services nécessaires (l'app Next.js, la base de données PostgreSQL et l'interface d'administration de la BDD).
    \`\`\`bash
    docker-compose -f docker-compose.dev.yml up --build
    \`\`\`
    -   `--build` : Force la reconstruction de l'image si le code a changé.
    -   Attendez que le terminal affiche des messages indiquant que les services sont prêts.

4.  **Accédez à l'application :**
    -   **FitTracker** est maintenant disponible à l'adresse 👉 [**http://localhost:3000**](http://localhost:3000)
    -   **PGAdmin** (pour gérer la BDD) est disponible à 👉 [**http://localhost:5050**](http://localhost:5050)

---

## 🐳 Commandes Docker Essentielles

Toutes les commandes suivantes doivent être exécutées à la racine du projet.

-   **Démarrer les services en arrière-plan :**
    \`\`\`bash
    docker-compose -f docker-compose.dev.yml up -d
    \`\`\`

-   **Arrêter les services :**
    \`\`\`bash
    docker-compose -f docker-compose.dev.yml down
    \`\`\`

-   **Voir les logs de l'application en temps réel (très utile pour le débogage) :**
    \`\`\`bash
    docker-compose -f docker-compose.dev.yml logs -f app
    \`\`\`

-   **Réinitialiser complètement la base de données (ATTENTION : supprime toutes les données) :**
    \`\`\`bash
    docker-compose -f docker-compose.dev.yml down -v
    \`\`\`
    L'option `-v` supprime les volumes Docker, y compris les données persistantes de la base de données.

---

## 🔐 Comptes de Démonstration

Une fois l'application lancée et la base de données initialisée, vous pouvez utiliser ces comptes pour vous connecter :

| Rôle          | Email                  | Mot de passe  |
| ------------- | ---------------------- | ------------- |
| **Utilisateur** | `demo@fittracker.com`  | `password123` |
| **Admin**     | `admin@fittracker.com` | `password123` |

---

## 📝 Endpoints de l'API

L'application expose une API RESTful pour toutes les interactions avec le backend.

| Méthode | Endpoint                   | Description                               |
| ------- | -------------------------- | ----------------------------------------- |
| `POST`  | `/api/auth/register`       | Inscription d'un nouvel utilisateur.      |
| `POST`  | `/api/auth/login`          | Connexion d'un utilisateur.               |
| `GET`   | `/api/dashboard`           | Récupère les données du tableau de bord.  |
| `POST`  | `/api/workouts`            | Ajoute une nouvelle séance d'entraînement.|
| `GET`   | `/api/workouts`            | Récupère l'historique des séances.        |
| `GET`   | `/api/admin/users`         | Liste tous les utilisateurs (Admin).      |
| `DELETE`| `/api/admin/users/:id`     | Supprime un utilisateur (Admin).          |
| `PATCH` | `/api/admin/users/:id`     | Modifie un utilisateur (Admin).           |

---

## 📂 Structure du Projet

Le projet suit la structure recommandée par Next.js 14 (App Router) pour une organisation claire et évolutive.

\`\`\`
fittracker/
├── app/                  # Cœur de l'application (pages, layouts, API routes)
│   ├── (auth)/           # Routes et pages liées à l'authentification
│   ├── (dashboard)/      # Routes et pages protégées du tableau de bord
│   ├── api/              # Endpoints de l'API backend
│   └── layout.tsx        # Layout principal
├── components/           # Composants React réutilisables (UI)
│   └── ui/               # Composants générés par shadcn/ui
├── lib/                  # Fonctions utilitaires, helpers (ex: BDD, auth)
├── public/               # Fichiers statiques (images, polices)
├── scripts/              # Scripts pour la base de données (init, seed)
├── Dockerfile            # Instructions pour construire l'image de l'application
└── docker-compose.yml    # Orchestration des services Docker
\`\`\`

---

**FitTracker** - Conçu pour vous aider à dépasser vos limites. 💪
