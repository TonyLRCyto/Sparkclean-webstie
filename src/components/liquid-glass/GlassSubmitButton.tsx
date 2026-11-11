import { Button } from 'glisse';
import { GlassPreferences, useGlassEffects } from './preferences';

function SubmitControl({ label }: { label: string }) {
  const enhanced = useGlassEffects();
  const Control = enhanced ? Button : 'button';

  return (
    <Control type="submit" className="sc-glass-control sc-glass-primary sc-glass-submit" data-theme="light">
      {label}
    </Control>
  );
}

export default function GlassSubmitButton({ label = 'Prepare Email Request' }: { label?: string }) {
  return <GlassPreferences><SubmitControl label={label} /></GlassPreferences>;
}
