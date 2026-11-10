import GlassLink from './GlassLink';
import { GlassPreferences } from './preferences';

interface Props {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'light';
  ariaLabel?: string;
  showArrow?: boolean;
}

// Native links are server-rendered; below-the-fold instances hydrate only
// when visible. The shared React/Glisse runtime is downloaded once per page.
export default function GlassAction({ href, label, variant = 'primary', ariaLabel, showArrow = false }: Props) {
  return (
    <GlassPreferences>
      <div className="sc-glass-action" data-theme="light">
        <GlassLink href={href} variant={variant} aria-label={ariaLabel}>
          {label}{showArrow && <> <span aria-hidden="true">→</span></>}
        </GlassLink>
      </div>
    </GlassPreferences>
  );
}
