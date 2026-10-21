#!/bin/bash
set -e

export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
echo "🚀 Starting Deployment on Hostinger..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

if [ -d "chah_foundation" ]; then
  cd chah_foundation
  git reset --hard HEAD
  git clean -fd
  git pull origin main
else
  git clone https://github.com/enquirybazaarin-ctrl/chah_foundation.git chah_foundation
  cd chah_foundation
fi

# Deploy Backend
echo "📦 Deploying Backend..."
cd backend

# Preserve persistent uploads outside repo to prevent image loss on git pull
mkdir -p ../../persistent_uploads
if [ ! -L "uploads" ] && [ -d "uploads" ]; then
  cp -rn uploads/* ../../persistent_uploads/ 2>/dev/null || true
  rm -rf uploads
fi
ln -sfn ../../persistent_uploads uploads

npm install --production=false
npx prisma generate
npx prisma migrate deploy 2>/dev/null || true
npm run build
cd ..

# Deploy Website
echo "📦 Deploying Website..."
cd website
npm install
npm run build
cd ..

# Deploy Admin
echo "📦 Deploying Admin..."
cd admin
npm install
npm run build
cd ..

# Sync built files to live subdomain directories
echo "🔄 Syncing built applications to live domain directories..."

# 1. Sync Website to new.chahfoundation.com
for WEB_DIR in "$HOME/domains/new.chahfoundation.com/public_html" "$HOME/domains/new.chahfoundation.com/nodejs" "$HOME/domains/new.chahfoundation.com"; do
  if [ -d "$WEB_DIR" ]; then
    echo "Syncing website to $WEB_DIR..."
    cp -ru website/.next website/public website/server.js website/package.json "$WEB_DIR/" 2>/dev/null || true
    mkdir -p "$WEB_DIR/tmp" && touch "$WEB_DIR/tmp/restart.txt"
    break
  fi
done

# 2. Sync Admin to admin.chahfoundation.com
for ADM_DIR in "$HOME/domains/admin.chahfoundation.com/public_html" "$HOME/domains/admin.chahfoundation.com/nodejs" "$HOME/domains/admin.chahfoundation.com"; do
  if [ -d "$ADM_DIR" ]; then
    echo "Syncing admin to $ADM_DIR..."
    cp -ru admin/.next admin/public admin/server.js admin/package.json "$ADM_DIR/" 2>/dev/null || true
    mkdir -p "$ADM_DIR/tmp" && touch "$ADM_DIR/tmp/restart.txt"
    break
  fi
done

# 3. Sync Backend to api.chahfoundation.com
for API_DIR in "$HOME/domains/api.chahfoundation.com/public_html" "$HOME/domains/api.chahfoundation.com/nodejs" "$HOME/domains/api.chahfoundation.com"; do
  if [ -d "$API_DIR" ]; then
    echo "Syncing backend to $API_DIR..."
    cp -ru backend/dist backend/server.js backend/package.json "$API_DIR/" 2>/dev/null || true
    mkdir -p "$API_DIR/tmp" && touch "$API_DIR/tmp/restart.txt"
    break
  fi
done

# Restart Services (PM2 if available)
echo "🔄 Restarting Node Services..."
if command -v pm2 &> /dev/null; then
  pm2 restart all || pm2 start ecosystem.config.js 2>/dev/null || true
fi
echo "✅ Deployment Finished Successfully!"
