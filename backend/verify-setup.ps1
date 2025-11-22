# FrontlineSafe Backend Setup Verification Script

Write-Host "=== FrontlineSafe Backend Setup Verification ===" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

# Check .env file
Write-Host "Checking .env file..." -ForegroundColor Yellow
if (Test-Path .env) {
    Write-Host "✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "❌ .env file not found. Creating from .env.example..." -ForegroundColor Yellow
    if (Test-Path .env.example) {
        Copy-Item .env.example .env
        Write-Host "✅ Created .env file" -ForegroundColor Green
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
    }
}

# Check node_modules
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (Test-Path node_modules) {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Dependencies not installed. Run: npm install" -ForegroundColor Yellow
}

# Check Prisma Client
Write-Host "Checking Prisma Client..." -ForegroundColor Yellow
if (Test-Path node_modules\.prisma) {
    Write-Host "✅ Prisma Client generated" -ForegroundColor Green
} else {
    Write-Host "⚠️  Prisma Client not generated. Run: npm run prisma:generate" -ForegroundColor Yellow
}

# Check PostgreSQL
Write-Host "Checking PostgreSQL connection..." -ForegroundColor Yellow
$pgConnected = $false
try {
    $pgTest = Test-NetConnection -ComputerName localhost -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($pgTest) {
        Write-Host "✅ PostgreSQL is running on port 5432" -ForegroundColor Green
        $pgConnected = $true
    } else {
        Write-Host "❌ PostgreSQL is not running on port 5432" -ForegroundColor Red
        Write-Host "   Install Docker and run: docker-compose up -d postgres" -ForegroundColor Yellow
        Write-Host "   OR install PostgreSQL locally" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Could not check PostgreSQL connection" -ForegroundColor Red
}

# Check Redis
Write-Host "Checking Redis connection..." -ForegroundColor Yellow
$redisConnected = $false
try {
    $redisTest = Test-NetConnection -ComputerName localhost -Port 6379 -InformationLevel Quiet -WarningAction SilentlyContinue -ErrorAction SilentlyContinue
    if ($redisTest) {
        Write-Host "✅ Redis is running on port 6379" -ForegroundColor Green
        $redisConnected = $true
    } else {
        Write-Host "❌ Redis is not running on port 6379" -ForegroundColor Red
        Write-Host "   Install Docker and run: docker-compose up -d redis" -ForegroundColor Yellow
        Write-Host "   OR install Redis locally" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Could not check Redis connection" -ForegroundColor Red
}

# Summary
Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
if ($pgConnected -and $redisConnected) {
    Write-Host "✅ All services are ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "  1. Run migrations: npm run prisma:migrate" -ForegroundColor White
    Write-Host "  2. Seed data: npm run prisma:seed" -ForegroundColor White
    Write-Host "  3. Start server: npm run start:dev" -ForegroundColor White
} else {
    Write-Host "⚠️  Database services need to be started" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "See SETUP_DATABASE.md for instructions" -ForegroundColor White
}

Write-Host ""

