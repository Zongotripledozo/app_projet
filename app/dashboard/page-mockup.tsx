import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Activity, BarChart3, Flame, PlusCircle, Repeat, Target } from "lucide-react"

export default function DashboardPageMockup() {
  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Header - Supposé être dans le layout principal */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        {/* User avatar and dropdown would go here */}
      </header>

      <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nouvelle Séance
          </Button>
          <Button variant="outline">
            <Target className="mr-2 h-4 w-4" />
            Mes Objectifs
          </Button>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Statistiques
          </Button>
        </div>

        {/* Key Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Séances Totales</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">120</div>
              <p className="text-xs text-muted-foreground">+5 ce mois-ci</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Calories Brûlées</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25,150 kcal</div>
              <p className="text-xs text-muted-foreground">+12% par rapport à la semaine dernière</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps d'Entraînement</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150h 30m</div>
              <p className="text-xs text-muted-foreground">Durée totale</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak Actuel</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7 jours</div>
              <p className="text-xs text-muted-foreground">Continue comme ça !</p>
            </CardContent>
          </Card>
        </div>

        {/* Goals and Recent Workouts */}
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader>
              <CardTitle>Progression des Objectifs</CardTitle>
              <CardDescription>Suivez vos objectifs et restez motivé.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-medium">Perte de poids</span>
                  <span className="text-sm text-muted-foreground">3kg / 5kg</span>
                </div>
                <Progress value={60} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <span className="font-medium">Distance de course</span>
                  <span className="text-sm text-muted-foreground">42km / 50km</span>
                </div>
                <Progress value={84} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Séances Récentes</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Course à pied</TableCell>
                    <TableCell>45 min</TableCell>
                    <TableCell>Aujourd'hui</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Musculation</TableCell>
                    <TableCell>60 min</TableCell>
                    <TableCell>Hier</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Vélo</TableCell>
                    <TableCell>30 min</TableCell>
                    <TableCell>Il y a 3 jours</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
