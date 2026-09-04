@echo off
REM ============================================================
REM  SmartAgri AI - Google Cloud Run Deployment Script
REM  Deploys both backend and frontend to Cloud Run
REM ============================================================

setlocal enabledelayedexpansion

REM ---- Configuration ----
set PROJECT_ID=
set REGION=asia-south1

REM Prompt for project ID if not set
if "%PROJECT_ID%"=="" (
    echo.
    echo ============================================
    echo  SmartAgri AI - Cloud Run Deployment
    echo ============================================
    echo.
    set /p PROJECT_ID="Enter your Google Cloud Project ID: "
)

echo.
echo [1/6] Setting Google Cloud project to: %PROJECT_ID%
call gcloud config set project %PROJECT_ID%

echo.
echo [2/6] Enabling required APIs...
call gcloud services enable run.googleapis.com
call gcloud services enable cloudbuild.googleapis.com
call gcloud services enable artifactregistry.googleapis.com

echo.
echo [3/6] Building and deploying BACKEND to Cloud Run...
echo      (This will take 5-10 minutes for the first build)
cd backend
call gcloud run deploy smartagri-backend ^
    --source . ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 2Gi ^
    --cpu 2 ^
    --timeout 300 ^
    --min-instances 0 ^
    --max-instances 3 ^
    --port 8080
cd ..

echo.
echo [4/6] Getting backend URL...
for /f "delims=" %%i in ('gcloud run services describe smartagri-backend --region %REGION% --format "value(status.url)" 2^>nul') do set BACKEND_URL=%%i
echo      Backend URL: %BACKEND_URL%

if "%BACKEND_URL%"=="" (
    echo ERROR: Could not get backend URL. Check if deployment succeeded.
    exit /b 1
)

echo.
echo [5/6] Building and deploying FRONTEND to Cloud Run...
echo      (Frontend will call backend at: %BACKEND_URL%/api)
cd frontend
call gcloud run deploy smartagri-frontend ^
    --source . ^
    --region %REGION% ^
    --platform managed ^
    --allow-unauthenticated ^
    --memory 256Mi ^
    --cpu 1 ^
    --timeout 60 ^
    --min-instances 0 ^
    --max-instances 3 ^
    --port 8080 ^
    --set-build-env-vars "VITE_API_URL=%BACKEND_URL%/api"
cd ..

echo.
echo [6/6] Getting frontend URL...
for /f "delims=" %%i in ('gcloud run services describe smartagri-frontend --region %REGION% --format "value(status.url)" 2^>nul') do set FRONTEND_URL=%%i

echo.
echo ============================================================
echo  DEPLOYMENT COMPLETE!
echo ============================================================
echo.
echo  Frontend (your app):  %FRONTEND_URL%
echo  Backend  (API):       %BACKEND_URL%
echo.
echo  Share the Frontend URL with anyone to use SmartAgri AI!
echo ============================================================

endlocal
