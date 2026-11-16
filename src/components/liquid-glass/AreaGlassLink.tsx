import GlassLink from './GlassLink';
import { GlassPreferences } from './preferences';

interface Props {
  name: string;
  href: string;
}

// The surrounding Astro card owns its scroll reveal. Hydrate only the native
// link's glass surface when visible, sharing the existing React/Glisse runtime.
export default function AreaGlassLink({ name, href }: Props) {
  return (
    <GlassPreferences>
      <GlassLink href={href} surfaceClassName="sc-glass-area" className="sc-area-link">
        <span className="sc-area-dot" aria-hidden="true">•</span>
        <strong>{name}</strong>
        <span className="sc-area-arrow" aria-hidden="true">→</span>
      </GlassLink>
    </GlassPreferences>
  );
}
