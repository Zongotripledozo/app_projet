import { NextResponse } from "next/server"
import { createUser, getUserByEmail } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { RegisterSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = RegisterSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
    }

    const { email, password, firstName, lastName, dateOfBirth, gender, heightCm, weightKg } = validation.data

    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "Un compte avec cet email existe déjà" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const newUser = await createUser({
      email,
      passwordHash,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      heightCm,
      weightKg,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Compte créé avec succès",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
