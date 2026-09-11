import { branding } from '../../../config/branding';
import { AboutTooltip } from './AboutTooltip';

export function Footer() {
  return (
    <footer className="border-t border-default py-4 text-xs text-muted">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-3 sm:px-5">
        <AboutTooltip />
        <p className="flex flex-wrap items-center gap-3">
          <a href="/openapi.yaml" className="hover:text-fg">
            API (OpenAPI)
          </a>
          <a
            href={branding.repositoryUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="hover:text-fg"
          >
            Source code
          </a>
          <span>
            {branding.name} by reichi v{__APP_VERSION__}
          </span>
        </p>
      </div>
    </footer>
  );
}
