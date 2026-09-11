import { Check, ShieldCheck, Wrench } from 'lucide-react';

import { branding } from '../../../config/branding';
import { cn } from '../../lib/cn';
import { useServer } from '../../store/server';

/**
 * Marketing copy shown below the editor on the Studio view: the privacy model
 * and the breadth of tools. Deliberately outside the header so the working
 * area stays uncluttered while crawlers still find descriptive, visible text.
 */
export function AboutSection({ className }: { className?: string }) {
  const appName = useServer((s) => s.features.appName) || branding.name;
  const { about, features } = branding.seo;

  return (
    <section aria-labelledby="about-heading" className={cn('grid gap-4 lg:grid-cols-[2fr_3fr]', className)}>
      <h2 id="about-heading" className="sr-only">
        About {appName}
      </h2>
      <div className="panel p-5">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <ShieldCheck size={18} aria-hidden className="text-accent-600 dark:text-accent-400" />
          {about.privacy.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{about.privacy.text}</p>
      </div>
      <div className="panel p-5">
        <h3 className="flex items-center gap-2 text-base font-semibold">
          <Wrench size={18} aria-hidden className="text-brand-600 dark:text-brand-300" />
          {about.toolkit.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{about.toolkit.text}</p>
        <ul className="mt-3 grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2">
              <Check size={14} aria-hidden className="mt-1 shrink-0 text-accent-600 dark:text-accent-400" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
