Write-Host "🚀 Configuration de FitTracker avec Docker..." -ForegroundColor Green

# Vérifier que Docker est installé
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Arrêter les conteneurs existants
Write-Host "🛑 Arrêt des conteneurs existants..." -ForegroundColor Yellow
docker-compose down -v

# Construire les images
Write-Host "🔨 Construction des images Docker..." -ForegroundColor Yellow
docker-compose build --no-cache

# Démarrer les services
Write-Host "🚀 Démarrage des services..." -ForegroundColor Yellow
docker-compose up -d

# Attendre que la base de données soit prête
Write-Host "⏳ Attente de la base de données..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Vérifier le statut
Write-Host "📊 Vérification du statut des services..." -ForegroundColor Yellow
docker-compose ps

Write-Host ""
Write-Host "✅ FitTracker est maintenant disponible !" -ForegroundColor Green
Write-Host "🌐 Application: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🗄️  pgAdmin: http://localhost:8080 (optionnel)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Comptes de test:" -ForegroundColor Yellow
Write-Host "   👤 Utilisateur: demo@fittracker.com / password123" -ForegroundColor White
Write-Host "   👑 Admin: admin@fittracker.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Yellow
Write-Host "   docker-compose logs -f    # Voir les logs" -ForegroundColor White
Write-Host "   docker-compose restart    # Redémarrer" -ForegroundColor White
Write-Host "   docker-compose down       # Arrêter" -ForegroundColor White
