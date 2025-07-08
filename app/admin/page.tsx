"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, LogOut } from "lucide-react"

export default function AdminHomePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return;
    const user = localStorage.getItem("user")
    const token = localStorage.getItem("auth-token")
    if (!user || !token) {
      // Prevent infinite loop: only redirect if not already on /login
      if (!window.location.pathname.startsWith("/login")) {
        router.replace("/login?redirect=/admin")
      }
      return
    }
    const userData = JSON.parse(user)
    const isAdmin = userData.role === "admin" || userData.isAdmin === true || userData.is_admin === true
    if (!isAdmin) {
      router.replace("/dashboard")
      return
    }
    setCurrentUser(userData)
    // Affiche le panel admin
  }, [router])
  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle>Bienvenue sur le panneau d'administration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Vous êtes connecté en tant qu'administrateur.</p>
          <div className="flex flex-col gap-4">
            <Button onClick={() => router.push("/admin/users")}>Gérer les utilisateurs</Button>
            <Button onClick={() => router.push("/admin/stats")}>Voir les statistiques</Button>
            <Button variant="destructive" onClick={handleLogout} className="mt-4 flex items-center gap-2">
              <LogOut className="h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center space-x-2 text-gray-500">
        <Activity className="h-5 w-5 animate-spin" />
        <span>FitTracker Admin Panel</span>
      </div>
    </div>
  )
}

