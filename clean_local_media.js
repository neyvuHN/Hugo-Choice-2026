import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
const BACKUP_DIR = path.join(__dirname, 'media_backup');

// Helper to copy directory recursively
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper to delete directory recursively
function deleteDirRecursive(dirPath) {
  if (!fs.existsSync(dirPath)) return;
  
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      deleteDirRecursive(fullPath);
    } else {
      fs.unlinkSync(fullPath);
    }
  }
  fs.rmdirSync(dirPath);
}

function backupAndClean() {
  console.log('📦 Starting backup and cleanup of local media files...');

  const itemsToMove = [
    { name: 'Nominees', type: 'dir' },
    { name: 'team_logo', type: 'dir' },
    { name: "La Valse de L'Amour.mp3", type: 'file' }
  ];

  let movedCount = 0;

  for (const item of itemsToMove) {
    const srcPath = path.join(PUBLIC_DIR, item.name);
    const destPath = path.join(BACKUP_DIR, item.name);

    if (!fs.existsSync(srcPath)) {
      console.log(`ℹ️ [Skip] ${item.name} does not exist in public/`);
      continue;
    }

    // Ensure backup root exists
    if (!fs.existsSync(BACKUP_DIR)) {
      fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    try {
      if (item.type === 'dir') {
        console.log(`Moving directory: ${item.name} -> media_backup/${item.name}`);
        copyDirRecursive(srcPath, destPath);
        deleteDirRecursive(srcPath);
      } else {
        console.log(`Moving file: ${item.name} -> media_backup/${item.name}`);
        fs.copyFileSync(srcPath, destPath);
        fs.unlinkSync(srcPath);
      }
      console.log(`✅ Moved ${item.name} successfully.`);
      movedCount++;
    } catch (error) {
      console.error(`❌ Error moving ${item.name}:`, error.message || error);
    }
  }

  if (movedCount > 0) {
    console.log('\n🎉 Backup and cleanup completed successfully!');
    console.log('   All heavy media files have been moved to the "/media_backup" folder (which is ignored by Git).');
    console.log('   Your public/ folder is now clean and lightweight, ready for Firebase Hosting deployment.');
  } else {
    console.log('\nℹ️ No local files were moved (they might have already been moved).');
  }
}

backupAndClean();
