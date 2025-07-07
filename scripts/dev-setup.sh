echo "🚀 Configuration de l'environnement de développement FitTracker"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f .env.local ]; then
    echo "📝 Création du fichier .env.local..."
    cp .env.local.example .env.local 2>/dev/null || cat > .env.local << EOF
DATABASE_URL="postgresql://fittracker_user:fittracker_password@localhost:5433/fittracker_dev"
JWT_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345678901234567890abcdef"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
EOF
fi

# Lancer les services Docker
echo "🐳 Démarrage des services Docker..."
docker-compose -f docker-compose.dev.yml up -d

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente du démarrage de PostgreSQL..."
sleep 10

# Vérifier la santé des services
echo "🔍 Vérification des services..."
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "🎉 Configuration terminée !"
echo ""
echo "📋 Informations utiles :"
echo "   • Application: http://localhost:3000"
echo "   • pgAdmin: http://localhost:8081 (dev@fittracker.fr / dev123)"
echo "   • Base de données: localhost:5433"
echo ""
echo "🔑 Compte de démonstration :"
echo "   • Email: demo@fittracker.fr"
echo "   • Mot de passe: password123"
echo ""
echo "🚀 Pour démarrer le développement :"
echo "   npm run dev"
echo ""
