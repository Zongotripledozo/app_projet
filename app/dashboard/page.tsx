"use client"
import { useCallback } from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, Target, TrendingUp, Calendar, Plus, LogOut, User, BarChart3, Clock, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { formatDate, formatDuration } from "@/lib/utils"

interface DashboardData {
  user: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  stats: {
    totalWorkouts: number
    totalMinutes: number
    totalCalories: number
    workoutsThisWeek: number
    workoutsThisMonth: number
    totalGoals: number
    achievedGoals: number
  }
  recentWorkouts: Array<{
    id: string
    name: string
    workoutType: string
    durationMinutes: number
    caloriesBurned: number
    workoutDate: string
    intensityLevel: number
  }>
  activeGoals: Array<{
    id: string
    title: string
    goalType: string
    targetValue: number
    currentValue: number
    targetUnit: string
    targetDate: string
    progress: number
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch("/api/dashboard")

      if (response.ok) {
        const dashboardData = await response.json()
        setData(dashboardData)
      } else if (response.status === 401) {
        router.push("/login")
      } else {
        throw new Error("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Dashboard error:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données du tableau de bord",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [router, toast])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    })
    router.push("/login")
  }

  const getWorkoutTypeColor = (type: string) => {
    const colors = {
      cardio: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      strength: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      flexibility: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      sports: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[type as keyof typeof colors] || colors.other
  }

  const getWorkoutTypeLabel = (type: string) => {
    const labels = {
      cardio: "Cardio",
      strength: "Musculation",
      flexibility: "Flexibilité",
      sports: "Sport",
      other: "Autre",
    }
    return labels[type as keyof typeof labels] || "Autre"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Chargement de votre tableau de bord...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Erreur lors du chargement des données</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (!data.stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p>Erreur lors du chargement des statistiques utilisateur</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Activity className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">FitTracker</h1>
                <p className="text-sm text-muted-foreground">Bonjour, {data.user.firstName} !</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séances totales</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats?.totalWorkouts ?? "-"}</div>
              <p className="text-xs text-muted-foreground">{data.stats?.workoutsThisWeek ?? "-"} cette semaine</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps total</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(data.stats?.totalMinutes ?? 0)}</div>
              <p className="text-xs text-muted-foreground">d'entraînement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories brûlées</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.stats?.totalCalories ?? "-"}</div>
              <p className="text-xs text-muted-foreground">kcal au total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objectifs</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.stats?.achievedGoals ?? "-"}/{data.stats?.totalGoals ?? "-"}
              </div>
              <p className="text-xs text-muted-foreground">objectifs atteints</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Button asChild className="h-16">
            <Link href="/workout/new">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle séance
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-16 bg-transparent">
            <Link href="/goals">
              <Target className="h-5 w-5 mr-2" />
              Mes objectifs
            </Link>
          </Button>
          <Button variant="outline" asChild className="h-16 bg-transparent">
            <Link href="/stats">
              <BarChart3 className="h-5 w-5 mr-2" />
              Statistiques
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Workouts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Séances récentes</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/history">Voir tout</Link>
                </Button>
              </div>
              <CardDescription>Vos dernières séances d'entraînement</CardDescription>
            </CardHeader>
            <CardContent>
              {data.recentWorkouts.length > 0 ? (
                <div className="space-y-4">
                  {data.recentWorkouts.slice(0, 5).map((workout) => (
                    <div key={workout.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{workout.name}</h4>
                          <Badge className={getWorkoutTypeColor(workout.workoutType)}>
                            {getWorkoutTypeLabel(workout.workoutType)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(workout.durationMinutes)}
                          </span>
                          {workout.caloriesBurned > 0 && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3" />
                              {workout.caloriesBurned} kcal
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(workout.workoutDate)}
                          </span>
                        </div>
                      </div>
                      {workout.intensityLevel && (
                        <div className="text-right">
                          <div className="text-sm font-medium">Intensité {workout.intensityLevel}/10</div>
                          <Progress value={workout.intensityLevel * 10} className="w-16 h-2 mt-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucune séance enregistrée</p>
                  <Button asChild>
                    <Link href="/workout/new">Enregistrer ma première séance</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Objectifs actifs</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/goals">Gérer</Link>
                </Button>
              </div>
              <CardDescription>Vos objectifs en cours</CardDescription>
            </CardHeader>
            <CardContent>
              {data.activeGoals.length > 0 ? (
                <div className="space-y-4">
                  {data.activeGoals.slice(0, 5).map((goal) => (
                    <div key={goal.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{goal.title}</h4>
                        <Badge variant="outline">{Math.round(goal.progress)}%</Badge>
                      </div>
                      <Progress value={goal.progress} className="mb-2" />
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>
                          {goal.currentValue} / {goal.targetValue} {goal.targetUnit}
                        </span>
                        {goal.targetDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(goal.targetDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Aucun objectif défini</p>
                  <Button asChild>
                    <Link href="/goals">Créer mon premier objectif</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Progress */}
        {(data.stats?.workoutsThisWeek ?? 0) > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progression cette semaine
              </CardTitle>
              <CardDescription>
                Vous avez effectué {data.stats?.workoutsThisWeek ?? 0} séance{(data.stats?.workoutsThisWeek ?? 0) > 1 ? "s" : ""} cette semaine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground mb-1">Objectif hebdomadaire (3 séances)</div>
                  <Progress value={Math.min(((data.stats?.workoutsThisWeek ?? 0) / 3) * 100, 100)} className="h-3" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(((data.stats?.workoutsThisWeek ?? 0) / 3) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">complété</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
