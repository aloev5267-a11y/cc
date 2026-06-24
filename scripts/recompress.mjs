import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { join } from 'path';

async function recompress(dir) {
  const files = await readdir(dir, { recursive: true });
  
  for (const file of files) {
    if (!file.endsWith('.webp')) continue;
    const filepath = join(dir, file);
    
    try {
      const img = sharp(filepath);
      const { width } = await img.metadata();
      const tmp = filepath + '.tmp';
      
      await img
        .resize(Math.min(width, 1200), null, { withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(tmp);
      
      const { size: orig } = await import('fs').then(f => f.promises.stat(filepath));
      const { size: newsize } = await import('fs').then(f => f.promises.stat(tmp));
      
      if (newsize < orig) {
        await import('fs').then(f => f.promises.rename(tmp, filepath));
        console.log(`✅ ${file}: ${(orig/1024).toFixed(0)}KB → ${(newsize/1024).toFixed(0)}KB`);
      } else {
        await import('fs').then(f => f.promises.unlink(tmp));
        console.log(`⏭️ ${file}: уже оптимальный`);
      }
    } catch (e) {
      console.error(`❌ ${file}: ${e.message}`);
    }
  }
}

recompress('./public');
