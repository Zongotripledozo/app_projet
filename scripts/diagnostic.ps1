# Script de diagnostic FitTracker
Write-Host "=== DIAGNOSTIC FITTRACKER ===" -ForegroundColor Green

# Test 1: Vérifier les services Docker
Write-Host "`n1. Verification des services Docker..." -ForegroundColor Yellow
try {
    $containers = docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    Write-Host $containers -ForegroundColor Cyan
} catch {
    Write-Host "Erreur Docker" -ForegroundColor Red
}

# Test 2: Health Check détaillé
Write-Host "`n2. Health Check detaille..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health"
    Write-Host "Status: $($health.status)" -ForegroundColor Cyan
    Write-Host "Database: $($health.database)" -ForegroundColor Cyan
    Write-Host "Environment: $($health.environment)" -ForegroundColor Cyan
    Write-Host "Timestamp: $($health.timestamp)" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur Health Check: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Test de connexion avec gestion d'erreur
Write-Host "`n3. Test de connexion avec details..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "demo@fittracker.fr"
        password = "password123"
    } | ConvertTo-Json
    
    Write-Host "Donnees envoyees: $loginData" -ForegroundColor Gray
    
    $login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    Write-Host "Connexion reussie!" -ForegroundColor Green
    Write-Host "Token: $($login.token.Substring(0, 20))..." -ForegroundColor Cyan
} catch {
    Write-Host "Erreur de connexion:" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Essayer de lire la réponse d'erreur
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Reponse serveur: $errorBody" -ForegroundColor Red
    } catch {
        Write-Host "Impossible de lire la reponse d'erreur" -ForegroundColor Red
    }
}

# Test 4: Vérifier la base de données directement
Write-Host "`n4. Test de la base de donnees..." -ForegroundColor Yellow
try {
    $dbTest = docker exec fittracker-db-dev psql -U fittracker_user -d fittracker_dev -t -c "SELECT COUNT(*) FROM users WHERE email = 'demo@fittracker.fr';"
    Write-Host "Utilisateur demo trouve: $($dbTest.Trim())" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur base de donnees: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== FIN DIAGNOSTIC ===" -ForegroundColor Green
