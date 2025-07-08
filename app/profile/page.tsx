"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/use-toast"

const ProfileSchema = z.object({
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères."),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string().email("Veuillez entrer une adresse email valide."),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  heightCm: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().positive().optional(),
})

type ProfileFormValues = z.infer<typeof ProfileSchema>

export default function ProfilePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [initialData, setInitialData] = useState<ProfileFormValues | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: initialData || {},
  })

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("auth-token")
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Impossible de charger le profil.")
        const data = await res.json()
        setInitialData(data)
        reset(data)
      } catch (error: any) {
        toast({ variant: "destructive", title: "Erreur", description: error.message })
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
    // eslint-disable-next-line
  }, [])

  const onSubmit = async (values: ProfileFormValues) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("auth-token")
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Impossible de mettre à jour le profil.")
      toast({ title: "Profil mis à jour!", description: "Vos informations ont été enregistrées." })
    } catch (error: any) {
      toast({ variant: "destructive", title: "Erreur", description: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Prénom</label>
                <Input {...register("firstName")}/>
                {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Nom</label>
                <Input {...register("lastName")}/>
                {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input type="email" {...register("email")}/>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Date de naissance</label>
                <Input type="date" {...register("dateOfBirth")}/>
                {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Genre</label>
                <select {...register("gender")} className="w-full border rounded px-2 py-1">
                  <option value="">Sélectionner</option>
                  <option value="male">Homme</option>
                  <option value="female">Femme</option>
                  <option value="other">Autre</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Taille (cm)</label>
                <Input type="number" {...register("heightCm")}/>
                {errors.heightCm && <p className="text-xs text-red-500">{errors.heightCm.message}</p>}
              </div>
              <div>
                <label className="block mb-1 font-medium">Poids (kg)</label>
                <Input type="number" {...register("weightKg")}/>
                {errors.weightKg && <p className="text-xs text-red-500">{errors.weightKg.message}</p>}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
