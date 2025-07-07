import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { getUserStats } from "@/lib/db"

export const GET = withAuth(async ({ user }) => {
  try {
    const stats = await getUserStats(user.id)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
})
