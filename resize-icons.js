import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a resized version using Sharp
async function createResizedIcon(sourcePath, targetPath, size) {
  try {
    console.log(`🔄 Processing ${sourcePath} to ${size}x${size}...`);
    
    // Get original file info
    const originalStats = fs.statSync(sourcePath);
    console.log(`📊 Original file size: ${originalStats.size} bytes`);
    
    await sharp(sourcePath)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
      })
      .png()
      .toFile(targetPath);
    
    // Get output file info
    const outputStats = fs.statSync(targetPath);
    console.log(`📊 Output file size: ${outputStats.size} bytes`);
    
    console.log(`✅ Created ${targetPath} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Error creating ${targetPath}:`, error.message);
  }
}

// Main function
async function generateIcons() {
  const iconVariants = [
    { name: '', source: 'icons/icon128.png' },
    { name: '_gray', source: 'icons/icon128_gray.png' }
  ];
  const iconSizes = [16, 32, 48, 128];

  // Create both directories if they don't exist
  const distIconsDir = 'dist/icons';
  const publicIconsDir = 'public/icons';

  if (!fs.existsSync(distIconsDir)) {
    fs.mkdirSync(distIconsDir, { recursive: true });
  }

  if (!fs.existsSync(publicIconsDir)) {
    fs.mkdirSync(publicIconsDir, { recursive: true });
  }

  for (const variant of iconVariants) {
    if (!fs.existsSync(variant.source)) {
      console.warn(`⚠️  Source icon not found: ${variant.source} (skipping)`);
      continue;
    }
    console.log(`🔄 Generating icons from ${variant.source}...`);
    for (const size of iconSizes) {
      const distTargetPath = path.join(distIconsDir, `icon${size}${variant.name}.png`);
      const publicTargetPath = path.join(publicIconsDir, `icon${size}${variant.name}.png`);
      await createResizedIcon(variant.source, distTargetPath, size);
      await createResizedIcon(variant.source, publicTargetPath, size);
    }
  }

  console.log('\n🎉 Icon generation complete!');
  console.log('📁 Icons saved to: dist/icons/ and public/icons/');
  console.log('🔧 Run "npm run build:extension" to include them in your extension');
}

// Run the script
generateIcons().catch(console.error); 