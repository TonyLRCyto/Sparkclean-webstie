import { Button } from 'glisse';
import { GlassPreferences, useGlassEffects } from './preferences';

function SubmitControl() {
  const enhanced = useGlassEffects();
  const Control = enhanced ? Button : 'button';

  return (
    <Control type="submit" className="sc-glass-control sc-glass-primary sc-glass-submit" data-theme="light">
      Prepare Email Request
    </Control>
  );
}

export default function GlassSubmitButton() {
  return <GlassPreferences><SubmitControl /></GlassPreferences>;
}
