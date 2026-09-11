#!/usr/bin/env node
/**
 * Renders the PWA icons (PNG) from public/icons/icon.svg and the 1200×630
 * social preview image (public/og-image.png) using resvg-wasm.
 * Run with `npm run icons` after changing the logo or the branding text.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

import { initWasm, Resvg } from '@resvg/resvg-wasm';

const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL('..', import.meta.url));

// Keep in sync with src/config/branding.ts (this script cannot import TypeScript).
const OG = {
  name: 'FlareQR Studio',
  taglineLines: ['Free, private', 'QR code generator'],
  description: 'Privacy-first · Logos & styling · SVG, PNG, JPG · Batch CSV · Dynamic links · API',
  footer: 'Runs in your browser – nothing is uploaded',
  colors: { primary: '#2563EB', accent: '#14B8A6', dark: '#0B1220', light: '#F8FAFC' },
};

await initWasm(readFileSync(require.resolve('@resvg/resvg-wasm/index_bg.wasm')));
const svg = readFileSync(`${root}/public/icons/icon.svg`, 'utf8');

const targets = [
  ['icon-192.png', 192],
  ['icon-512.png', 512],
  ['apple-touch-icon.png', 180],
  ['maskable-512.png', 512, true],
];

for (const [name, size, maskable] of targets) {
  // Maskable icons need ~10 % safe padding: scale the artwork into a solid square.
  const source = maskable
    ? svg.replace(
        '<rect width="512" height="512" rx="112" fill="url(#bg)"/>',
        '<rect width="512" height="512" rx="0" fill="url(#bg)"/>',
      )
    : svg;
  const resvg = new Resvg(source, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: false },
  });
  const image = resvg.render();
  writeFileSync(`${root}/public/icons/${name}`, image.asPng());
  image.free();
  resvg.free();
  console.log(`wrote public/icons/${name} (${size}px)`);
}

// Social preview (Open Graph / Twitter card), 1200×630. Text is set in the
// bundled Inter subsets that the Worker also uses for caption rendering.
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const icon = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const [taglineFirst = '', taglineSecond = ''] = OG.taglineLines;
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="1" cy="0" r="1">
      <stop offset="0" stop-color="${OG.colors.primary}" stop-opacity="0.55"/>
      <stop offset="0.55" stop-color="${OG.colors.accent}" stop-opacity="0.12"/>
      <stop offset="1" stop-color="${OG.colors.dark}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${OG.colors.primary}"/>
      <stop offset="1" stop-color="${OG.colors.accent}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="${OG.colors.dark}"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <g transform="translate(100 225) scale(${180 / 512})">${icon}</g>
  <g font-family="Inter" fill="${OG.colors.light}">
    <text x="330" y="236" font-size="30" font-weight="600" fill="#5EEAD4">${escape(OG.name)}</text>
    <text x="330" y="318" font-size="66" font-weight="700">${escape(taglineFirst)}</text>
    <text x="330" y="394" font-size="66" font-weight="700">${escape(taglineSecond)}</text>
    <text x="330" y="450" font-size="23" font-weight="500" fill="#94A3B8">${escape(OG.description)}</text>
    <text x="100" y="576" font-size="22" font-weight="500" fill="#CBD5E1">${escape(OG.footer)}</text>
  </g>
  <rect x="0" y="618" width="1200" height="12" fill="url(#bar)"/>
</svg>`;

const fontBuffers = ['regular', 'medium', 'semibold', 'bold'].map(
  (weight) => new Uint8Array(readFileSync(`${root}/src/worker/fonts/inter-${weight}.ttf.bin`)),
);
const og = new Resvg(ogSvg, {
  fitTo: { mode: 'width', value: 1200 },
  font: { fontBuffers, defaultFontFamily: 'Inter', loadSystemFonts: false },
});
const ogImage = og.render();
writeFileSync(`${root}/public/og-image.png`, ogImage.asPng());
ogImage.free();
og.free();
console.log('wrote public/og-image.png (1200×630)');
