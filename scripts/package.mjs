import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { zipSync, unzipSync } from 'fflate';
import assert from 'node:assert/strict';
const manifest = JSON.parse(await readFile('extension/manifest.json', 'utf8'));
const files = {};
async function collect(directory, prefix = '') {
  for (const item of (await readdir(directory, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const key = prefix + item.name;
    if (item.isDirectory()) await collect(join(directory, item.name), `${key}/`);
    else files[key] = [new Uint8Array(await readFile(join(directory, item.name))), { mtime: new Date('2026-01-01T00:00:00Z') }];
  }
}
await collect('extension');
files.LICENSE = [new Uint8Array(await readFile('LICENSE')), { mtime: new Date('2026-01-01T00:00:00Z') }];
await mkdir('dist', { recursive: true });
const zip = zipSync(files, { level: 9 });
const unpacked = unzipSync(zip);
assert.equal(JSON.parse(new TextDecoder().decode(unpacked['manifest.json'])).version, manifest.version);
assert.equal(Object.keys(unpacked).length, Object.keys(files).length);
const destination = `dist/drift-${manifest.version}.zip`;
await writeFile(destination, zip);
console.log(`Packaged ${Object.keys(files).length} extension files in ${destination} (${zip.length} bytes).`);
