# Brave RPG - Quick Start Script
# Pour PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Brave RPG - Demarrage du serveur" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demarrage du serveur HTTP sur le port 8000..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Une fois demarre, ouvrez votre navigateur et allez sur :" -ForegroundColor Green
Write-Host "http://127.0.0.1:8000/index.html" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "Appuyez sur Ctrl+C pour arreter le serveur" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

npx -y http-server -p 8000
