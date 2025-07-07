import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Target, TrendingUp } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">FitTracker</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/register">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Suivez vos
            <span className="text-primary"> performances sportives</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            FitTracker vous aide à enregistrer vos séances, suivre vos progrès et atteindre vos objectifs fitness de
            manière simple et efficace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                J'ai déjà un compte
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Activity className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Suivi des séances</CardTitle>
              <CardDescription>
                Enregistrez facilement vos entraînements avec tous les détails importants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Type d'exercice et durée</li>
                <li>• Calories brûlées</li>
                <li>• Niveau d'intensité</li>
                <li>• Notes personnelles</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Objectifs personnalisés</CardTitle>
              <CardDescription>Définissez et suivez vos objectifs fitness personnalisés</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Perte ou prise de poids</li>
                <li>• Gain de muscle</li>
                <li>• Amélioration de l'endurance</li>
                <li>• Objectifs personnalisés</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Analyse des progrès</CardTitle>
              <CardDescription>Visualisez votre évolution avec des graphiques détaillés</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                <li>• Graphiques de progression</li>
                <li>• Statistiques détaillées</li>
                <li>• Historique complet</li>
                <li>• Tendances et insights</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Pourquoi choisir FitTracker ?</h3>
            <p className="text-gray-600 dark:text-gray-300">Une solution complète pour votre suivi sportif personnel</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <div className="text-gray-600 dark:text-gray-300">Gratuit et local</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">🔒</div>
              <div className="text-gray-600 dark:text-gray-300">Données privées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">📱</div>
              <div className="text-gray-600 dark:text-gray-300">Mobile-friendly</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Prêt à commencer votre parcours fitness ?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Rejoignez FitTracker dès aujourd'hui et prenez le contrôle de votre forme physique
          </p>
          <Link href="/register">
            <Button size="lg">Créer mon compte gratuitement</Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <p>&copy; 2024 FitTracker. Application de suivi sportif personnel.</p>
          <p className="mt-2 text-sm">Développé avec ❤️ pour votre bien-être</p>
        </div>
      </footer>
    </div>
  )
}
