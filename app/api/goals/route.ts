import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { createGoal, getGoalsByUserId } from "@/lib/db"
import { goalSchema } from "@/lib/schemas"

export const GET = withAuth(async ({ user }) => {
  try {
    const goals = await getGoalsByUserId(user.id)
    return NextResponse.json(goals)
  } catch (error) {
    console.error("Failed to fetch goals:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

export const POST = withAuth(async ({ request, user }) => {
  try {
    const body = await request.json()
    const validation = goalSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
    }

    const newGoal = await createGoal({
      userId: user.id,
      ...validation.data,
    })

    return NextResponse.json(newGoal, { status: 201 })
  } catch (error) {
    console.error("Failed to create goal:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})
