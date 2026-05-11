@echo off
echo ================================
echo   AssPlus - Demarrage Dev
echo ================================

echo [1/3] Demarrage PostgreSQL...
"C:\Program Files\PostgreSQL\16\bin\pg_ctl.exe" -D "C:\Users\Ihssan.FLAHY\postgresql\data" -l "C:\Users\Ihssan.FLAHY\postgresql\postgres.log" start
timeout /t 2 /nobreak >nul

echo [2/3] Verification de la connexion...
set PGPASSWORD=assplus_dev
"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U assplus -d assplus_db -c "SELECT 'OK' as status;" 2>nul
if %errorlevel% neq 0 (
  echo ERREUR: Impossible de se connecter a PostgreSQL
  pause
  exit /b 1
)

echo [3/3] Lancement de l'application...
npm run dev

pause
