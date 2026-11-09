import GlassLink from './GlassLink';
import { GlassPreferences } from './preferences';

interface Props {
  href: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'light';
}

// Native links are server-rendered; below-the-fold instances hydrate only
// when visible. The shared React/Glisse runtime is downloaded once per page.
export default function GlassAction({ href, label, variant = 'primary' }: Props) {
  return (
    <GlassPreferences>
      <div className="sc-glass-action" data-theme="light">
        <GlassLink href={href} variant={variant}>{label}</GlassLink>
      </div>
    </GlassPreferences>
  );
}
