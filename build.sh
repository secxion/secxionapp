#!/bin/bash

set -e  # Exit on error

echo "🔄 Installing dependencies for frontend..."
cd frontend || exit 1
npm install || { echo "❌ Frontend install failed"; exit 1; }

echo "🏗️ Building frontend..."
npm run build || { echo "❌ Frontend build failed"; exit 1; }

cd .. || exit 1

echo "🔄 Installing root/backend dependencies..."
npm install || { echo "❌ Backend install failed"; exit 1; }

echo "✅ Build complete. Ready for deployment!"
