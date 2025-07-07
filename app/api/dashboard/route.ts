import { NextResponse } from "next/server"
import { withAuth, type AuthenticatedRequest } from "@/lib/auth"
import { getUserById, getUserDashboardData, getWorkoutsByUserId, getGoalsByUserId } from "@/lib/db"

async function handler(req: AuthenticatedRequest) {
  try {
    const userId = req.user.id

    const [user, dashboardRow, allWorkouts, allGoals] = await Promise.all([
      getUserById(userId),
      getUserDashboardData(userId),
      getWorkoutsByUserId(userId),
      getGoalsByUserId(userId),
    ])

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    // Compose stats object from dashboardRow (the SQL view)
    const stats = {
      totalWorkouts: dashboardRow?.total_workouts ?? 0,
      totalMinutes: dashboardRow?.total_minutes ?? 0,
      totalCalories: dashboardRow?.total_calories ?? 0,
      workoutsThisWeek: dashboardRow?.workouts_this_week ?? 0,
      workoutsThisMonth: dashboardRow?.workouts_this_month ?? 0, // fallback if not present
      totalGoals: dashboardRow?.total_goals ?? 0,
      achievedGoals: dashboardRow?.achieved_goals ?? 0,
    }

    // Recent workouts: last 5
    const recentWorkouts = (allWorkouts || []).slice(0, 5).map((w: any) => ({
      id: w.id,
      name: w.name,
      workoutType: w.workout_type,
      durationMinutes: w.duration_minutes,
      caloriesBurned: w.calories_burned,
      workoutDate: w.workout_date,
      intensityLevel: w.intensity_level,
    }))

    // Active goals: status in_progress, last 5
    const activeGoals = (allGoals || [])
      .filter((g: any) => g.status === "in_progress")
      .slice(0, 5)
      .map((g: any) => ({
        id: g.id,
        title: g.title,
        goalType: g.goal_type,
        targetValue: g.target_value,
        currentValue: g.current_value,
        targetUnit: g.target_unit,
        targetDate: g.target_date,
        progress: g.target_value && g.current_value ? Math.min((g.current_value / g.target_value) * 100, 100) : 0,
      }))

    const responseData = {
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      },
      stats,
      recentWorkouts,
      activeGoals,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

export const GET = withAuth(handler)
