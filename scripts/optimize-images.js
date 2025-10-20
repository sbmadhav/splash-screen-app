#!/usr/bin/env node

/**
 * Optimized image generation script
 * Generates multiple sizes and formats for optimal loading
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'public', 'background');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'background', 'optimized');

// Image sizes to generate (using near-lossless quality)
const SIZES = [
  { name: 'thumbnail', width: 200, height: 112, quality: 80, lossless: false },  // 16:9 tiny blur placeholder
  { name: 'small', width: 640, height: 360, quality: 95, lossless: false },      // Mobile
  { name: 'medium', width: 1280, height: 720, quality: 98, lossless: false },    // Tablet/Small desktop
  { name: 'large', width: 1920, height: 1080, quality: 100, lossless: true },    // Desktop - lossless
  { name: 'xlarge', width: 2560, height: 1440, quality: 100, lossless: true },   // 2K displays - lossless
];

// Ensure output directories exist
function ensureDirectories() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  SIZES.forEach(size => {
    const sizeDir = path.join(OUTPUT_DIR, size.name);
    if (!fs.existsSync(sizeDir)) {
      fs.mkdirSync(sizeDir, { recursive: true });
    }
  });
}

async function optimizeImages() {
  console.log('🎨 Starting image optimization...\n');
  ensureDirectories();

  // Get all image files
  const imageFiles = fs.readdirSync(INPUT_DIR)
    .filter(file => /\.(jpg|jpeg|png)$/i.test(file))
    .sort();

  if (imageFiles.length === 0) {
    console.log('❌ No image files found in the background directory.');
    return;
  }

  console.log(`📁 Found ${imageFiles.length} images to optimize\n`);

  const stats = {
    total: imageFiles.length,
    processed: 0,
    failed: 0,
    originalSize: 0,
    optimizedSize: 0,
  };

  for (const file of imageFiles) {
    const inputPath = path.join(INPUT_DIR, file);
    const baseName = file.replace(/\.(jpg|jpeg|png)$/i, '');

    try {
      console.log(`🔄 Processing: ${file}`);

      // Get original file size
      const originalStats = fs.statSync(inputPath);
      stats.originalSize += originalStats.size;

      // Generate each size
      for (const size of SIZES) {
        const outputFileName = `${baseName}.webp`;
        const outputPath = path.join(OUTPUT_DIR, size.name, outputFileName);

        await sharp(inputPath)
          .resize(size.width, size.height, {
            fit: 'cover',
            position: 'center',
            kernel: sharp.kernel.lanczos3, // Best quality scaling
          })
          .webp({
            quality: size.quality,
            lossless: size.lossless, // Use lossless for large/xlarge
            nearLossless: !size.lossless, // Near-lossless for others
            effort: 6, // Higher effort = better compression
            smartSubsample: false, // Better quality at expense of file size
          })
          .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        stats.optimizedSize += outputStats.size;

        const sizeKB = (outputStats.size / 1024).toFixed(1);
        console.log(`  ✓ ${size.name}: ${sizeKB} KB`);
      }

      stats.processed++;
      console.log(`  ✅ Completed: ${file}\n`);

    } catch (error) {
      stats.failed++;
      console.error(`  ❌ Error processing ${file}:`, error.message, '\n');
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Total images: ${stats.total}`);
  console.log(`Successfully processed: ${stats.processed}`);
  console.log(`Failed: ${stats.failed}`);
  console.log(`Original total size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Optimized total size: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Space saved: ${((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1)}%`);
  console.log(`Per-image average: ${(stats.optimizedSize / stats.processed / SIZES.length / 1024).toFixed(1)} KB`);
  console.log('='.repeat(50));
}

// Run the optimization
optimizeImages().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
