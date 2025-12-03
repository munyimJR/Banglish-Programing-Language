@echo off
title Bangla Compiler
color 0B

cd backend

if not exist "compiler. exe" (
    echo Building compiler...
    bison -d parser.y
    flex scanner. l
    gcc -o compiler. exe parser.tab.c lex.yy.c
)

echo Starting backend... 
start "Backend" cmd /k "node server.js"

timeout /t 3 /nobreak >nul

echo Opening frontend...
cd ..\frontend
start index.html

cd .. 