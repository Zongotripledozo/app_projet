import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken, isAdmin } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!isAdmin(decoded)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    // Statistiques générales
    const [usersStats, workoutsStats] = await Promise.all([
      query(`
        SELECT 
          COUNT(*) as total_users,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_users
        FROM users
      `),
      query(`
        SELECT 
          COUNT(*) as total_workouts,
          COALESCE(SUM(calories), 0) as total_calories
        FROM workouts
      `),
    ])

    const stats = {
      totalUsers: Number.parseInt(usersStats.rows[0].total_users),
      activeUsers: Number.parseInt(usersStats.rows[0].active_users),
      totalWorkouts: Number.parseInt(workoutsStats.rows[0].total_workouts),
      totalCalories: Number.parseInt(workoutsStats.rows[0].total_calories),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Erreur admin stats:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
