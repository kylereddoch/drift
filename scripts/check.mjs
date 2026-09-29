import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
const manifest = JSON.parse(await readFile('extension/manifest.json', 'utf8'));
const pkg = JSON.parse(await readFile('package.json', 'utf8'));
assert.equal(manifest.manifest_version, 3);
assert.equal(manifest.version, pkg.version);
assert.ok(manifest.description.length <= 132, 'Chrome limits descriptions to 132 characters');
assert.deepEqual(manifest.permissions.toSorted(), ['activeTab', 'contextMenus', 'scripting', 'storage'].toSorted());
assert.equal(manifest.host_permissions, undefined);
assert.equal(manifest.content_scripts, undefined);
assert.equal(manifest.web_accessible_resources, undefined);
assert.match(manifest.content_security_policy.extension_pages, /connect-src 'none'/);
for (const path of Object.values(manifest.icons)) {
  const bytes = await readFile(join('extension', path));
  assert.equal(bytes.toString('hex', 0, 8), '89504e470d0a1a0a');
  const size = Number(path.match(/(\d+)\.png$/)[1]);
  assert.equal(bytes.readUInt32BE(16), size);
  assert.equal(bytes.readUInt32BE(20), size);
}
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    if (/\.(m?js)$/.test(file)) execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    if (/\.html$/.test(file)) {
      const html = await readFile(file, 'utf8');
      assert.doesNotMatch(html, /\son\w+\s*=|<script[^>]+src=["']https?:/i, `${file}: remote or inline script`);
      assert.match(html, /<html lang="en"(?:\s[^>]*)?>/);
      for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        const target = match[1].split('#')[0];
        if (target.includes('://')) continue;
        await readFile(join('extension', target));
      }
    }
  }
}
await walk('extension');
await walk('scripts');
console.log('Manifest, permissions, packaged resources, icons, and JavaScript syntax verified.');
