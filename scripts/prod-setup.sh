echo "🚀 Configuration de l'environnement de production FitTracker"

# Vérifier Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Prérequis vérifiés"

# Créer le fichier .env.production s'il n'existe pas
if [ ! -f .env.production ]; then
    echo "📝 Création du fichier .env.production..."
    cat > .env.production << EOF
DATABASE_URL="postgresql://fittracker_user:fittracker_password@postgres:5432/fittracker"
JWT_SECRET="a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345678901234567890abcdef"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="production"
EOF
fi

# Build et lancer les services
echo "🐳 Build et démarrage des services de production..."
docker-compose up --build -d

# Attendre que les services soient prêts
echo "⏳ Attente du démarrage des services..."
sleep 15

# Vérifier la santé des services
echo "🔍 Vérification des services..."
docker-compose ps

# Test de santé de l'application
echo "🏥 Test de santé de l'application..."
sleep 5
curl -f http://localhost:3000/api/health || echo "⚠️  L'application met du temps à démarrer, veuillez patienter..."

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📋 Informations utiles :"
echo "   • Application: http://localhost:3000"
echo "   • pgAdmin: http://localhost:8080 (admin@fittracker.fr / admin123)"
echo "   • API Health: http://localhost:3000/api/health"
echo ""
echo "🔑 Compte de démonstration :"
echo "   • Email: demo@fittracker.fr"
echo "   • Mot de passe: password123"
echo ""
