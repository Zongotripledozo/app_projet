import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, query } from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
import { LoginSchema } from "@/lib/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validation = LoginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: "Données invalides", details: validation.error.flatten() }, { status: 400 })
    }

    const { email, password } = validation.data

    const user = await getUserByEmail(email)

    if (!user || !user.password_hash || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect" }, { status: 401 })
    }

    await query("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1", [user.id])

    const token = generateToken(user)

    const response = NextResponse.json({
      success: true,
      message: "Connexion réussie",
      token: token, // Ajout du token dans la réponse
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        isAdmin: user.is_admin,
      },
    })

    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    })

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}