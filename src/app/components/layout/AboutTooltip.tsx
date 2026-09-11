import { ShieldCheck, Wrench } from 'lucide-react';

import { branding } from '../../../config/branding';

/**
 * Footer trigger "Generated locally in your browser. Nothing is uploaded." with
 * a hover/focus tooltip holding the privacy explanation and the feature list.
 * The tooltip is always in the DOM (crawlers read it) but absolutely
 * positioned, so it takes no space in the layout.
 */
export function AboutTooltip() {
  const { about, features } = branding.seo;

  return (
    <div className="group relative inline-flex">
      <button
        type="button"
        aria-describedby="about-tooltip"
        className="inline-flex items-center gap-1.5 rounded-md text-left hover:text-fg focus-visible:text-fg"
        data-testid="about-trigger"
      >
        <ShieldCheck size={14} aria-hidden />
        {branding.tagline}
      </button>
      <div
        id="about-tooltip"
        role="tooltip"
        className="panel invisible absolute bottom-full left-0 z-40 mb-2 w-[min(32rem,calc(100vw-1.5rem))] p-4 text-left text-sm text-fg opacity-0 transition-opacity duration-150 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        <h2 className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck size={16} aria-hidden className="text-accent-600 dark:text-accent-400" />
          {about.privacy.title}
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-muted">{about.privacy.text}</p>
        <h2 className="mt-3 flex items-center gap-1.5 font-semibold">
          <Wrench size={16} aria-hidden className="text-brand-600 dark:text-brand-300" />
          {about.toolkit.title}
        </h2>
        <ul className="mt-1.5 flex flex-wrap gap-1.5">
          {features.map((feature) => (
            <li
              key={feature.label}
              title={feature.detail}
              className="rounded-md bg-surface-3 px-2 py-0.5 text-xs text-fg"
            >
              {feature.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
