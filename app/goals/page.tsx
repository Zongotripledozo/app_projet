"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { GoalSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/use-toast"
import { Target, Plus, Trash2, Edit } from "lucide-react"
import { format, parseISO } from "date-fns"
import { fr } from "date-fns/locale"
import { Skeleton } from "@/components/ui/skeleton"

type GoalFormValues = z.infer<typeof GoalSchema>

interface Goal extends GoalFormValues {
  id: string
  current_value: number
  status: "not_started" | "in_progress" | "completed" | "cancelled"
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormValues>({
    resolver: zodResolver(GoalSchema),
  })

  const fetchGoals = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Impossible de charger les objectifs.")
      const data = await response.json()
      setGoals(data)
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const onSubmit = async (data: GoalFormValues) => {
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Une erreur s'est produite.")
      }
      toast({ title: "Objectif créé !", description: "Votre nouvel objectif a été ajouté." })
      fetchGoals() // Refresh list
      setIsDialogOpen(false)
      reset()
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) return
    try {
      const token = localStorage.getItem("auth-token")
      const response = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!response.ok) throw new Error("Impossible de supprimer l'objectif.")
      toast({ title: "Objectif supprimé", description: "L'objectif a été retiré de votre liste." })
      fetchGoals() // Refresh list
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    }
  }

  // Extract the ternary operation into a variable
  let content
  if (isLoading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  } else if (goals.length === 0) {
    content = (
      <div className="text-center py-16 border-2 border-dashed rounded-lg">
        <Target className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun objectif</h3>
        <p className="mt-1 text-sm text-muted-foreground">Commencez par créer votre premier objectif.</p>
      </div>
    )
  } else {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const targetValue = goal.targetValue ?? 0
          const progress = targetValue > 0 ? (goal.current_value / targetValue) * 100 : 0
          return (
            <Card key={goal.id}>
              <CardHeader>
                <CardTitle>{goal.title}</CardTitle>
                <CardDescription>
                  Cible: {goal.targetValue} {goal.targetUnit}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Progress value={progress} />
                  <p className="text-sm text-muted-foreground">
                    {goal.current_value} / {goal.targetValue} {goal.targetUnit} ({Math.round(progress)}%)
                  </p>
                  {goal.targetDate && (
                    <p className="text-sm text-muted-foreground">
                      Échéance: {format(parseISO(goal.targetDate), "d MMMM yyyy", { locale: fr })}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" disabled>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(goal.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Target /> Mes Objectifs
        </h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouvel objectif</DialogTitle>
              <DialogDescription>Définissez ce que vous voulez accomplir.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields */}
              <div className="space-y-2">
                <Label htmlFor="title">Titre de l'objectif</Label>
                <Input id="title" {...register("title")} />
                {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" {...register("description")} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetValue">Valeur Cible</Label>
                  <Input id="targetValue" type="number" {...register("targetValue", { valueAsNumber: true })} />
                  {errors.targetValue && <p className="text-xs text-red-500">{errors.targetValue.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetUnit">Unité</Label>
                  <Input id="targetUnit" {...register("targetUnit")} placeholder="km, kg, minutes..." />
                  {errors.targetUnit && <p className="text-xs text-red-500">{errors.targetUnit.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Date de début</Label>
                  <Input id="targetDate" type="date" {...register("targetDate")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetDate">Date Cible</Label>
                  <Input id="targetDate" type="date" {...register("targetDate")} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">
                    Annuler
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer l'objectif"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {content}
    </div>
  )
}
