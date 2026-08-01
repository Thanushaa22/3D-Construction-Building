@echo off
title Apex Structures Server
cd /d "%~dp0"
echo Starting server... browser will open automatically.
echo Close this window to stop the server.
echo.
python serve.py
pause
