import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, extname } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const publicFiles = new Set(['index.html', 'privacy.html', 'assets/styles.css', 'assets/drift.svg', 'assets/drift-128.png', 'assets/chrome-web-store-badge.png', 'robots.txt', 'sitemap.xml']);
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://127.0.0.1:4174');
    const path = decodeURIComponent(url.pathname).replace(/^\//, '') || 'index.html';
    if (!publicFiles.has(path)) { response.writeHead(404); return response.end('Page not found'); }
    const body = await readFile(resolve(root, path));
    response.writeHead(200, { 'Content-Type': types[extname(path)], 'Cache-Control': 'no-store' });
    response.end(body);
  } catch { response.writeHead(404); response.end('Page not found'); }
});
server.listen(4174, '127.0.0.1', () => console.log('Drift website preview: http://127.0.0.1:4174/'));
