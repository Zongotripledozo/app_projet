import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  // At least 6 characters, contains letter and number
  return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password)
}

// Fitness utilities
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return "Sous-poids"
  if (bmi < 25) return "Poids normal"
  if (bmi < 30) return "Surpoids"
  return "Obésité"
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
}

// API response utilities
export function createSuccessResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

export function createErrorResponse(message: string, status = 500) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

// Form validation
export function validateWorkoutForm(data: any) {
  const errors: string[] = []

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Le nom de la séance doit contenir au moins 2 caractères")
  }

  if (!data.workoutType) {
    errors.push("Le type de séance est requis")
  }

  if (!data.durationMinutes || data.durationMinutes < 1) {
    errors.push("La durée doit être d'au moins 1 minute")
  }

  if (data.intensityLevel && (data.intensityLevel < 1 || data.intensityLevel > 10)) {
    errors.push("L'intensité doit être entre 1 et 10")
  }

  return errors
}

export function validateGoalForm(data: any) {
  const errors: string[] = []

  if (!data.title || data.title.trim().length < 2) {
    errors.push("Le titre de l'objectif doit contenir au moins 2 caractères")
  }

  if (!data.goalType) {
    errors.push("Le type d'objectif est requis")
  }

  if (data.targetDate) {
    const targetDate = new Date(data.targetDate)
    const today = new Date()
    if (targetDate <= today) {
      errors.push("La date cible doit être dans le futur")
    }
  }

  return errors
}
