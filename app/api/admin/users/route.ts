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

    // Récupération des utilisateurs et de leurs statistiques
    const result = await query(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.role, u.is_active, u.created_at,
        COALESCE(us.total_workouts, 0) as total_workouts,
        COALESCE(us.total_calories, 0) as total_calories
      FROM users u
      LEFT JOIN user_stats us ON u.id = us.user_id
      ORDER BY u.created_at DESC
    `)

    return NextResponse.json({ users: result.rows })
  } catch (error) {
    console.error("Erreur admin users:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
