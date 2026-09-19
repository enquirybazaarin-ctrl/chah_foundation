$ErrorActionPreference = "Continue"

Write-Host "Cleaning NPM Cache..."
npm cache clean --force

Write-Host "Removing existing modules..."
if (Test-Path package-lock.json) { Remove-Item package-lock.json -Force }
if (Test-Path node_modules) { Remove-Item node_modules -Recurse -Force }

Write-Host "Installing dependencies..."
npm install
npm install -D prisma

Write-Host "Checking versions..."
Write-Host "NPM Version:"
npm --version
Write-Host "Node Version:"
node --version
Write-Host "Prisma Version:"
npx prisma --version

Write-Host "Running Prisma Format..."
npx prisma format

Write-Host "Running Prisma Validate..."
npx prisma validate
