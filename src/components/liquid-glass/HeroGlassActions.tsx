import GlassLink from './GlassLink';
import { GlassPreferences } from './preferences';

export default function HeroGlassActions() {
  return (
    <GlassPreferences>
      <div className="sc-glass-actions" data-theme="light">
        <GlassLink href="#quote" variant="primary">Request a Quote</GlassLink>
        <GlassLink href="tel:+19258341815" variant="secondary">Call (925) 834-1815</GlassLink>
      </div>
    </GlassPreferences>
  );
}
