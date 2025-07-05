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
  const sourceIcon = 'icons/icon128.png'; // Updated path to icons folder
  const iconSizes = [16, 32, 48, 128];
  
  // Create icons directory if it doesn't exist
  const iconsDir = 'dist/icons';
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  // Check if source icon exists
  if (!fs.existsSync(sourceIcon)) {
    console.error(`❌ Source icon not found: ${sourceIcon}`);
    console.log('\n📋 Instructions:');
    console.log('1. Place your 128px PNG file in the icons/ folder as icon128.png');
    console.log('2. Run: npm run resize-icons');
    console.log('\n💡 Alternative: Use an online tool like https://www.iloveimg.com/resize-image');
    return;
  }
  
  console.log(`🔄 Generating icons from ${sourceIcon}...`);
  
  // Generate all icon sizes
  for (const size of iconSizes) {
    const targetPath = path.join(iconsDir, `icon${size}.png`);
    await createResizedIcon(sourceIcon, targetPath, size);
  }
  
  console.log('\n🎉 Icon generation complete!');
  console.log('📁 Icons saved to: dist/icons/');
  console.log('🔧 Run "npm run build:extension" to include them in your extension');
}

// Run the script
generateIcons().catch(console.error); 