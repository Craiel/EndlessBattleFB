@echo off

echo.
echo -----------------------
echo Building
echo.

"..\Build\Release\CrystalBuild.exe" -p buildConfigRelease.json -c
