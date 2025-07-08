import { NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"
import { getUserById, updateUserProfile } from "@/lib/db"
import { ProfileUpdateSchema } from "@/lib/schemas"

// GET: Get current user profile
export const GET = withAuth(async ({ user }) => {
  const dbUser = await getUserById(user.id)
  if (!dbUser) {
    return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
  }
  return NextResponse.json({
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    email: dbUser.email,
    dateOfBirth: dbUser.date_of_birth || "",
    gender: dbUser.gender || "",
    heightCm: dbUser.height_cm || "",
    weightKg: dbUser.weight_kg || "",
  })
})

// PUT: Update current user profile
export const PUT = withAuth(async (req) => {
  const { user } = req
  const body = await req.json()
  const validation = ProfileUpdateSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
  }
  const data = validation.data
  await updateUserProfile(user.id, data)
  return NextResponse.json({ success: true })
})
