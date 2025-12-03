@echo off
title Bangla Compiler - Start
color 0B

echo ╔════════════════════════════════════════╗
echo ║      BANGLA COMPILER - STARTING       ║
echo ╚════════════════════════════════════════╝
echo.

cd backend

if not exist "compiler.exe" (
    echo [WARNING] Compiler not found.  Building...
    bison -d parser.y
    flex scanner.l
    gcc -o compiler.exe parser.tab.c lex.yy.c
    if not exist "compiler.exe" (
        echo [ERROR] Compiler build failed! 
        cd ..
        pause
        exit /b 1
    )
    echo [OK] Compiler built successfully
)

echo [1/2] Starting backend server...
start "Bangla Compiler Backend" cmd /k "title Backend Server && color 0A && node server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Opening frontend... 
cd .. 
cd frontend
start index.html

cd .. 

echo.
echo ╔════════════════════════════════════════╗
echo ║           STARTED!                      ║
echo ║                                        ║
echo ║  Backend: http://localhost:5000        ║
echo ║  Frontend: Opened in browser           ║
echo ╚════════════════════════════════════════╝
pause