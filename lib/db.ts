import { Pool } from "pg"
import type { User } from "@/lib/types"

let pool: Pool

if (process.env.NODE_ENV === "production") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })
} else {
  // Ensure the pool is a singleton in development
  if (!global.hasOwnProperty("pool")) {
    global.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  pool = global.pool
}

export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log("Executed query", { text, duration: `${duration}ms`, rows: res.rowCount })
    return res
  } catch (error) {
    console.error("Database query error:", { text, error })
    throw error
  }
}

// --- User Functions ---
export async function getUserByEmail(email: string): Promise<User | null> {
  const res = await query("SELECT * FROM users WHERE email = $1 AND is_active = true", [email])
  return res.rows[0] || null
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await query("SELECT * FROM users WHERE id = $1 AND is_active = true", [id])
  return res.rows[0] || null
}

export async function createUser(data: any) {
  const { email, passwordHash, firstName, lastName, dateOfBirth, gender, heightCm, weightKg } = data
  const res = await query(
    `INSERT INTO users (email, password_hash, first_name, last_name, date_of_birth, gender, height_cm, weight_kg)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING id, email, first_name, last_name`,
    [email, passwordHash, firstName, lastName, dateOfBirth, gender, heightCm, weightKg],
  )
  return res.rows[0]
}

// Update user profile
export async function updateUserProfile(userId: string, data: any) {
  const { firstName, lastName, email, dateOfBirth, gender, heightCm, weightKg } = data
  const res = await query(
    `UPDATE users SET
      first_name = $1,
      last_name = $2,
      email = $3,
      date_of_birth = $4,
      gender = $5,
      height_cm = $6,
      weight_kg = $7,
      updated_at = CURRENT_TIMESTAMP
     WHERE id = $8
     RETURNING id, email, first_name, last_name, date_of_birth, gender, height_cm, weight_kg`,
    [firstName, lastName, email, dateOfBirth, gender, heightCm, weightKg, userId]
  )
  return res.rows[0]
}

// --- Workout Functions ---
export async function getWorkoutsByUserId(userId: string) {
  const res = await query("SELECT * FROM workouts WHERE user_id = $1 ORDER BY workout_date DESC", [userId])
  return res.rows
}

export async function createWorkout(data: any) {
  const { userId, name, workoutType, durationMinutes, caloriesBurned, workoutDate, notes, intensityLevel } = data
  const res = await query(
    `INSERT INTO workouts (user_id, name, workout_type, duration_minutes, calories_burned, workout_date, notes, intensity_level)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, name, workoutType, durationMinutes, caloriesBurned, workoutDate, notes, intensityLevel],
  )
  return res.rows[0]
}

// --- Goal Functions ---
export async function getGoalsByUserId(userId: string) {
  const res = await query("SELECT * FROM goals WHERE user_id = $1 ORDER BY target_date ASC", [userId])
  return res.rows
}

export async function createGoal(data: any) {
  const { userId, title, goalType, description, targetValue, targetUnit, startDate, targetDate } = data
  const res = await query(
    `INSERT INTO goals (user_id, title, goal_type, description, target_value, target_unit, start_date, target_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, title, goalType, description, targetValue, targetUnit, startDate, targetDate],
  )
  return res.rows[0]
}

export async function updateGoal(id: string, data: any) {
  const { title, description, targetValue, currentValue, status } = data
  const res = await query(
    `UPDATE goals
     SET title = $1, description = $2, target_value = $3, current_value = $4, status = $5, updated_at = CURRENT_TIMESTAMP
     WHERE id = $6
     RETURNING *`,
    [title, description, targetValue, currentValue, status, id],
  )
  return res.rows[0]
}

export async function deleteGoal(id: string) {
  await query("DELETE FROM goals WHERE id = $1", [id])
}

// --- Stats Functions ---
export async function getUserDashboardData(userId: string) {
  const res = await query("SELECT * FROM user_dashboard_stats WHERE user_id = $1", [userId])
  return res.rows[0]
}

export async function getUserStats(userId: string) {
  const weeklyRes = await query("SELECT * FROM weekly_workout_summary WHERE user_id = $1", [userId])
  const monthlyRes = await query("SELECT * FROM monthly_workout_summary WHERE user_id = $1", [userId])
  const typeRes = await query("SELECT * FROM workout_type_distribution WHERE user_id = $1", [userId])

  return {
    weeklySummary: weeklyRes.rows,
    monthlySummary: monthlyRes.rows,
    typeDistribution: typeRes.rows,
  }
}
