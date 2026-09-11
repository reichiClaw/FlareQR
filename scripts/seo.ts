/**
 * Search-engine and link-preview assets generated at build time from
 * src/config/branding.ts: <head> metadata for index.html, robots.txt,
 * sitemap.xml and the static 404 page. Everything is optional-URL aware –
 * without SITE_URL the tags that require an absolute address are omitted.
 */
import type { HtmlTagDescriptor } from 'vite';

import { branding } from '../src/config/branding.ts';

const { seo } = branding;

/** Vite evaluates the config once per environment; warn about a bad SITE_URL only once. */
const warnedSiteUrls = new Set<string>();

/**
 * Normalises the optional public origin of the deployment (SITE_URL build
 * variable). Returns null when unset or unusable so callers can degrade
 * gracefully instead of emitting broken absolute URLs.
 */
export function resolveSiteUrl(raw: string | undefined): string | null {
  const value = raw?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new Error('unsupported protocol');
    if (url.search || url.hash) throw new Error('query strings and fragments are not allowed');
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch (error) {
    if (!warnedSiteUrls.has(value)) {
      warnedSiteUrls.add(value);
      console.warn(
        `[seo] Ignoring SITE_URL "${value}": ${error instanceof Error ? error.message : 'invalid URL'}. ` +
          'Use an absolute http(s) origin such as https://qr.example.com.',
      );
    }
    return null;
  }
}

function absolute(siteUrl: string | null, path: string): string {
  return siteUrl ? `${siteUrl}${path}` : path;
}

export function pageTitle(appName: string = branding.name): string {
  return `${appName} – ${seo.titleTagline}`;
}

function structuredData(siteUrl: string | null): string {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: branding.name,
    alternateName: branding.shortName,
    description: seo.description,
    image: absolute(siteUrl, seo.imagePath),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    keywords: seo.keywords.join(', '),
    featureList: [...seo.features],
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    license: 'https://opensource.org/license/mit',
    sameAs: [branding.repositoryUrl],
  };
  if (siteUrl) data.url = `${siteUrl}/`;
  // "<" can never terminate the script element once escaped as a JSON unicode escape.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Tags appended to <head> of index.html by the Vite `transformIndexHtml` hook. */
export function seoHeadTags(siteUrl: string | null): HtmlTagDescriptor[] {
  const title = pageTitle();
  const image = absolute(siteUrl, seo.imagePath);
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs,
    injectTo: 'head',
  });

  const tags: HtmlTagDescriptor[] = [
    { tag: 'title', children: title, injectTo: 'head' },
    meta({ name: 'description', content: seo.description }),
    meta({ name: 'application-name', content: branding.name }),
    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:site_name', content: branding.name }),
    meta({ property: 'og:title', content: title }),
    meta({ property: 'og:description', content: seo.description }),
    meta({ property: 'og:image', content: image }),
    meta({ property: 'og:image:width', content: '1200' }),
    meta({ property: 'og:image:height', content: '630' }),
    meta({ property: 'og:image:alt', content: `${branding.name} – ${seo.titleTagline}` }),
    meta({ property: 'og:locale', content: 'en_US' }),
    meta({ name: 'twitter:card', content: seo.twitterCard }),
    meta({ name: 'twitter:title', content: title }),
    meta({ name: 'twitter:description', content: seo.description }),
    meta({ name: 'twitter:image', content: image }),
  ];

  if (siteUrl) {
    tags.push(
      { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
      meta({ property: 'og:url', content: `${siteUrl}/` }),
    );
  }

  tags.push({
    tag: 'script',
    attrs: { type: 'application/ld+json' },
    children: structuredData(siteUrl),
    injectTo: 'head',
  });
  return tags;
}

/** Crawlers may index the studio but never the API or dynamic redirect links. */
export function robotsTxt(siteUrl: string | null): string {
  const lines = ['User-agent: *', 'Allow: /', 'Disallow: /api/', 'Disallow: /r/'];
  if (siteUrl) lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
  return `${lines.join('\n')}\n`;
}

/** The application is a single page; the sitemap exists for Search Console completeness. */
export function sitemapXml(siteUrl: string): string {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${escapeHtml(`${siteUrl}/`)}</loc>`,
    '    <changefreq>monthly</changefreq>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Static page served with HTTP 404 for unknown paths (`not_found_handling:
 * "404-page"` in wrangler.jsonc). Styles live in public/404.css because the
 * Content-Security-Policy forbids inline styles and scripts.
 */
export function notFoundHtml(): string {
  const name = escapeHtml(branding.name);
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="color-scheme" content="light dark" />
    <meta name="robots" content="noindex" />
    <meta name="referrer" content="no-referrer" />
    <title>Page not found – ${name}</title>
    <link rel="icon" href="${branding.logoPath}" type="image/svg+xml" />
    <link rel="stylesheet" href="/404.css" />
    <script src="/theme-init.js"></script>
  </head>
  <body>
    <main>
      <img src="${branding.logoPath}" alt="" width="64" height="64" />
      <p class="code">404</p>
      <h1>This page doesn't exist</h1>
      <p class="lead">
        There is nothing at this address. The QR code editor, batch generation, links and the admin
        area of ${name} all live on the start page.
      </p>
      <a class="cta" href="/">Open the QR code studio</a>
    </main>
  </body>
</html>
`;
}
