#!/usr/bin/env node

/**
 * Attribution Verification Script
 * 
 * This script checks that all assets in the project have proper attributions
 * and helps maintain attribution completeness.
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = process.cwd();
const ATTRIBUTIONS_FILE = path.join(PROJECT_ROOT, 'ATTRIBUTIONS.md');
const BACKGROUND_DIR = path.join(PROJECT_ROOT, 'public', 'background');
const MUSIC_DIR = path.join(PROJECT_ROOT, 'public', 'music');
const ICON_DIR = path.join(PROJECT_ROOT, 'public');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getFilesInDirectory(directory, extensions = []) {
  if (!fs.existsSync(directory)) {
    return [];
  }
  
  return fs.readdirSync(directory)
    .filter(file => {
      if (extensions.length === 0) return true;
      return extensions.some(ext => file.toLowerCase().endsWith(ext.toLowerCase()));
    })
    .sort();
}

function parseAttributionsFile() {
  if (!fs.existsSync(ATTRIBUTIONS_FILE)) {
    log(`❌ ATTRIBUTIONS.md not found at ${ATTRIBUTIONS_FILE}`, 'red');
    return null;
  }
  
  const content = fs.readFileSync(ATTRIBUTIONS_FILE, 'utf8');
  const attributedFiles = [];
  
  // Simple parsing - look for **filename.ext** patterns
  const fileMatches = content.match(/\*\*([^*]+\.(jpg|jpeg|png|gif|webp|mp3|wav|ogg|flac|ico))\*\*/gi);
  if (fileMatches) {
    fileMatches.forEach(match => {
      const filename = match.replace(/\*\*/g, '');
      attributedFiles.push(filename);
    });
  }
  
  return {
    content,
    attributedFiles: [...new Set(attributedFiles)] // Remove duplicates
  };
}

function checkBackgroundImages() {
  log('\n📸 Checking Background Images...', 'cyan');
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const backgroundFiles = getFilesInDirectory(BACKGROUND_DIR, imageExtensions);
  
  log(`Found ${backgroundFiles.length} background image(s):`);
  backgroundFiles.forEach(file => {
    log(`  - ${file}`, 'blue');
  });
  
  return backgroundFiles;
}

function checkMusicFiles() {
  log('\n🎵 Checking Music Files...', 'cyan');
  const musicExtensions = ['.mp3', '.wav', '.ogg', '.flac'];
  const musicFiles = getFilesInDirectory(MUSIC_DIR, musicExtensions);
  
  log(`Found ${musicFiles.length} music file(s):`);
  musicFiles.forEach(file => {
    log(`  - ${file}`, 'blue');
  });
  
  return musicFiles;
}

function checkIcons() {
  log('\n🎨 Checking Icon Files...', 'cyan');
  const iconExtensions = ['.ico', '.png'];
  const iconFiles = getFilesInDirectory(ICON_DIR, iconExtensions)
    .filter(file => file.includes('icon') || file === 'favicon.ico');
  
  log(`Found ${iconFiles.length} icon file(s):`);
  iconFiles.forEach(file => {
    log(`  - ${file}`, 'blue');
  });
  
  return iconFiles;
}

function verifyAttributions() {
  log('🔍 Verifying Asset Attributions...', 'bright');
  log('='.repeat(50), 'bright');
  
  // Get all assets
  const backgroundFiles = checkBackgroundImages();
  const musicFiles = checkMusicFiles();
  const iconFiles = checkIcons();
  const allAssets = [...backgroundFiles, ...musicFiles, ...iconFiles];
  
  // Parse attributions
  log('\n📋 Checking Attributions File...', 'cyan');
  const attributions = parseAttributionsFile();
  
  if (!attributions) {
    log('❌ Cannot verify attributions without ATTRIBUTIONS.md file', 'red');
    return;
  }
  
  log(`✅ ATTRIBUTIONS.md found with ${attributions.attributedFiles.length} attributed file(s)`);
  
  // Check for missing attributions
  log('\n🔎 Attribution Analysis...', 'cyan');
  const missingAttributions = [];
  const extraAttributions = [];
  
  allAssets.forEach(asset => {
    if (!attributions.attributedFiles.includes(asset)) {
      missingAttributions.push(asset);
    }
  });
  
  attributions.attributedFiles.forEach(attributed => {
    if (!allAssets.includes(attributed)) {
      extraAttributions.push(attributed);
    }
  });
  
  // Report results
  log('\n📊 Attribution Status:', 'bright');
  log(`Total assets found: ${allAssets.length}`);
  log(`Assets with attributions: ${attributions.attributedFiles.length}`);
  log(`Missing attributions: ${missingAttributions.length}`);
  log(`Extra attributions: ${extraAttributions.length}`);
  
  if (missingAttributions.length > 0) {
    log('\n❌ Assets missing attributions:', 'red');
    missingAttributions.forEach(asset => {
      log(`  - ${asset}`, 'red');
    });
  }
  
  if (extraAttributions.length > 0) {
    log('\n⚠️  Attributed files not found in project:', 'yellow');
    extraAttributions.forEach(asset => {
      log(`  - ${asset}`, 'yellow');
    });
  }
  
  // Check for placeholder content
  const hasPlaceholders = attributions.content.includes('[Source needed - please research and update]') ||
                         attributions.content.includes('[Creator name needed]') ||
                         attributions.content.includes('[License type needed]');
  
  if (hasPlaceholders) {
    log('\n⚠️  ATTRIBUTIONS.md contains placeholder content that needs to be completed', 'yellow');
  }
  
  // Final status
  log('\n' + '='.repeat(50), 'bright');
  if (missingAttributions.length === 0 && extraAttributions.length === 0 && !hasPlaceholders) {
    log('✅ All attributions are complete and accurate!', 'green');
  } else {
    log('❌ Attribution issues found. Please update ATTRIBUTIONS.md', 'red');
    
    if (missingAttributions.length > 0) {
      log('\nTo fix missing attributions:', 'yellow');
      log('1. Research the source of each missing asset using reverse image search or checking metadata', 'yellow');
      log('2. Add proper attribution entries to ATTRIBUTIONS.md', 'yellow');
      log('3. Include source URL, creator name, license type, and description', 'yellow');
    }
    
    if (hasPlaceholders) {
      log('\nTo complete placeholder attributions:', 'yellow');
      log('1. Replace [Source needed] with actual source URLs', 'yellow');
      log('2. Replace [Creator name needed] with actual creator names', 'yellow');
      log('3. Replace [License type needed] with specific license information', 'yellow');
    }
  }
  
  return {
    totalAssets: allAssets.length,
    attributedAssets: attributions.attributedFiles.length,
    missingAttributions: missingAttributions.length,
    extraAttributions: extraAttributions.length,
    hasPlaceholders
  };
}

function generateAttributionTemplate() {
  log('\n📝 Generating Attribution Template...', 'cyan');
  
  const backgroundFiles = getFilesInDirectory(BACKGROUND_DIR, ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
  const musicFiles = getFilesInDirectory(MUSIC_DIR, ['.mp3', '.wav', '.ogg', '.flac']);
  
  let template = '# Asset Attribution Template\n\n';
  template += 'Use this template to add proper attributions to ATTRIBUTIONS.md:\n\n';
  
  if (backgroundFiles.length > 0) {
    template += '## Background Images\n\n';
    backgroundFiles.forEach(file => {
      template += `**${file}**\n`;
      template += '- **Source**: [Add source URL here]\n';
      template += '- **Creator**: [Add creator name here]\n';
      template += '- **License**: [Add license type here]\n';
      template += '- **Description**: [Add description here]\n';
      template += '- **Date Added**: [Add date here]\n';
      template += '- **Usage Rights**: [Describe what the license allows]\n\n';
    });
  }
  
  if (musicFiles.length > 0) {
    template += '## Music Files\n\n';
    musicFiles.forEach(file => {
      template += `**${file}**\n`;
      template += '- **Source**: [Add source URL here]\n';
      template += '- **Composer/Artist**: [Add composer/artist name here]\n';
      template += '- **License**: [Add license type here]\n';
      template += '- **Description**: [Add description here]\n';
      template += '- **Date Added**: [Add date here]\n';
      template += '- **Usage Rights**: [Describe what the license allows]\n\n';
    });
  }
  
  const templateFile = path.join(PROJECT_ROOT, 'attribution-template.md');
  fs.writeFileSync(templateFile, template);
  log(`✅ Attribution template saved to: ${templateFile}`, 'green');
}

// Main execution
if (require.main === module) {
  const command = process.argv[2];
  
  switch (command) {
    case 'verify':
    case undefined:
      verifyAttributions();
      break;
    case 'template':
      generateAttributionTemplate();
      break;
    case 'help':
      log('Attribution Verification Script', 'bright');
      log('Usage: node scripts/verify-attributions.js [command]', 'blue');
      log('\nCommands:', 'bright');
      log('  verify (default) - Check attribution completeness');
      log('  template         - Generate attribution template');
      log('  help            - Show this help message');
      break;
    default:
      log(`Unknown command: ${command}`, 'red');
      log('Use "help" to see available commands', 'yellow');
  }
}

module.exports = {
  verifyAttributions,
  generateAttributionTemplate,
  getFilesInDirectory,
  parseAttributionsFile
};
