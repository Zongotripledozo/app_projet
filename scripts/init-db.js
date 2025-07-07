const { Client } = require("pg")

async function initDatabase() {
  const client = new Client({
    host: "localhost",
    port: 5432,
    database: "fittracker",
    user: "fittracker_user",
    password: "fittracker_pass",
  })

  try {
    await client.connect()
    console.log("✅ Connexion à la base de données réussie")

    // Test simple
    const result = await client.query("SELECT COUNT(*) FROM users")
    console.log(`✅ Base de données initialisée avec ${result.rows[0].count} utilisateurs`)
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données:", error.message)
    process.exit(1)
  } finally {
    await client.end()
  }
}

initDatabase()
