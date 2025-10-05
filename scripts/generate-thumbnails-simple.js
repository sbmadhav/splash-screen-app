#!/usr/bin/env node

/**
 * Simple script to generate WebP thumbnails using Sharp
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'public', 'background');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'background', 'thumbnails');
const THUMBNAIL_WIDTH = 200;
const THUMBNAIL_HEIGHT = 112; // 16:9 aspect ratio
const WEBP_QUALITY = 75;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function generateThumbnails() {
  console.log('🖼️  Generating optimized WebP thumbnails...\n');

  // Get all image files
  const imageFiles = fs.readdirSync(INPUT_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .sort();

  if (imageFiles.length === 0) {
    console.log('❌ No image files found in the background directory.');
    return;
  }

  console.log(`📁 Found ${imageFiles.length} image files to process\n`);

  let successCount = 0;
  let totalOriginalSize = 0;
  let totalThumbnailSize = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const outputFileName = file.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    try {
      console.log(`🔄 Processing: ${file}`);

      // Get original file size
      const originalSize = fs.statSync(inputPath).size;
      
      // Generate thumbnail
      await sharp(inputPath)
        .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: WEBP_QUALITY })
        .toFile(outputPath);

      // Get thumbnail size
      const thumbnailSize = fs.statSync(outputPath).size;
      
      const originalSizeKB = Math.round(originalSize / 1024);
      const thumbnailSizeKB = Math.round(thumbnailSize / 1024);
      const savings = Math.round(((originalSize - thumbnailSize) / originalSize) * 100);

      console.log(`   ✅ ${outputFileName} (${originalSizeKB}KB → ${thumbnailSizeKB}KB, ${savings}% smaller)`);
      
      totalOriginalSize += originalSize;
      totalThumbnailSize += thumbnailSize;
      successCount++;

    } catch (error) {
      console.log(`   ❌ Failed to process ${file}:`, error.message);
    }
  }

  // Summary
  const totalOriginalMB = Math.round(totalOriginalSize / (1024 * 1024));
  const totalThumbnailMB = Math.round(totalThumbnailSize / (1024 * 1024));
  const totalSavings = Math.round(((totalOriginalSize - totalThumbnailSize) / totalOriginalSize) * 100);

  console.log('\n🎉 Thumbnail generation complete!');
  console.log(`   ✅ Successfully processed: ${successCount}/${imageFiles.length} files`);
  console.log(`   📊 Total size reduction: ${totalOriginalMB}MB → ${totalThumbnailMB}MB (${totalSavings}% smaller)`);

  // Generate manifest
  const manifest = {
    generated: new Date().toISOString(),
    config: {
      width: THUMBNAIL_WIDTH,
      height: THUMBNAIL_HEIGHT,
      quality: WEBP_QUALITY,
      format: 'webp'
    },
    thumbnails: imageFiles.map(file => ({
      original: file,
      thumbnail: file.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    }))
  };

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`📋 Manifest created: thumbnails/manifest.json\n`);

  console.log('💡 The offline image selector will now use these optimized thumbnails!');
}

generateThumbnails().catch(console.error);
