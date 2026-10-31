@echo off
title Warm Heart Cafe and Bakery - 1-Click Launcher
color 0E
chcp 65001 >nul

echo ===========================================================================
echo            WARM HEART CAFE AND BAKERY - 1-CLICK LAUNCHER
echo     Freshly Brewed Specialty Coffee ^& Handcrafted Bakery Delights
echo ===========================================================================
echo.
echo [1] Open Directly in Browser (index.html)
echo [2] Start Fast Local HTTP Server (Port 3000) ^& Open Browser
echo [3] Run with Vite Dev Server (npm run dev)
echo.

set /p choice="Enter your choice (1, 2, or 3, default is 1): "
if "%choice%"=="" set choice=1

if "%choice%"=="1" (
    echo [INFO] Opening Warm Heart Cafe and Bakery in default browser...
    start "" index.html
    exit /b 0
)

if "%choice%"=="2" (
    python --version >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        echo [OK] Python detected! Starting local server on http://localhost:3000/ ...
        start "" http://localhost:3000/
        python -m http.server 3000
    ) else (
        echo [INFO] Python not found. Opening index.html directly...
        start "" index.html
    )
    exit /b 0
)

if "%choice%"=="3" (
    where npm >nul 2>&1
    if %ERRORLEVEL% equ 0 (
        if not exist "node_modules" (
            echo [INFO] Installing npm dependencies...
            npm install
        )
        echo [OK] Starting Vite Dev Server...
        npm run dev
    ) else (
        echo [ERROR] Node.js/npm is not installed. Opening index.html directly...
        start "" index.html
    )
    exit /b 0
)

start "" index.html
