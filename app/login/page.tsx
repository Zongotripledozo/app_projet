"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { LoginSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/use-toast"
import { Activity } from "lucide-react"

type LoginFormValues = z.infer<typeof LoginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Une erreur s'est produite.")
      }

      toast({
        title: "Connexion réussie!",
        description: "Bienvenue sur votre tableau de bord.",
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: error.message,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Activity className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="mt-2 text-2xl font-bold">Se connecter</CardTitle>
          <CardDescription>Accédez à votre tableau de bord FitTracker.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Pas encore de compte?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              S'inscrire
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
