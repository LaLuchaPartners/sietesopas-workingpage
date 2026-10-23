// Convierte a WebP todas las imágenes PNG/JPG dentro de src/assets y borra el original.
// Uso: npm run webp                            (calidad 80, todo src/assets)
//      npm run webp -- 90                      (calidad personalizada)
//      npm run webp -- 90 src/assets/servicio  (solo esa carpeta)
import { readdir, unlink } from 'node:fs/promises';
import { join, extname } from 'node:path';
import sharp from 'sharp';

const EXTS = new Set(['.png', '.jpg', '.jpeg']);
const quality = Number(process.argv[2]) || 80;
const ROOT = process.argv[3] || 'src/assets';

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else yield path;
  }
}

for await (const file of walk(ROOT)) {
  const ext = extname(file).toLowerCase();
  if (!EXTS.has(ext)) continue;
  const out = file.slice(0, -ext.length) + '.webp';
  await sharp(file).webp({ quality }).toFile(out);
  await unlink(file);
  console.log(`${file} -> ${out}`);
}
