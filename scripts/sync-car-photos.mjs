// Scans public/cars/local/ for <slug>.<ext> files and writes a manifest
// (content/local-photos.json) mapping car slug -> public path. Runs
// automatically before `dev` and `build`, or on demand via `pnpm run photos`.
// Drop a photo named after the car's slug (e.g. bmw-x6-2024.jpg) and restart.

import { readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "public", "cars", "local");
const out = join(root, "content", "local-photos.json");
const exts = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

mkdirSync(dir, { recursive: true });

let files = [];
try {
  files = readdirSync(dir);
} catch {
  files = [];
}

const map = {};
for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!exts.includes(ext)) continue;
  const slug = basename(file, ext);
  map[slug] = `/cars/local/${file}`;
}

writeFileSync(out, JSON.stringify(map, null, 2) + "\n");
console.log(`[photos] synced ${Object.keys(map).length} local car photo(s) -> content/local-photos.json`);
