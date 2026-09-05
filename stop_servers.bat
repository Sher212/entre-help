@echo off
title Entre Help - Stop Servers
color 0C

echo ================================================================
echo          Stopping Entre Help Backend & Frontend
echo ================================================================
echo.

echo [*] Terminating Node/Vite processes (Port 5180, 5173)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5180') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /F /PID %%a 2>nul
)

echo [*] Terminating Uvicorn/Python backend processes (Port 8001, 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8001') do (
    taskkill /F /PID %%a 2>nul
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo [OK] All Entre Help servers stopped successfully!
echo.
pause
