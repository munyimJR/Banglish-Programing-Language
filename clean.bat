@echo off
title Bangla Compiler - Clean
color 0E

echo ========================================
echo  Cleaning Build Files
echo ========================================
echo. 

cd backend

echo Cleaning compiler files...
del /q *.exe *.c *.h output. asm 2>nul

echo Cleaning temp files...
if exist "temp" rmdir /s /q temp
mkdir temp

cd ..

echo Done!
pause