#!/bin/bash

# Build script for GitHub Pages that temporarily moves API routes
set -e

echo "Building for GitHub Pages..."

# Detect OS for sed compatibility
if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_INPLACE="sed -i ''"
else
  SED_INPLACE="sed -i"
fi

# Create backup directory
mkdir -p .build-temp

# Check if API directory exists and move it
if [ -d "app/api" ]; then
  echo "Temporarily moving API routes..."
  mv app/api .build-temp/
fi

# Run the build
GITHUB_PAGES=true npm run build

# Create proper directory structure for GitHub Pages
echo "Creating GitHub Pages directory structure..."
if [ -d "out" ]; then
  # Create a temporary directory for reorganization
  mkdir -p .build-temp/github-pages/splash-screen-app
  
  # Move all files to the splash-screen-app subdirectory
  cp -r out/* .build-temp/github-pages/splash-screen-app/
  
  # Remove the old out directory and replace it
  rm -rf out
  mv .build-temp/github-pages out
fi

# Fix relative paths in manifest.json for GitHub Pages
echo "Fixing asset paths for GitHub Pages..."
if [ -f "out/splash-screen-app/manifest.json" ]; then
  $SED_INPLACE 's|"\.\/|"/splash-screen-app/|g' out/splash-screen-app/manifest.json
  $SED_INPLACE 's|"start_url": "/"|"start_url": "/splash-screen-app/"|g' out/splash-screen-app/manifest.json
  $SED_INPLACE 's|"scope": "/"|"scope": "/splash-screen-app/"|g' out/splash-screen-app/manifest.json
fi

# Fix paths in HTML files
if [ -f "out/splash-screen-app/index.html" ]; then
  $SED_INPLACE 's|href="/manifest\.json"|href="/splash-screen-app/manifest.json"|g' out/splash-screen-app/index.html
  $SED_INPLACE 's|href="/favicon\.ico"|href="/splash-screen-app/favicon.ico"|g' out/splash-screen-app/index.html
  $SED_INPLACE 's|href="/icon-|href="/splash-screen-app/icon-|g' out/splash-screen-app/index.html
fi

if [ -f "out/splash-screen-app/settings/index.html" ]; then
  $SED_INPLACE 's|href="/manifest\.json"|href="/splash-screen-app/manifest.json"|g' out/splash-screen-app/settings/index.html
  $SED_INPLACE 's|href="/favicon\.ico"|href="/splash-screen-app/favicon.ico"|g' out/splash-screen-app/settings/index.html
  $SED_INPLACE 's|href="/icon-|href="/splash-screen-app/icon-|g' out/splash-screen-app/settings/index.html
fi

if [ -f "out/splash-screen-app/404.html" ]; then
  $SED_INPLACE 's|href="/manifest\.json"|href="/splash-screen-app/manifest.json"|g' out/splash-screen-app/404.html
  $SED_INPLACE 's|href="/favicon\.ico"|href="/splash-screen-app/favicon.ico"|g' out/splash-screen-app/404.html
  $SED_INPLACE 's|href="/icon-|href="/splash-screen-app/icon-|g' out/splash-screen-app/404.html
fi

# Fix paths in service worker
if [ -f "out/splash-screen-app/sw.js" ]; then
  # Fix relative paths but keep the root paths for pages
  $SED_INPLACE "s|'\\./icon-|'/splash-screen-app/icon-|g" out/splash-screen-app/sw.js
  $SED_INPLACE "s|'\\./manifest\\.json'|'/splash-screen-app/manifest.json'|g" out/splash-screen-app/sw.js
  $SED_INPLACE "s|'\\./favicon\\.ico'|'/splash-screen-app/favicon.ico'|g" out/splash-screen-app/sw.js
  $SED_INPLACE "s|'\\./music/|'/splash-screen-app/music/|g" out/splash-screen-app/sw.js
  $SED_INPLACE "s|'\\./background/|'/splash-screen-app/background/|g" out/splash-screen-app/sw.js
  # Update root paths for pages to include basePath
  $SED_INPLACE "s|'/',|'/splash-screen-app/',|g" out/splash-screen-app/sw.js
  $SED_INPLACE "s|'/settings'|'/splash-screen-app/settings'|g" out/splash-screen-app/sw.js
fi

# Restore API routes
if [ -d ".build-temp/api" ]; then
  echo "Restoring API routes..."
  mv .build-temp/api app/
fi

# Clean up
rm -rf .build-temp

echo "GitHub Pages build completed successfully!"
echo "Files are ready in out/splash-screen-app/"
