/**
 * Central branding configuration.
 *
 * Change these values to rebrand the application. They are used by the UI,
 * the web app manifest, the HTTP API health endpoint and the OpenAPI document.
 * Keep this file free of runtime-specific imports so it can be shared between
 * the browser bundle, the Worker bundle and Node build scripts.
 */
export const branding = {
  /** Product name shown in the header, document title and PWA manifest. */
  name: 'FlareQR Studio',
  /** Short product name for the PWA home-screen icon. */
  shortName: 'FlareQR',
  /** One-sentence description used in meta tags and the README. */
  description:
    'Self-hosted, privacy-first QR code studio with rich styling, logo support, batch generation and an HTTP API – running on Cloudflare Workers.',
  /** Public repository URL (used for "Deploy to Cloudflare" and footer links). */
  repositoryUrl: 'https://github.com/reichiClaw/flareqr',
  /** Accent colours (hex). Also mirrored in src/app/styles/theme.css. */
  colors: {
    primary: '#2563EB',
    accent: '#14B8A6',
    dark: '#0B1220',
    light: '#F8FAFC',
  },
  /** Path of the vector logo served from the assets directory. */
  logoPath: '/icons/icon.svg',
  /** Shown in the footer. */
  tagline: 'Generated locally in your browser. Nothing is uploaded.',
  /**
   * Search-engine and link-preview metadata. Injected into index.html at build
   * time (see the `seo` plugin in vite.config.ts) and used for the Studio heading.
   */
  seo: {
    /** Appended to the app name in the document title: "<name> – <titleTagline>". */
    titleTagline: 'Free, private QR code generator',
    /** Meta description / social preview text (aim for ≤ 160 characters). */
    description:
      'Privacy-first QR code generator – everything runs in your browser, nothing is uploaded. Logos and styling, SVG/PNG/JPG export, batch CSV, dynamic links and an HTTP API.',
    /** Search keywords (JSON-LD `keywords`); pick the phrases people actually search for. */
    keywords: [
      'QR code generator',
      'privacy-first QR code',
      'QR code with logo',
      'SVG QR code',
      'batch QR codes from CSV',
      'dynamic QR codes',
      'QR code API',
      'self-hosted QR code generator',
      'open source',
      'Cloudflare Workers',
    ],
    /** Visible <h1> of the Studio view. */
    headline: 'Free, private QR code generator',
    /** One-sentence intro shown next to the headline. */
    intro:
      'Design QR codes with logos and colours, check scan reliability and export SVG, PNG or JPG – generated locally in your browser.',
    /**
     * Marketing copy shown below the editor on the Studio view and mirrored in
     * the JSON-LD `featureList` so search engines see the same message.
     */
    about: {
      privacy: {
        title: 'Privacy first',
        text: 'QR codes are generated locally in your browser – the content you enter is never uploaded, logged or tracked. No accounts, no analytics, no third-party scripts; self-host it on your own Cloudflare account.',
      },
      toolkit: { title: 'A complete QR toolkit' },
    },
    /**
     * Tools and capabilities. `label` is shown as a compact chip on the Studio
     * view (with `detail` as its tooltip); structured data lists both.
     */
    features: [
      {
        label: '20 content types',
        detail:
          'URL, text, Wi-Fi, vCard, MeCard, email, phone, SMS, WhatsApp, events, location, SEPA, Bitcoin, Ethereum, 2FA and more',
      },
      {
        label: 'Styles & gradients',
        detail: 'Module and finder styles, colours, gradients, frames and captions',
      },
      { label: 'Logos', detail: 'Logo embedding that keeps codes scannable' },
      { label: 'Scan-reliability check', detail: 'Warnings with one-click safe defaults' },
      { label: 'SVG, PNG & JPG export', detail: 'Plus clipboard and data-URL copy' },
      { label: 'Batch CSV → ZIP', detail: 'Batch generation from CSV with ZIP download' },
      { label: 'Dynamic links', detail: 'Editable short links with scan statistics' },
      { label: 'Presets & history', detail: 'Presets, undo/redo, local history and an offline-capable PWA' },
      { label: 'HTTP API', detail: 'Documented HTTP API with OpenAPI 3.1 specification' },
      { label: 'Open source', detail: 'Self-hosted on Cloudflare Workers, MIT licensed' },
    ],
    /** 1200×630 social preview image served from the assets directory (see scripts/generate-icons.mjs). */
    imagePath: '/og-image.png',
    /** Twitter/X card type. */
    twitterCard: 'summary_large_image',
  },
} as const;

export type Branding = typeof branding;
