@echo off
cd /d "%~dp0"
powershell -ExecutionPolicy Bypass -File ".\run-backend.ps1" -Port 8090
