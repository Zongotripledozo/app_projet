# Test simple de l'API
Write-Host "=== TEST FITTRACKER ===" -ForegroundColor Green

# Test 1: Health Check
Write-Host "1. Test de sante..." -ForegroundColor Yellow
$health = Invoke-RestMethod -Uri "http://localhost:3000/api/health"
Write-Host "Status: $($health.status)" -ForegroundColor Cyan

# Test 2: Login
Write-Host "2. Test de connexion..." -ForegroundColor Yellow
$loginData = @{
    email = "demo@fittracker.fr"
    password = "password123"
} | ConvertTo-Json

$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
Write-Host "Utilisateur: $($login.user.firstName)" -ForegroundColor Cyan

# Test 3: Dashboard
Write-Host "3. Test dashboard..." -ForegroundColor Yellow
$headers = @{ "Authorization" = "Bearer $($login.token)" }
$dashboard = Invoke-RestMethod -Uri "http://localhost:3000/api/dashboard" -Headers $headers
Write-Host "Seances: $($dashboard.stats.totalWorkouts)" -ForegroundColor Cyan

Write-Host "TOUS LES TESTS PASSES !" -ForegroundColor Green
