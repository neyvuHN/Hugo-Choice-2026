import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Verify env vars
const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.VITE_CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Error: Cloudinary credentials missing in .env file!');
  console.log('Please ensure the following variables are defined in your .env file:');
  console.log('  VITE_CLOUDINARY_CLOUD_NAME');
  console.log('  VITE_CLOUDINARY_API_KEY');
  console.log('  CLOUDINARY_API_SECRET');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true
});

const PUBLIC_DIR = path.join(__dirname, 'public');

/**
 * Sanitizes a path string to match Cloudinary public ID standards.
 * Strips accents, replaces special characters, and handles spaces.
 */
function sanitizeCloudinaryPath(pathStr) {
  // Clean path: remove leading slash if present
  let clean = pathStr.startsWith('/') ? pathStr.slice(1) : pathStr;
  
  // Convert Vietnamese accented characters to ASCII
  clean = clean
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');

  // Replace '&' with 'and'
  clean = clean.replace(/&/g, 'and');

  // Replace spaces and multiple underscores with a single underscore
  clean = clean.replace(/\s+/g, '_').replace(/_+/g, '_');

  // Remove other invalid characters for Cloudinary public ID
  // Allow alphanumeric, slashes, underscores, hyphens, and dots
  clean = clean.replace(/[^a-zA-Z0-9_.\-\/]/g, '');

  return clean;
}

// Recursively find files
function getFilesRecursive(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursive(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Filter files we want to upload (videos, team logos, and background audio)
function getUploadFiles() {
  const allFiles = getFilesRecursive(PUBLIC_DIR);
  
  return allFiles.filter(filePath => {
    const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
    const ext = path.extname(filePath).toLowerCase();
    
    // We want to upload:
    // 1. Everything inside public/Nominees/ (.webm files)
    // 2. Everything inside public/team_logo/ (.png files)
    // 3. The background music "La Valse de L'Amour.mp3" in the root of public/
    const isNominee = relPath.startsWith('Nominees/');
    const isTeamLogo = relPath.startsWith('team_logo/');
    const isMusic = relPath === "La Valse de L'Amour.mp3";
    
    return isNominee || isTeamLogo || isMusic;
  });
}

async function uploadFile(filePath) {
  const relPath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
  const ext = path.extname(filePath);
  
  // Sanitize path including the folder names
  const cleanRelPath = sanitizeCloudinaryPath(relPath);
  
  // Remove extension for public_id
  const publicId = cleanRelPath.slice(0, -ext.length);
  
  // Detect resource type
  let resourceType = 'image';
  const lowerExt = ext.toLowerCase();
  
  if (['.webm', '.mp4', '.mov', '.mp3', '.wav', '.ogg', '.aac'].includes(lowerExt)) {
    resourceType = 'video';
  } else if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(lowerExt)) {
    resourceType = 'image';
  } else {
    resourceType = 'raw';
  }
  
  console.log(`📤 Uploading [${resourceType}] ${relPath} ...`);
  console.log(`   └─ Public ID: ${publicId}`);

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: true,
      invalidate: true
    });
    console.log(`✅ Success! URL: ${result.secure_url}\n`);
    return { success: true, path: relPath, url: result.secure_url };
  } catch (error) {
    console.error(`❌ Failed uploading ${relPath}:`, error.message || error);
    return { success: false, path: relPath, error: error.message || error };
  }
}

async function main() {
  const filesToUpload = getUploadFiles();
  
  if (filesToUpload.length === 0) {
    console.log('ℹ️ No matching files found to upload.');
    return;
  }
  
  console.log(`🚀 Found ${filesToUpload.length} files to upload to Cloudinary...\n`);
  
  const results = [];
  for (const file of filesToUpload) {
    const res = await uploadFile(file);
    results.push(res);
  }
  
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log('--- UPLOAD SUMMARY ---');
  console.log(`Total attempted: ${results.length}`);
  console.log(`Succeeded: ${succeeded.length}`);
  console.log(`Failed: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed uploads list:');
    failed.forEach(f => console.log(` - ${f.path}: ${f.error}`));
  } else {
    console.log('\n✨ All files uploaded successfully! You can now safely remove local versions from the public folder.');
  }
}

main();
