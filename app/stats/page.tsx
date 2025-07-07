"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, PieChart, TrendingUp } from "lucide-react"
import { useToast } from "@/components/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement)

interface StatsData {
  weeklySummary: any[]
  monthlySummary: any[]
  typeDistribution: any[]
}

export default function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("auth-token")
        const response = await fetch("/api/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!response.ok) {
          throw new Error("Impossible de charger les statistiques.")
        }
        const data = await response.json()
        setStats(data)
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: error.message,
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [toast])

  const weeklyChartData = {
    labels: stats?.weeklySummary.map((d) => d.day_of_week) || [],
    datasets: [
      {
        label: "Minutes d'entraînement",
        data: stats?.weeklySummary.map((d) => d.total_minutes) || [],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  }

  const typeChartData = {
    labels: stats?.typeDistribution.map((d) => d.workout_type) || [],
    datasets: [
      {
        label: "Répartition des séances",
        data: stats?.typeDistribution.map((d) => d.count) || [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
      },
    ],
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <BarChart /> Mes Statistiques
      </h1>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      ) : !stats || (stats.weeklySummary.length === 0 && stats.typeDistribution.length === 0) ? (
        <p className="text-center text-muted-foreground py-8">
          Pas assez de données pour afficher les statistiques. Enregistrez quelques séances !
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp /> Résumé de la semaine
              </CardTitle>
              <CardDescription>Temps d'entraînement total par jour</CardDescription>
            </CardHeader>
            <CardContent>
              <Bar data={weeklyChartData} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart /> Répartition par type
              </CardTitle>
              <CardDescription>Nombre de séances par type d'entraînement</CardDescription>
            </CardHeader>
            <CardContent>
              <Pie data={typeChartData} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
