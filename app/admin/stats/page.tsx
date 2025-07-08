"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalWorkouts: number
  totalCalories: number
}

export default function AdminStatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
      return
    }
    fetch("/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return <div className="p-8 text-center">Chargement des statistiques...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>Statistiques de la plateforme</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>Utilisateurs totaux : <b>{stats?.totalUsers}</b></div>
            <div>Utilisateurs actifs : <b>{stats?.activeUsers}</b></div>
            <div>Séances totales : <b>{stats?.totalWorkouts}</b></div>
            <div>Calories brûlées : <b>{stats?.totalCalories?.toLocaleString()}</b></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
