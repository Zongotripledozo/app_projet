# Script de récupération pour Windows
Write-Host "🔧 Correction des problèmes Windows pour FitTracker" -ForegroundColor Green

# Vérifier les permissions administrateur
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ Ce script doit être exécuté en tant qu'administrateur" -ForegroundColor Red
    Write-Host "Clic droit sur PowerShell → Exécuter en tant qu'administrateur" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Permissions administrateur détectées" -ForegroundColor Green

# Arrêter les processus qui pourraient bloquer
Write-Host "🛑 Arrêt des processus potentiellement bloquants..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*npm*"} | Stop-Process -Force -ErrorAction SilentlyContinue

# Nettoyer les dossiers
Write-Host "🧹 Nettoyage des dossiers..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "✅ node_modules supprimé" -ForegroundColor Green
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    Write-Host "✅ package-lock.json supprimé" -ForegroundColor Green
}

# Nettoyer le cache npm
Write-Host "🧹 Nettoyage du cache npm..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "✅ Cache npm nettoyé" -ForegroundColor Green

# Configuration npm pour Windows
Write-Host "⚙️ Configuration npm pour Windows..." -ForegroundColor Yellow
npm config set cache "$env:TEMP\npm-cache" --global
npm config set prefix "$env:TEMP\npm-prefix" --global
npm config set fund false --global
npm config set audit false --global
Write-Host "✅ Configuration npm mise à jour" -ForegroundColor Green

# Réinstallation
Write-Host "📦 Réinstallation des dépendances..." -ForegroundColor Yellow
npm install --no-optional --no-fund --no-audit

if ($LASTEXITCODE -eq 0) {
    Write-Host "🎉 Installation réussie !" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Vous pouvez maintenant lancer :" -ForegroundColor Cyan
    Write-Host "   npm run dev" -ForegroundColor White
} else {
    Write-Host "❌ Erreur lors de l'installation" -ForegroundColor Red
    Write-Host "Essayez avec Yarn :" -ForegroundColor Yellow
    Write-Host "   npm install -g yarn" -ForegroundColor White
    Write-Host "   yarn install" -ForegroundColor White
}
