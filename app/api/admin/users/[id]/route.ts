import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { verifyToken, isAdmin } from "@/lib/auth"

// Supprime un utilisateur
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!isAdmin(decoded)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const userId = Number.parseInt(params.id)

    // Vérification pour ne pas supprimer un admin
    const userCheck = await query("SELECT role FROM users WHERE id = $1", [userId])

    if (userCheck.rows.length === 0) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 })
    }

    if (userCheck.rows[0].role === "admin") {
      return NextResponse.json({ error: "Impossible de supprimer un administrateur" }, { status: 403 })
    }

    // Suppression de l'utilisateur
    await query("DELETE FROM users WHERE id = $1", [userId])

    return NextResponse.json({ message: "Utilisateur supprimé avec succès" })
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}

// Met à jour le statut d'un utilisateur (actif/inactif)
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token manquant" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!isAdmin(decoded)) {
      return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })
    }

    const userId = Number.parseInt(params.id)
    const { is_active } = await request.json()

    await query("UPDATE users SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [is_active, userId])

    return NextResponse.json({ message: "Statut utilisateur mis à jour" })
  } catch (error) {
    console.error("Erreur mise à jour utilisateur:", error)
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 })
  }
}
