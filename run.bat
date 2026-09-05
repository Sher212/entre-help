@echo off
title Entre Help - One Click Launcher
color 0A

echo ================================================================
echo               Entre Help Platform
echo      AI Entrepreneurship & Scheme Matching System
echo ================================================================
echo.

set "ROOT_DIR=%~dp0"
cd /d "%ROOT_DIR%"

echo [1/4] Checking Backend Environment...
if not exist "backend\.venv\Scripts\uvicorn.exe" (
    if not exist "backend\.venv\Scripts\activate.bat" (
        echo [*] Creating Python virtual environment in backend\.venv ...
        python -m venv backend\.venv
    )
    echo [*] Installing backend Python dependencies...
    call backend\.venv\Scripts\activate.bat
    pip install -r backend\requirements.txt
)

echo [2/4] Checking Frontend Dependencies...
if not exist "frontend\node_modules" (
    echo [*] Installing frontend npm packages...
    cd /d "%ROOT_DIR%frontend"
    call npm install
    cd /d "%ROOT_DIR%"
)

echo [3/4] Starting FastAPI Backend Server on 0.0.0.0:8001 (LAN Accessible)...
start "Entre Help - Backend Server (Port 8001)" cmd /k "cd /d %ROOT_DIR%backend && call .venv\Scripts\activate.bat && uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload"

echo [4/4] Starting React + Vite Frontend on 0.0.0.0:5180 (LAN Accessible)...
start "Entre Help - Frontend (Port 5180)" cmd /k "cd /d %ROOT_DIR%frontend && npm run dev -- --host 0.0.0.0 --port 5180"

echo.
echo ================================================================
echo      Entre Help is now running successfully!
echo.
echo      - Web Application:  http://127.0.0.1:5180
echo      - Backend API Docs: http://127.0.0.1:8001/docs
echo.
echo      Opening browser in 3 seconds...
echo ================================================================

timeout /t 3 /nobreak >nul 2>&1
start http://127.0.0.1:5180

echo.
echo Press any key to exit this launcher window (servers will continue running in background).
pause >nul 2>&1
