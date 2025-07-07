import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FitTracker - Suivi Sportif Personnel",
  description: "Application de suivi sportif et de fitness personnalisée",
  keywords: "fitness, sport, suivi, entraînement, objectifs",
  authors: [{ name: "FitTracker Team" }],
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
