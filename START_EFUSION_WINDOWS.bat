@echo off
setlocal
cd /d "%~dp0"
echo ==========================================
echo           E-FUSION LOCAL STARTER
echo ==========================================

if not exist "fusion-backend\.env" (
  echo [ERROR] fusion-backend\.env is missing.
  echo Copy fusion-backend\.env.example to fusion-backend\.env
  echo Then add your real MongoDB URI and any required API keys.
  pause
  exit /b 1
)

findstr /i /c:"YOUR_CLUSTER" /c:"YOUR_USERNAME" /c:"YOUR_PASSWORD" "fusion-backend\.env" >nul
if not errorlevel 1 (
  echo [ERROR] Your .env still contains sample placeholders.
  echo Replace them with your actual MongoDB Atlas connection details.
  pause
  exit /b 1
)

echo [1/2] Installing backend packages if needed...
if not exist "fusion-backend\node_modules" (
  pushd fusion-backend
  call npm install
  if errorlevel 1 (popd & pause & exit /b 1)
  popd
)

echo [2/2] Installing frontend packages if needed...
if not exist "fusion-frontend\node_modules" (
  pushd fusion-frontend
  call npm install
  if errorlevel 1 (popd & pause & exit /b 1)
  popd
)

echo Starting backend in a new window...
start "E-FUSION Backend" cmd /k "cd /d ""%~dp0fusion-backend"" && npm run dev"

echo Starting frontend in a new window...
start "E-FUSION Frontend" cmd /k "cd /d ""%~dp0fusion-frontend"" && npm start"

echo.
echo Both terminal windows have been opened.
echo Keep both windows running while using E-FUSION.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001 (if configured by server)
pause
