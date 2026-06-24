import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname } from 'path';

const IMAGES_DIR = './public';
const MAX_WIDTH = 1200;

async function optimizeImages(dir) {
  const files = await readdir(dir, { recursive: true });
  
  for (const file of files) {
    const filepath = join(dir, file);
    const ext = extname(file).toLowerCase();
    
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
    
    const stats = await stat(filepath);
    if (stats.size < 10240) continue; // Пропускаем мелкие файлы
    
    const outFile = filepath.replace(ext, '.webp');
    
    try {
      await sharp(filepath)
        .resize(MAX_WIDTH, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outFile);
      console.log(`✅ ${file} → ${outFile}`);
    } catch (e) {
      console.error(`❌ ${file}: ${e.message}`);
    }
  }
}

optimizeImages(IMAGES_DIR);
