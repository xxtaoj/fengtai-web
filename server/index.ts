import express from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleLogin, handleLogout, handleSession, requireAdmin } from './auth';
import { readSite, runtimePaths, uploadsRoot, listMediaFiles, writeSite } from './storage';
import { siteSchema } from './schema';
import { siteSeed } from '../src/data/siteSeed';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(currentDir, '..');
const distDir = path.join(repoRoot, 'dist');

function fileExists(filePath: string) {
  return fs.promises.access(filePath, fs.constants.F_OK).then(() => true).catch(() => false);
}

function safeName(originalName: string) {
  const extension = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, extension).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'upload';
  return `${Date.now()}-${base}-${crypto.randomUUID().slice(0, 8)}${extension}`;
}

async function bootstrap() {
  await readSite();
  const app = express();
  app.disable('x-powered-by');

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  const upload = multer({
    storage: multer.diskStorage({
      destination: (_request, _file, callback) => callback(null, uploadsRoot()),
      filename: (_request, file, callback) => callback(null, safeName(file.originalname)),
    }),
    limits: { fileSize: 300 * 1024 * 1024 },
    fileFilter: (_request, file, callback) => {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
        callback(null, true);
        return;
      }
      callback(new Error('Only image and video uploads are supported'));
    },
  });

  app.get('/healthz', (_request, response) => response.json({ ok: true }));
  app.get('/api/auth/session', handleSession);
  app.post('/api/admin/login', handleLogin);
  app.post('/api/admin/logout', handleLogout);

  app.get('/api/site', async (_request, response) => {
    response.json(await readSite());
  });

  app.get('/api/catalog', async (_request, response) => {
    const site = await readSite();
    response.json(site.catalog);
  });

  app.put('/api/admin/site', requireAdmin, async (request, response) => {
    const validated = siteSchema.parse(request.body);
    await writeSite(validated);
    response.json(validated);
  });

  app.post('/api/admin/site/reset', requireAdmin, async (_request, response) => {
    await writeSite(siteSeed);
    response.json(siteSeed);
  });

  app.get('/api/admin/media', requireAdmin, async (_request, response) => {
    response.json(await listMediaFiles());
  });

  app.post('/api/admin/media', requireAdmin, upload.single('file'), async (request, response) => {
    if (!request.file) {
      response.status(400).json({ error: 'Missing file' });
      return;
    }
    const kind = request.file.mimetype.startsWith('video/')
      ? 'video'
      : request.file.mimetype.startsWith('image/')
        ? 'image'
        : 'file';
    response.json({
      url: `/uploads/${request.file.filename}`,
      kind,
      name: request.file.filename,
      originalName: request.file.originalname,
      size: request.file.size,
      updatedAt: new Date().toISOString(),
    });
  });

  app.get('/api/admin/runtime', requireAdmin, async (_request, response) => {
    response.json(runtimePaths());
  });

  app.use('/uploads', express.static(uploadsRoot(), {
    maxAge: '1y',
    setHeaders(response) {
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  }));

  const hasDist = await fileExists(path.join(distDir, 'index.html'));
  if (hasDist) {
    app.use(express.static(distDir));
    app.use((request, response, next) => {
      if ((request.method === 'GET' || request.method === 'HEAD') && !request.path.startsWith('/api') && !request.path.startsWith('/uploads') && !path.extname(request.path)) {
        response.sendFile(path.join(distDir, 'index.html'));
        return;
      }
      next();
    });
  } else {
    app.get('/', (_request, response) => {
      response.type('text').send('Frontend build not found. Run `pnpm build` before starting the server.');
    });
  }

  const port = Number(process.env.PORT || 3000);
  app.listen(port, () => {
    console.log(`Fengtai server listening on http://127.0.0.1:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
