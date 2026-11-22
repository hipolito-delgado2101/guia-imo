import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = path.join(projectRoot, 'dist');
const entryFiles = ['index.html', 'styles.css', 'app.js', 'domain.js', 'content-data.js'];
const assetExtensions = new Set(['.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.ico', '.woff', '.woff2']);
let copied = 0;

async function copyAssets(relativeDirectory = 'assets') {
  const sourceDirectory = path.join(projectRoot, relativeDirectory);
  let entries;
  try {
    entries = await readdir(sourceDirectory, { withFileTypes: true });
  } catch (error) {
    if (error.code === 'ENOENT' && relativeDirectory === 'assets') return;
    throw error;
  }
  for (const entry of entries) {
    const relativePath = path.join(relativeDirectory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`No se permiten enlaces simbólicos en assets: ${relativePath}`);
    if (entry.isDirectory()) {
      await copyAssets(relativePath);
    } else if (entry.isFile() && assetExtensions.has(path.extname(entry.name).toLowerCase())) {
      const destination = path.join(outputRoot, relativePath);
      await mkdir(path.dirname(destination), { recursive: true });
      await copyFile(path.join(projectRoot, relativePath), destination);
      copied += 1;
    }
  }
}

try {
  await mkdir(outputRoot, { recursive: true });
  for (const entry of entryFiles) {
    await copyFile(path.join(projectRoot, entry), path.join(outputRoot, entry));
    copied += 1;
  }
  await copyAssets();
  await writeFile(path.join(outputRoot, '.nojekyll'), '');
  console.log(`Sitio preparado en ${outputRoot} (${copied} archivos estáticos).`);
} catch (error) {
  console.error(`No se pudo preparar el sitio: ${error.message}`);
  process.exitCode = 1;
}
