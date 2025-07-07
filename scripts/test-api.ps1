# Script de test de l'API FitTracker
Write-Host "Test de l'API FitTracker" -ForegroundColor Green

# Test 1: Health Check
Write-Host "`n1. Test de sante de l'application..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET
    Write-Host "Application en ligne" -ForegroundColor Green
    Write-Host "Status: $($healthResponse.status)" -ForegroundColor Cyan
    Write-Host "Database: $($healthResponse.database)" -ForegroundColor Cyan
    Write-Host "Environment: $($healthResponse.environment)" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur de connexion a l'application" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Test 2: Connexion utilisateur
Write-Host "`n2. Test de connexion utilisateur..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "demo@fittracker.fr"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Connexion reussie" -ForegroundColor Green
    Write-Host "Token recu: $($loginResponse.token.Substring(0, 20))..." -ForegroundColor Cyan
    Write-Host "Utilisateur: $($loginResponse.user.firstName) $($loginResponse.user.lastName)" -ForegroundColor Cyan
    
    $token = $loginResponse.token
} catch {
    Write-Host "Erreur de connexion" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Test 3: Dashboard
Write-Host "`n3. Test du dashboard..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }

    $dashboardResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Method GET -Headers $headers
    Write-Host "Dashboard accessible" -ForegroundColor Green
    Write-Host "Seances totales: $($dashboardResponse.stats.totalWorkouts)" -ForegroundColor Cyan
    Write-Host "Calories totales: $($dashboardResponse.stats.totalCalories)" -ForegroundColor Cyan
    Write-Host "Objectifs actifs: $($dashboardResponse.goals.Count)" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur d'acces au dashboard" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# Test 4: Création d'une séance
Write-Host "`n4. Test de creation de seance..." -ForegroundColor Yellow
try {
    $workoutBody = @{
        type = "running"
        duration = "25"
        intensity = "moderate"
        calories = ""
        notes = "Test depuis PowerShell"
        date = (Get-Date).ToString("yyyy-MM-dd")
    } | ConvertTo-Json

    $workoutResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/workouts" -Method POST -Body $workoutBody -ContentType "application/json" -Headers $headers
    Write-Host "Seance creee avec succes" -ForegroundColor Green
    Write-Host "ID: $($workoutResponse.workout.id)" -ForegroundColor Cyan
    Write-Host "Type: $($workoutResponse.workout.type)" -ForegroundColor Cyan
    Write-Host "Calories estimees: $($workoutResponse.workout.calories)" -ForegroundColor Cyan
} catch {
    Write-Host "Erreur de creation de seance" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nTests termines !" -ForegroundColor Green
Write-Host "`nAcces a l'application :" -ForegroundColor Yellow
Write-Host "   App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "   pgAdmin: http://localhost:8081" -ForegroundColor Cyan
Write-Host "   Compte demo: demo@fittracker.fr / password123" -ForegroundColor Cyan
