import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { createWorkout, getWorkoutsByUserId } from "@/lib/db"
import { WorkoutSchema } from "@/lib/schemas"

export const GET = withAuth(async ({ user }) => {
  try {
    const workouts = await getWorkoutsByUserId(user.id)
    return NextResponse.json(workouts)
  } catch (error) {
    console.error("Failed to fetch workouts:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

export const POST = withAuth(async (req) => {
  const { user } = req;
  try {
    const body = await req.json()
    const validation = WorkoutSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
    }

    const newWorkout = await createWorkout({
      userId: user.id,
      ...validation.data,
    })

    return NextResponse.json(newWorkout, { status: 201 })
  } catch (error) {
    console.error("Failed to create workout:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})
