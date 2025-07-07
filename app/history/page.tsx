"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/use-toast"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Activity } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Workout {
  id: string
  name: string
  workout_type: string
  duration_minutes: number
  calories_burned: number
  workout_date: string
  intensity_level: number
  notes: string
}

export default function HistoryPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/workouts")
        if (!response.ok) {
          throw new Error("Impossible de charger l'historique.")
        }
        const data = await response.json()
        setWorkouts(data)
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
    fetchHistory()
  }, [toast])

  const getWorkoutTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      cardio: "Cardio",
      strength: "Musculation",
      flexibility: "Flexibilité",
      sports: "Sport",
      other: "Autre",
    }
    return labels[type] || "Autre"
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl flex items-center gap-2">
            <Activity />
            Historique des séances
          </CardTitle>
          <CardDescription>Retrouvez ici toutes vos séances d'entraînement enregistrées.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucune séance trouvée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="text-right">Durée</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Intensité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">{workout.name}</TableCell>
                    <TableCell>
                      <Badge>{getWorkoutTypeLabel(workout.workout_type)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {format(parseISO(workout.workout_date), "d MMMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="text-right">{workout.duration_minutes} min</TableCell>
                    <TableCell className="text-right">{workout.calories_burned} kcal</TableCell>
                    <TableCell className="text-right">{workout.intensity_level}/10</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
