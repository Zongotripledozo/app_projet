import { z } from "zod"

// ============================================================
// Schémas d'Authentification
// ============================================================

export const RegisterSchema = z.object({
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
  lastName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  heightCm: z.coerce.number().positive().optional(),
  weightKg: z.coerce.number().positive().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(1, { message: "Le mot de passe est requis." }),
})

// ============================================================
// Schémas de l'Application
// ============================================================

export const WorkoutSchema = z.object({
  name: z.string().min(2, { message: "Le nom de la séance doit contenir au moins 2 caractères." }),
  workoutType: z.string().min(1, { message: "Le type de séance est requis." }),
  durationMinutes: z.coerce.number().positive({ message: "La durée doit être un nombre positif." }),
  caloriesBurned: z.coerce.number().positive().optional(),
  intensityLevel: z.coerce.number().min(1).max(10).optional(),
  notes: z.string().optional(),
  workoutDate: z.string().optional(),
})

export const GoalSchema = z.object({
  title: z.string().min(2, { message: "Le titre de l'objectif doit contenir au moins 2 caractères." }),
  goalType: z.string().min(1, { message: "Le type d'objectif est requis." }),
  targetValue: z.coerce.number().positive().optional(),
  targetUnit: z.string().optional(),
  targetDate: z.string().optional(),
  description: z.string().optional(),
})
