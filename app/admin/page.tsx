"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Activity, Users, BarChart3, Settings, LogOut, Trash2, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  role: string
  is_active: boolean
  created_at: string
  total_workouts?: number
  total_calories?: number
}

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalWorkouts: number
  totalCalories: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      if (userData.role !== "admin") {
        router.push("/dashboard")
        return
      }
      setCurrentUser(userData)
    } else {
      router.push("/login")
      return
    }

    fetchAdminData()
  }, [router])

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const [usersResponse, statsResponse] = await Promise.all([
        fetch("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/api/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (usersResponse.ok && statsResponse.ok) {
        const usersData = await usersResponse.json()
        const statsData = await statsResponse.json()
        setUsers(usersData.users)
        setStats(statsData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== userId))
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleToggleUserStatus = async (userId: number, isActive: boolean) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ is_active: !isActive }),
      })

      if (response.ok) {
        setUsers(users.map((user) => (user.id === userId ? { ...user, is_active: !isActive } : user)))
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
          <p>Chargement du panel admin...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">FitTracker Admin</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Admin: {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                Dashboard
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Utilisateurs totaux</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-gray-500">Inscrits sur la plateforme</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Utilisateurs actifs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.activeUsers || 0}</div>
              <p className="text-xs text-gray-500">Comptes activés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Séances totales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalWorkouts || 0}</div>
              <p className="text-xs text-gray-500">Sur toute la plateforme</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Calories brûlées</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(stats?.totalCalories || 0).toLocaleString()}</div>
              <p className="text-xs text-gray-500">Total communauté</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytiques
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestion des utilisateurs</CardTitle>
                    <CardDescription>Gérez les comptes utilisateurs de la plateforme</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Rechercher un utilisateur..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                            <Badge variant={user.is_active ? "default" : "destructive"}>
                              {user.is_active ? "Actif" : "Inactif"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-right text-sm text-gray-500">
                          <p>{user.total_workouts || 0} séances</p>
                          <p>{(user.total_calories || 0).toLocaleString()} cal</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleUserStatus(user.id, user.is_active)}
                        >
                          {user.is_active ? "Désactiver" : "Activer"}
                        </Button>
                        {user.role !== "admin" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer {user.first_name} {user.last_name} ? Cette action
                                  est irréversible.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>Statistiques d'utilisation de la plateforme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Nouvelles inscriptions (7 jours)</span>
                      <span className="font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Séances ajoutées (7 jours)</span>
                      <span className="font-bold">156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Utilisateurs actifs (7 jours)</span>
                      <span className="font-bold">89</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Types d'exercices populaires</CardTitle>
                  <CardDescription>Les activités les plus pratiquées</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Course à pied</span>
                      <span className="font-bold">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Musculation</span>
                      <span className="font-bold">32%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Yoga</span>
                      <span className="font-bold">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Natation</span>
                      <span className="font-bold">8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de la plateforme</CardTitle>
                <CardDescription>Configuration générale de FitTracker</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="platform-name">Nom de la plateforme</Label>
                    <Input id="platform-name" defaultValue="FitTracker" />
                  </div>
                  <div>
                    <Label htmlFor="max-users">Nombre maximum d'utilisateurs</Label>
                    <Input id="max-users" type="number" defaultValue="1000" />
                  </div>
                  <div>
                    <Label htmlFor="maintenance">Mode maintenance</Label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input type="checkbox" id="maintenance" />
                      <Label htmlFor="maintenance">Activer le mode maintenance</Label>
                    </div>
                  </div>
                  <Button>Sauvegarder les paramètres</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
