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
NODE_ENV=production GITHUB_PAGES=true npm run build

# Next.js already handles the basePath, so files are in the right place
echo "Build completed. Files are in out/ directory."

# Create .nojekyll file to prevent GitHub Pages from ignoring files starting with underscore
touch out/.nojekyll

# Fix relative paths in manifest.json for GitHub Pages (if needed)
echo "Fixing asset paths for GitHub Pages..."
if [ -f "out/manifest.json" ]; then
  $SED_INPLACE 's|"\.\/|"/splash-screen-app/|g' out/manifest.json
  $SED_INPLACE 's|"start_url": "/splash-screen-app/"|"start_url": "/splash-screen-app/"|g' out/manifest.json
  $SED_INPLACE 's|"scope": "/splash-screen-app/"|"scope": "/splash-screen-app/"|g' out/manifest.json
fi

# Fix paths in service worker if needed
if [ -f "out/sw.js" ]; then
  # Ensure all paths use the basePath correctly
  $SED_INPLACE "s|'\\./icon-|'/splash-screen-app/icon-|g" out/sw.js
  $SED_INPLACE "s|'\\./manifest\\.json'|'/splash-screen-app/manifest.json'|g" out/sw.js
  $SED_INPLACE "s|'\\./favicon\\.ico'|'/splash-screen-app/favicon.ico'|g" out/sw.js
  $SED_INPLACE "s|'\\./music/|'/splash-screen-app/music/|g" out/sw.js
  $SED_INPLACE "s|'\\./background/|'/splash-screen-app/background/|g" out/sw.js
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
