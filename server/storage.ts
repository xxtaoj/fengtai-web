import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { siteSeed } from '../src/data/siteSeed';
import { siteSchema, type SiteRecord } from './schema';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const runtimeDir = path.resolve(currentDir, 'runtime');
const sitePath = path.join(runtimeDir, 'site.json');
const uploadsDir = path.join(runtimeDir, 'uploads');

async function ensureRuntime() {
  await fs.mkdir(runtimeDir, { recursive: true });
  await fs.mkdir(uploadsDir, { recursive: true });
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export async function readSite(): Promise<SiteRecord> {
  await ensureRuntime();
  try {
    const raw = await fs.readFile(sitePath, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    return siteSchema.parse(parsed);
  } catch {
    const fresh = clone(siteSeed);
    await writeSite(fresh);
    return fresh;
  }
}

export async function writeSite(site: SiteRecord): Promise<void> {
  await ensureRuntime();
  const parsed = siteSchema.parse(site);
  const tempPath = `${sitePath}.tmp`;
  await fs.writeFile(tempPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
  await fs.rename(tempPath, sitePath);
}

export function runtimePaths() {
  return { runtimeDir, sitePath, uploadsDir };
}

export async function listMediaFiles() {
  await ensureRuntime();
  const entries = await fs.readdir(uploadsDir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const filePath = path.join(uploadsDir, entry.name);
    const stat = await fs.stat(filePath);
    const extension = path.extname(entry.name).slice(1).toLowerCase();
    const kind = ['mp4', 'webm', 'mov', 'm4v'].includes(extension)
      ? 'video'
      : ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'svg'].includes(extension)
        ? 'image'
        : 'file';
    files.push({
      url: `/uploads/${entry.name}`,
      kind,
      name: entry.name,
      originalName: entry.name,
      size: stat.size,
      updatedAt: stat.mtime.toISOString(),
    });
  }
  return files.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function uploadsRoot() {
  return uploadsDir;
}
