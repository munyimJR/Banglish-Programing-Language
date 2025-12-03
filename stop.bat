@echo off
title Bangla Compiler - Stop
color 0C

echo ========================================
echo  Stopping Bangla Compiler
echo ========================================
echo. 

echo Killing Node.js processes...
taskkill /f /im node.exe >nul 2>&1

echo Done! 
timeout /t 2 /nobreak >nul