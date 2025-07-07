"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { WorkoutSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/use-toast"
import { Dumbbell } from "lucide-react"

type WorkoutFormValues = z.infer<typeof WorkoutSchema>

export default function NewWorkoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue, // Ajout de setValue ici
    formState: { errors, isSubmitting },
  } = useForm<WorkoutFormValues>({
    resolver: zodResolver(WorkoutSchema),
    defaultValues: {
      workoutDate: new Date().toISOString().split("T")[0],
      durationMinutes: 30,
      caloriesBurned: 0,
      intensityLevel: 5,
    },
  })

  const onSubmit = async (data: WorkoutFormValues) => {
    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Une erreur s'est produite.")
      }

      toast({
        title: "Séance enregistrée !",
        description: "Votre nouvelle séance a été ajoutée avec succès.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error.message,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Dumbbell className="h-6 w-6" />
            Enregistrer une nouvelle séance
          </CardTitle>
          <CardDescription>Remplissez les détails de votre entraînement.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la séance</Label>
                <Input id="name" {...register("name")} placeholder="Ex: Course à pied, Musculation dos..." />
                {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="workoutType">Type de séance</Label>
                <Select name="workoutType" onValueChange={(value) => setValue("workoutType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="strength">Musculation</SelectItem>
                    <SelectItem value="flexibility">Flexibilité</SelectItem>
                    <SelectItem value="sports">Sport</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                {errors.workoutType && <p className="text-xs text-red-500">{errors.workoutType.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutDate">Date</Label>
                <Input id="workoutDate" type="date" {...register("workoutDate")} />
                {errors.workoutDate && <p className="text-xs text-red-500">{errors.workoutDate.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="durationMinutes">Durée (minutes)</Label>
                <Input id="durationMinutes" type="number" {...register("durationMinutes", { valueAsNumber: true })} />
                {errors.durationMinutes && <p className="text-xs text-red-500">{errors.durationMinutes.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caloriesBurned">Calories brûlées (kcal)</Label>
                <Input id="caloriesBurned" type="number" {...register("caloriesBurned", { valueAsNumber: true })} />
                {errors.caloriesBurned && <p className="text-xs text-red-500">{errors.caloriesBurned.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="intensityLevel">Niveau d'intensité (1-10)</Label>
                <Input
                  id="intensityLevel"
                  type="number"
                  min="1"
                  max="10"
                  {...register("intensityLevel", { valueAsNumber: true })}
                />
                {errors.intensityLevel && <p className="text-xs text-red-500">{errors.intensityLevel.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Textarea id="notes" {...register("notes")} placeholder="Ex: Poids soulevés, sensations, etc." />
              {errors.notes && <p className="text-xs text-red-500">{errors.notes.message}</p>}
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Enregistrement..." : "Enregistrer la séance"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
