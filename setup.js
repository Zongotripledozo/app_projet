const { execSync } = require("child_process")
const fs = require("fs")

console.log("🚀 Configuration automatique de FitTracker avec Docker...\n")

// 1. Vérifier que Docker est installé
console.log("🐳 Vérification de Docker...")
try {
  execSync("docker --version", { stdio: "pipe" })
  execSync("docker-compose --version", { stdio: "pipe" })
  console.log("✅ Docker et Docker Compose sont installés\n")
} catch (error) {
  console.error("❌ Docker n'est pas installé ou accessible")
  console.error("Veuillez installer Docker Desktop: https://www.docker.com/products/docker-desktop")
  process.exit(1)
}

// 2. Installer les dépendances
console.log("📦 Installation des dépendances...")
try {
  execSync("npm install", { stdio: "inherit" })
  console.log("✅ Dépendances installées\n")
} catch (error) {
  console.error("❌ Erreur lors de l'installation des dépendances")
  process.exit(1)
}

// 3. Créer le fichier .env.local
console.log("📝 Configuration de l'environnement...")
const envContent = `# Base de données PostgreSQL locale (Docker)
DATABASE_URL="postgresql://fittracker_user:fittracker_password@localhost:5432/fittracker"

# JWT Secret pour l'authentification
JWT_SECRET="fittracker_super_secret_key_2024_docker_local"

# URL de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`

fs.writeFileSync(".env.local", envContent)
console.log("✅ Fichier .env.local créé\n")

// 4. Démarrer les containers Docker
console.log("🐳 Démarrage des containers Docker...")
try {
  execSync("docker-compose up -d", { stdio: "inherit" })
  console.log("✅ Containers Docker démarrés\n")
} catch (error) {
  console.error("❌ Erreur lors du démarrage des containers")
  process.exit(1)
}

// 5. Attendre que PostgreSQL soit prêt
console.log("⏳ Attente de PostgreSQL...")

// Fonction d'attente compatible Windows
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function waitForPostgres() {
  let retries = 30

  // Attendre 5 secondes avant de commencer les vérifications
  await sleep(5000)

  while (retries > 0) {
    try {
      execSync("docker-compose exec -T postgres pg_isready -U fittracker_user -d fittracker", { stdio: "pipe" })
      break
    } catch (error) {
      retries--
      if (retries === 0) {
        console.error("❌ PostgreSQL n'est pas prêt après 30 tentatives")
        process.exit(1)
      }
      console.log(`⏳ PostgreSQL pas encore prêt, ${retries} tentatives restantes...`)
      await sleep(2000)
    }
  }
  console.log("✅ PostgreSQL est prêt\n")
}

waitForPostgres().then(async () => {
  // 6. Initialiser la base de données avec des données de test
  console.log("🗄️ Initialisation des données de test...")
  const { Client } = require("pg")

  async function initDatabase() {
    const client = new Client({
      connectionString: "postgresql://fittracker_user:fittracker_password@localhost:5432/fittracker",
    })

    try {
      await client.connect()

      // Créer l'utilisateur de démonstration
      const bcrypt = require("bcryptjs")
      const hashedPassword = await bcrypt.hash("password123", 12)

      // Insérer l'utilisateur
      await client.query(
        `INSERT INTO users (email, password, first_name, last_name, age, weight, height, fitness_level, goals) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         ON CONFLICT (email) DO NOTHING`,
        ["demo@fittracker.fr", hashedPassword, "Jean", "Dupont", 30, 75.5, 175, "intermediate", "weight_loss"],
      )

      // Récupérer l'ID de l'utilisateur
      const userResult = await client.query("SELECT id FROM users WHERE email = $1", ["demo@fittracker.fr"])

      if (userResult.rows.length > 0) {
        const userId = userResult.rows[0].id

        // Ajouter des séances d'exemple une par une
        const workouts = [
          [userId, "running", 30, "moderate", 300, "Belle course matinale", "CURRENT_DATE - INTERVAL '1 day'"],
          [userId, "weightlifting", 45, "high", 250, "Séance haut du corps", "CURRENT_DATE - INTERVAL '2 days'"],
          [userId, "yoga", 60, "low", 150, "Séance relaxante", "CURRENT_DATE - INTERVAL '3 days'"],
          [userId, "cycling", 40, "moderate", 320, "Sortie vélo", "CURRENT_DATE - INTERVAL '4 days'"],
          [userId, "swimming", 35, "high", 280, "Natation", "CURRENT_DATE - INTERVAL '5 days'"],
        ]

        for (const workout of workouts) {
          try {
            await client.query(
              `INSERT INTO workouts (user_id, type, duration, intensity, calories, notes, date) 
               VALUES ($1, $2, $3, $4, $5, $6, ${workout[6]})`,
              workout.slice(0, 6),
            )
          } catch (err) {
            console.log(`Séance ${workout[1]} déjà existante, ignorée`)
          }
        }

        // Ajouter des objectifs d'exemple un par un
        const goals = [
          [userId, "Séances par semaine", "Faire 4 séances par semaine", 4, 3, "séances", "weekly"],
          [userId, "Calories mensuelles", "Brûler 8000 calories ce mois", 8000, 1300, "calories", "monthly"],
          [userId, "Course hebdomadaire", "Courir 2 fois par semaine", 2, 1, "séances", "weekly"],
        ]

        for (const goal of goals) {
          try {
            await client.query(
              `INSERT INTO goals (user_id, title, description, target_value, current_value, unit, goal_type, start_date, end_date) 
               VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days')`,
              goal,
            )
          } catch (err) {
            console.log(`Objectif ${goal[1]} déjà existant, ignoré`)
          }
        }
      }

      await client.end()
      console.log("✅ Données de test ajoutées avec succès\n")
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation des données:", error)
      await client.end()
      process.exit(1)
    }
  }

  // 7. Lancer l'initialisation
  initDatabase().then(() => {
    console.log("🎉 Configuration terminée avec succès!\n")
    console.log("📋 Informations importantes:")
    console.log("   • Application: http://localhost:3000")
    console.log("   • Base PostgreSQL: localhost:5432")
    console.log("   • Compte démo: demo@fittracker.fr / password123\n")
    console.log("🚀 Commandes utiles:")
    console.log("   npm run dev              # Démarrer l'application")
    console.log("   npm run docker:stop      # Arrêter les containers")
    console.log("   npm run docker:reset     # Réinitialiser tout\n")

    console.log("🔄 Pour démarrer l'application, tapez:")
    console.log("   npm run dev")
  })
})
