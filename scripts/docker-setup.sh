echo "🚀 Configuration de FitTracker avec Docker..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Arrêter les conteneurs existants
echo "🛑 Arrêt des conteneurs existants..."
docker-compose down -v

# Construire les images
echo "🔨 Construction des images Docker..."
docker-compose build --no-cache

# Démarrer les services
echo "🚀 Démarrage des services..."
docker-compose up -d

# Attendre que la base de données soit prête
echo "⏳ Attente de la base de données..."
sleep 15

# Vérifier le statut
echo "📊 Vérification du statut des services..."
docker-compose ps

echo ""
echo "✅ FitTracker est maintenant disponible !"
echo "🌐 Application: http://localhost:3000"
echo "🗄️  pgAdmin: http://localhost:8080 (optionnel)"
echo ""
echo "📋 Comptes de test:"
echo "   👤 Utilisateur: demo@fittracker.com / password123"
echo "   👑 Admin: admin@fittracker.com / password123"
echo ""
echo "🔧 Commandes utiles:"
echo "   docker-compose logs -f    # Voir les logs"
echo "   docker-compose restart    # Redémarrer"
echo "   docker-compose down       # Arrêter"
