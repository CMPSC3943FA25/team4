@echo off
cls
echo.
echo ================================
echo   STATE TRACKER - PORTABLE LAUNCHER
echo ================================
echo.

:: === STEP 1: Find script location ===
set "SCRIPT_DIR=%~dp0"
set "FRONTEND_DIR=%SCRIPT_DIR%statetracker-frontend"
set "BACKEND_DIR=%SCRIPT_DIR%statetracker"

:: === STEP 2: Validate folders exist ===
if not exist "%FRONTEND_DIR%" (
    echo [ERROR] Folder not found: %FRONTEND_DIR%
    echo Please keep 'statetracker-frontend' next to this .bat
    pause
    exit /b 1
)

if not exist "%BACKEND_DIR%" (
    echo [ERROR] Folder not found: %BACKEND_DIR%
    echo Please keep 'statetracker' next to this .bat
    pause
    exit /b 1
)

:: === STEP 3: Check Node.js ===
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Download from: https://nodejs.org
    pause
    exit /b 1
)

:: === STEP 4: Check Maven ===
where mvn >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Maven not found!
    echo Download from: https://maven.apache.org
    pause
    exit /b 1
)

:: === STEP 5: Build Frontend ===
echo [1/4] Installing frontend dependencies...
cd /d "%FRONTEND_DIR%"
call npm install

echo.
echo [2/4] Building frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

:: === STEP 6: Copy to Backend ===
echo.
echo [3/4] Copying build to backend...
xcopy /E /Y /Q "dist\*" "%BACKEND_DIR%\src\main\resources\static\" >nul
if %errorlevel% neq 0 (
    echo [ERROR] Copy failed!
    pause
    exit /b 1
)

:: === STEP 7: Run Backend ===
echo.
echo [4/4] Starting server on http://localhost:8080
echo Close this window to stop.
cd /d "%BACKEND_DIR%"
call mvn spring-boot:run

echo.
echo [DONE] Server stopped.
pause