#!/usr/bin/env node
/**
 * Guards the dependency constraints that npm only reports late (ERESOLVE in
 * `npm ci`) or not at all (a Miniflare override that drifts away from the
 * version Wrangler ships with). Run with `npm run check:deps`; it is the first
 * step of `npm run check` and of CI.
 *
 * 1. Peer ranges: `vitest` must stay inside the range required by
 *    `@cloudflare/vitest-pool-workers` and `typescript` inside the range
 *    required by `typescript-eslint`. Both the declared range in package.json
 *    and the installed version are checked, so a bump that would make `npm ci`
 *    fail is caught before it is committed.
 * 2. Miniflare override: `overrides["@cloudflare/vitest-pool-workers"].miniflare`
 *    must match the Miniflare version that the installed Wrangler depends on;
 *    otherwise the workers test pool and `wrangler dev` run different workerd
 *    builds.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import semver from 'semver';

const root = fileURLToPath(new URL('..', import.meta.url));

/** @type {Array<{ dependency: string; peerOf: string }>} */
const PEER_CONSTRAINTS = [
  { dependency: 'vitest', peerOf: '@cloudflare/vitest-pool-workers' },
  { dependency: 'typescript', peerOf: 'typescript-eslint' },
];

const OVERRIDE_HOST = '@cloudflare/vitest-pool-workers';

/** @param {string} path */
function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** @param {string} name */
function readInstalled(name) {
  try {
    return readJson(`${root}node_modules/${name}/package.json`);
  } catch {
    return null;
  }
}

const pkg = readJson(`${root}package.json`);
const declared = { ...pkg.dependencies, ...pkg.devDependencies };

/** @type {string[]} */
const errors = [];
/** @type {string[]} */
const ok = [];

for (const { dependency, peerOf } of PEER_CONSTRAINTS) {
  const host = readInstalled(peerOf);
  const installed = readInstalled(dependency);
  const declaredRange = declared[dependency];

  if (!host || !installed) {
    errors.push(`${peerOf} or ${dependency} is not installed – run \`npm ci\` first.`);
    continue;
  }
  if (!declaredRange) {
    errors.push(`${dependency} is not declared in package.json.`);
    continue;
  }

  const peerRange = host.peerDependencies?.[dependency];
  if (!peerRange) {
    errors.push(`${peerOf}@${host.version} no longer declares a peer dependency on ${dependency}.`);
    continue;
  }

  const problems = [];
  if (!semver.satisfies(installed.version, peerRange, { includePrerelease: true })) {
    problems.push(`installed ${dependency}@${installed.version} is outside ${peerRange}`);
  }
  if (!semver.subset(declaredRange, peerRange, { includePrerelease: true })) {
    problems.push(`declared range "${declaredRange}" is not fully inside ${peerRange}`);
  }

  if (problems.length > 0) {
    errors.push(
      `${dependency} leaves the peer range of ${peerOf}@${host.version} (peer ${dependency}@"${peerRange}"): ` +
        `${problems.join('; ')}. \`npm ci\` would fail with ERESOLVE. ` +
        `Keep ${dependency} inside the range or upgrade ${peerOf} first.`,
    );
  } else {
    ok.push(
      `${dependency}@${installed.version} ("${declaredRange}") satisfies ${peerOf} peer "${peerRange}"`,
    );
  }
}

{
  const overrideVersion = pkg.overrides?.[OVERRIDE_HOST]?.miniflare;
  const wrangler = readInstalled('wrangler');
  const miniflare = readInstalled('miniflare');

  if (!wrangler) {
    errors.push('wrangler is not installed – run `npm ci` first.');
  } else if (!overrideVersion) {
    errors.push(`package.json has no overrides["${OVERRIDE_HOST}"].miniflare entry.`);
  } else {
    const wranglerMiniflare = wrangler.dependencies?.miniflare;
    if (overrideVersion !== wranglerMiniflare) {
      errors.push(
        `Miniflare override ${overrideVersion} differs from the version wrangler@${wrangler.version} depends on ` +
          `(${wranglerMiniflare ?? 'none'}). Set overrides["${OVERRIDE_HOST}"].miniflare to "${wranglerMiniflare}" ` +
          'and run `npm install`.',
      );
    } else if (miniflare && miniflare.version !== overrideVersion) {
      errors.push(
        `Installed miniflare@${miniflare.version} does not match the override ${overrideVersion} – run \`npm install\`.`,
      );
    } else {
      ok.push(`miniflare override ${overrideVersion} matches wrangler@${wrangler.version}`);
    }
  }
}

for (const line of ok) console.log(`✓ ${line}`);
for (const line of errors) console.error(`✗ ${line}`);

if (errors.length > 0) {
  console.error(`\ncheck-deps: ${errors.length} problem(s) found.`);
  process.exit(1);
}
console.log('check-deps: all dependency constraints hold.');
