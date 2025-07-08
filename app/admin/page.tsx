"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, LogOut, Loader2 } from "lucide-react"

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  isAdmin: boolean
}

export default function AdminHomePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userStr = localStorage.getItem("user")
        const token = localStorage.getItem("auth-token")

        console.log("Auth check:", { 
          hasUser: !!userStr, 
          hasToken: !!token,
          pathname: window.location.pathname 
        })

        if (!userStr || !token) {
          console.log("No auth data, redirecting to login")
          setAuthChecked(true)
          setLoading(false)
          router.replace("/login?redirect=/admin")
          return
        }

        try {
          const userData = JSON.parse(userStr)
          console.log("User data:", userData)

          // Logique simple pour is_admin boolean
          const isAdmin = userData.isAdmin === true || userData.is_admin === true

          console.log("Admin check:", {
            isAdmin: userData.isAdmin,
            is_admin: userData.is_admin,
            finalResult: isAdmin
          })

          if (!isAdmin) {
            console.log("Not admin, redirecting to dashboard")
            setAuthChecked(true)
            setLoading(false)
            router.replace("/dashboard")
            return
          }

          console.log("Admin access granted")
          setCurrentUser(userData)
          setAuthChecked(true)
          setLoading(false)

        } catch (parseError) {
          console.error("Error parsing user data:", parseError)
          localStorage.removeItem("user")
          localStorage.removeItem("auth-token")
          setAuthChecked(true)
          setLoading(false)
          router.replace("/login?redirect=/admin")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setLoading(false)
      }
    }

    // Utiliser setTimeout pour éviter les problèmes de timing
    const timeoutId = setTimeout(checkAuth, 100)

    return () => clearTimeout(timeoutId)
  }, [router])

  // Éviter les re-renders si déjà vérifié
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <Card className="w-full max-w-xl">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span>Vérification des droits d'accès...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <Card className="w-full max-w-xl mb-8">
        <CardHeader>
          <CardTitle className="text-center">Panneau d'Administration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-4">
              Accès Administrateur
            </div>
            <p className="mb-2">Bienvenue, administrateur !</p>
            {currentUser && (
              <p className="text-sm text-gray-600 mb-4">
                Connecté en tant que : <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                <br />
                <span className="text-xs">({currentUser.email})</span>
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-3">
            <Button onClick={() => router.push("/admin/users")} className="w-full">
              Gérer les utilisateurs
            </Button>
            <Button onClick={() => router.push("/admin/stats")} variant="outline" className="w-full">
              Voir les statistiques
            </Button>
            <Button onClick={() => router.push("/admin/settings")} variant="outline" className="w-full">
              Paramètres
            </Button>
            <hr className="my-2" />
            <Button variant="destructive" onClick={handleLogout} className="flex items-center justify-center gap-2">
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