import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { getUserById } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-fallback-secret-key-that-is-very-long"

export interface AuthPayload extends jwt.JwtPayload {
  userId: string
  isAdmin: boolean
  iat: number
  exp: number
}

export interface AuthenticatedRequest extends NextRequest {
  user: {
    id: string
    isAdmin: boolean
  }
}

// --- Fonctions de base ---

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(user: { id: string; email: string; is_admin: boolean }): string {
  const payload = {
    userId: user.id,
    isAdmin: user.is_admin,
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch (error) {
    console.error("Invalid token:", error)
    return null
  }
}

// --- Gardien d'API (Higher-Order Function) ---

type RouteHandler = (req: AuthenticatedRequest, params?: { [key: string]: any }) => Promise<NextResponse>
interface AuthOptions {
  adminRequired?: boolean
}

export function withAuth(handler: RouteHandler, options: AuthOptions = {}) {
  return async (req: NextRequest, context: { params?: { [key: string]: any } }) => {
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : req.cookies.get("auth-token")?.value

    // Add debug log for the token
    console.log("[withAuth] Received token:", token)

    if (!token) {
      return NextResponse.json({ error: "Accès non autorisé: Token manquant" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Accès non autorisé: Token invalide" }, { status: 401 })
    }

    // Vérifier si l'utilisateur existe toujours en BDD
    const user = await getUserById(decoded.userId)
    if (!user) {
      return NextResponse.json({ error: "Accès non autorisé: Utilisateur non trouvé" }, { status: 401 })
    }

    if (options.adminRequired && !user.is_admin) {
      return NextResponse.json({ error: "Accès refusé: Droits administrateur requis" }, { status: 403 })
    }

    const authenticatedRequest = req as AuthenticatedRequest
    authenticatedRequest.user = { id: user.id, isAdmin: user.is_admin }

    return handler(authenticatedRequest, context.params)
  }
}
