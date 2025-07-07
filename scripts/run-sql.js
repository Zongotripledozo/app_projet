const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

async function runSqlFile(filename) {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL environment variable is required")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)
  const sqlFile = path.join(__dirname, filename)

  try {
    const sqlContent = fs.readFileSync(sqlFile, "utf8")
    console.log(`Executing ${filename}...`)

    await sql(sqlContent)
    console.log(`✅ ${filename} executed successfully`)
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error)
    process.exit(1)
  }
}

const filename = process.argv[2]
if (!filename) {
  console.error("Please provide a SQL file to execute")
  console.error("Usage: node run-sql.js <filename>")
  process.exit(1)
}

runSqlFile(filename)
