@echo off
echo ========================================
echo   BRAVE RPG - Backend Server Launcher
echo ========================================
echo.

REM Vérifier si MongoDB est installé
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] MongoDB n'est pas installé ou pas dans le PATH
    echo.
    echo Vous avez deux options :
    echo 1. Installer MongoDB localement : https://www.mongodb.com/try/download/community
    echo 2. Utiliser MongoDB Atlas (cloud) - Voir DEPLOYMENT.md
    echo.
    pause
)

echo [1/3] Vérification de Node.js...
node --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js n'est pas installé !
    echo Télécharger : https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js détecté

echo.
echo [2/3] Installation des dépendances...
cd server-backend
if not exist node_modules (
    echo Installation en cours...
    call npm install
) else (
    echo [OK] Dépendances déjà installées
)

echo.
echo [3/3] Démarrage du serveur backend...
echo.
echo ========================================
echo   Backend API : http://localhost:3000
echo   Health Check : http://localhost:3000/health
echo ========================================
echo.
echo Appuyez sur Ctrl+C pour arrêter le serveur
echo.

call npm run dev

pause
