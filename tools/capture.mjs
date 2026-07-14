#!/usr/bin/env node
/**
 * capture.mjs — hang the plates.
 *
 * Reads ../data/bestiary.json and takes a 1200×900 screenshot of every
 * specimen whose plate file does not exist yet, saving it to ../plates/<id>.png.
 * Field sketches (SVG plates) are never overwritten — a sketch outranks a photo.
 *
 * One-time setup:   npm install playwright && npx playwright install chromium
 * Run from tools/:  node capture.mjs
 * Re-shoot one:     node capture.mjs <specimen-id>   (overwrites its .png)
 *
 * Runs locally on the curator's machine only. It is not part of the site.
 */
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(await readFile(join(root, 'data', 'bestiary.json'), 'utf8'));
const only = process.argv[2] || null;

const targets = data.specimens.filter(s => {
  if (only) return s.id === only;
  if (!s.url) return false;
  const png = join(root, 'plates', `${s.id}.png`);
  const declared = s.plate ? join(root, s.plate) : null;
  return !existsSync(png) && !(declared && existsSync(declared));
});

if (!targets.length) {
  console.log(only ? `No specimen with id "${only}".` : 'Every specimen already has a plate. Nothing to shoot.');
  process.exit(0);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 2 });

for (const s of targets) {
  const out = join(root, 'plates', `${s.id}.png`);
  process.stdout.write(`  ${s.binomial} … `);
  try {
    await page.goto(s.url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(2500); // let the creature settle
    await page.screenshot({ path: out });
    console.log(`hung → plates/${s.id}.png`);
    console.log(`    (if the JSON row's "plate" points elsewhere, update it to "plates/${s.id}.png")`);
  } catch (err) {
    console.log(`in the field (${err.message.split('\n')[0]})`);
  }
}

await browser.close();
console.log('Done. Review the plates, then commit and push.');
