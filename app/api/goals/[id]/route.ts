import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { updateGoal, deleteGoal } from "@/lib/db"
import { goalSchema } from "@/lib/schemas"

export const PUT = withAuth(async ({ request, params }) => {
  const { id } = params
  try {
    const body = await request.json()
    // We can use partial validation for updates
    const validation = goalSchema.partial().safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
    }

    const updatedGoal = await updateGoal(id, validation.data)
    if (!updatedGoal) {
      return NextResponse.json({ error: "Objectif non trouvé" }, { status: 404 })
    }

    return NextResponse.json(updatedGoal)
  } catch (error) {
    console.error(`Failed to update goal ${id}:`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})

export const DELETE = withAuth(async ({ params }) => {
  const { id } = params
  try {
    await deleteGoal(id)
    return NextResponse.json({ message: "Objectif supprimé avec succès" }, { status: 200 })
  } catch (error) {
    console.error(`Failed to delete goal ${id}:`, error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})
