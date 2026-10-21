const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');
const fs = require('fs');

const dev = false;
const hostname = '0.0.0.0';
const port = parseInt(process.env.PORT || '3001', 10);
const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

function serveStaticFile(req, res, filePath) {
  try {
    if (!fs.existsSync(filePath)) return false;
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return false;

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': 'public, max-age=31536000, immutable'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
    return true;
  } catch (err) {
    return false;
  }
}

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const pathname = parsedUrl.pathname || '/';

      // 1. Directly serve /_next/static/ assets from .next/static
      if (pathname.startsWith('/_next/static/')) {
        const relativePath = pathname.replace('/_next/static/', '');
        const filePath = path.join(__dirname, '.next', 'static', relativePath);
        if (serveStaticFile(req, res, filePath)) {
          return;
        }
      }

      // 2. Directly serve public/ assets (logos, images, favicon)
      const publicFilePath = path.join(__dirname, 'public', pathname.replace(/^\//, ''));
      if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
        if (serveStaticFile(req, res, publicFilePath)) {
          return;
        }
      }

      // 3. Next.js SSR and page handling
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  });

  server.listen(port, () => {
    console.log(`> Admin Ready on http://${hostname}:${port}`);
  });
}).catch((err) => {
  console.error('Failed to prepare Admin Next.js app:', err);
  process.exit(1);
});
