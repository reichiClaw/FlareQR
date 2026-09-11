import { ShieldCheck, Wrench } from 'lucide-react';

import { branding } from '../../../config/branding';
import { cn } from '../../lib/cn';
import { useServer } from '../../store/server';

/**
 * Compact marketing strip shown below the editor on the Studio view: the
 * privacy model and the breadth of tools. Deliberately outside the header and
 * kept slim so the editor keeps the space; crawlers still find visible text.
 */
export function AboutSection({ className }: { className?: string }) {
  const appName = useServer((s) => s.features.appName) || branding.name;
  const { about, features } = branding.seo;

  return (
    <section
      aria-labelledby="about-heading"
      className={cn('panel grid gap-4 p-4 text-sm md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]', className)}
    >
      <h2 id="about-heading" className="sr-only">
        About {appName}
      </h2>
      <div>
        <h3 className="flex items-center gap-1.5 font-semibold">
          <ShieldCheck size={16} aria-hidden className="text-accent-600 dark:text-accent-400" />
          {about.privacy.title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-muted">{about.privacy.text}</p>
      </div>
      <div>
        <h3 className="flex items-center gap-1.5 font-semibold">
          <Wrench size={16} aria-hidden className="text-brand-600 dark:text-brand-300" />
          {about.toolkit.title}
        </h3>
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
    </section>
  );
}
