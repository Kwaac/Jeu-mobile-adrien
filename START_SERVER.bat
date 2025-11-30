@echo off
echo ========================================
echo   Brave RPG - Demarrage du serveur
echo ========================================
echo.
echo Demarrage du serveur HTTP sur le port 8000...
echo.
echo Une fois demarre, ouvrez votre navigateur et allez sur :
echo http://127.0.0.1:8000/index.html
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo ========================================
echo.

powershell -ExecutionPolicy Bypass -Command "npx -y http-server -p 8000"

pause
