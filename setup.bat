@echo off
title Bangla Compiler - Setup
color 0B

echo ╔════════════════════════════════════════╗
echo ║   BANGLA COMPILER - INITIAL SETUP     ║
echo ╚════════════════════════════════════════╝
echo.

echo [1/5] Checking prerequisites...
echo. 

where flex >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    where win_flex >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Flex not found! 
        echo Download: https://github.com/lexxmark/winflexbison
        pause
        exit /b 1
    )
)
echo [OK] Flex found

where bison >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    where win_bison >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Bison not found! 
        pause
        exit /b 1
    )
)
echo [OK] Bison found

where gcc >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] GCC not found! 
    echo Download: MinGW or TDM-GCC
    pause
    exit /b 1
)
echo [OK] GCC found

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    pause
    exit /b 1
)
echo [OK] Node. js found

echo.
echo [2/5] Creating directories...
if not exist "backend" mkdir backend
if not exist "frontend" mkdir frontend
if not exist "backend\temp" mkdir backend\temp
echo [OK] Directories created

echo. 
echo [3/5] Building compiler...
cd backend

echo Running Bison...
bison -d parser.y
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Bison failed!
    cd ..
    pause
    exit /b 1
)

echo Running Flex...
flex scanner.l
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Flex failed!
    cd ..
    pause
    exit /b 1
)

echo Compiling... 
gcc -o compiler.exe parser.tab.c lex.yy.c
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] GCC failed!
    echo. 
    echo Checking generated files:
    if exist parser.tab.c (echo   [OK] parser.tab.c) else (echo   [MISSING] parser.tab.c)
    if exist lex.yy.c (echo   [OK] lex.yy.c) else (echo   [MISSING] lex.yy.c)
    cd ..
    pause
    exit /b 1
)
echo [OK] Compiler built successfully

echo.
echo [4/5] Installing Node packages...
if exist "package.json" (
    if not exist "node_modules" (
        echo No dependencies needed - using built-in modules
    )
)
cd .. 

echo.
echo [5/5] Verifying installation...
if exist "backend\compiler.exe" (
    echo [OK] Compiler: backend\compiler.exe
) else (
    echo [ERROR] Compiler not found!
)

if exist "backend\server.js" (
    echo [OK] Backend: backend\server.js
) else (
    echo [ERROR] server.js not found!
)

if exist "frontend\index.html" (
    echo [OK] Frontend: frontend\index.html
) else (
    echo [ERROR] index.html not found!
)

echo. 
echo ╔════════════════════════════════════════╗
echo ║        SETUP COMPLETE!                  ║
echo ║                                        ║
echo ║  Next: Run start.bat                   ║
echo ╚════════════════════════════════════════╝
pause