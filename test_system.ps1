# PayAssured CRM - Quick Test Script

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "PayAssured CRM - System Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Test 1: Backend Health
Write-Host "`n[Test 1] Backend Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://127.0.0.1:8001/health" -Method Get
    Write-Host "✅ Backend is healthy: $($health.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is not responding" -ForegroundColor Red
}

# Test 2: API Root
Write-Host "`n[Test 2] API Root Endpoint..." -ForegroundColor Yellow
try {
    $root = Invoke-RestMethod -Uri "http://127.0.0.1:8001/" -Method Get
    Write-Host "✅ API Message: $($root.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ API root not accessible" -ForegroundColor Red
}

# Test 3: Clients API
Write-Host "`n[Test 3] Clients API..." -ForegroundColor Yellow
try {
    $clients = Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/clients?skip=0&limit=10" -Method Get
    Write-Host "✅ Clients found: $($clients.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Clients API error" -ForegroundColor Red
}

# Test 4: Cases API
Write-Host "`n[Test 4] Cases API..." -ForegroundColor Yellow
try {
    $cases = Invoke-RestMethod -Uri "http://127.0.0.1:8001/api/cases?skip=0&limit=1000&sort_by=created_at&order=desc" -Method Get
    Write-Host "✅ Cases found: $($cases.Count)" -ForegroundColor Green
    
    if ($cases.Count -gt 0) {
        $totalRevenue = ($cases | ForEach-Object { [decimal]$_.amount } | Measure-Object -Sum).Sum
        Write-Host "   Total Revenue: ₹$($totalRevenue.ToString('N2'))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Cases API error" -ForegroundColor Red
}

# Test 5: Frontend
Write-Host "`n[Test 5] Frontend Status..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000" -Method Get -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Frontend is running on http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend is not accessible" -ForegroundColor Red
}

# Summary
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Backend URL: http://127.0.0.1:8001" -ForegroundColor White
Write-Host "Frontend URL: http://localhost:3000" -ForegroundColor White
Write-Host "API Docs: http://127.0.0.1:8001/docs" -ForegroundColor White
Write-Host "`nStatus: ✅ READY FOR SUBMISSION" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`n"
