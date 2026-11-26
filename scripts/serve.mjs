import http from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'));
const hostname = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
const entryFiles = new Set(['index.html', 'styles.css', 'app.js', 'domain.js', 'content-data.js', 'geo.js']);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};
const assetExtensions = new Set(Object.keys(mimeTypes).filter(extension => !['.html', '.css', '.js'].includes(extension)));

function respond(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' });
  response.end(body);
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT debe ser un número entero entre 1 y 65535.');
}

const server = http.createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.setHeader('Allow', 'GET, HEAD');
    return respond(response, 405, 'Método no permitido.');
  }

  try {
    const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
    if (!requestPath.startsWith('/') || requestPath.includes('\\') || requestPath.includes('\0') || requestPath.split('/').includes('..')) {
      return respond(response, 403, 'Ruta no permitida.');
    }

    const relativePath = requestPath === '/' ? 'index.html' : requestPath.slice(1);
    const isStaticAsset = relativePath.startsWith('assets/') && assetExtensions.has(path.extname(relativePath).toLowerCase());
    if (!entryFiles.has(relativePath) && !isStaticAsset) return respond(response, 404, 'Archivo no encontrado.');

    const requestedFile = await realpath(path.join(projectRoot, relativePath));
    const allowedRoot = isStaticAsset ? path.join(projectRoot, 'assets') : projectRoot;
    const relativeToAllowedRoot = path.relative(allowedRoot, requestedFile);
    if (relativeToAllowedRoot.startsWith(`..${path.sep}`) || relativeToAllowedRoot === '..' || path.isAbsolute(relativeToAllowedRoot)) {
      return respond(response, 403, 'Ruta no permitida.');
    }
    if (!isStaticAsset && path.dirname(requestedFile) !== projectRoot) return respond(response, 403, 'Ruta no permitida.');

    const info = await stat(requestedFile);
    if (!info.isFile()) return respond(response, 404, 'Archivo no encontrado.');
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(requestedFile).toLowerCase()] || 'application/octet-stream',
      'Content-Length': info.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    });
    response.end(request.method === 'HEAD' ? undefined : await readFile(requestedFile));
  } catch (error) {
    if (error instanceof URIError) return respond(response, 400, 'Ruta inválida.');
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') return respond(response, 404, 'Archivo no encontrado.');
    console.error('Error al servir archivo:', error.message);
    if (!response.headersSent) respond(response, 500, 'No se pudo abrir el archivo.');
    else response.end();
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `El puerto ${port} ya está en uso. Cierra la vista previa anterior o configura PORT.`
    : `No se pudo iniciar el servidor: ${error.message}`);
  process.exitCode = 1;
});

server.listen(port, hostname, () => {
  console.log(`Local: http://${hostname}:${port}`);
  console.log('Presiona Ctrl+C para detener la vista previa.');
});
