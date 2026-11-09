import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

const EffectsContext = createContext(false);

export function GlassPreferences({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const queries = [
      matchMedia('(prefers-reduced-motion: reduce)'),
      matchMedia('(prefers-reduced-transparency: reduce)'),
      matchMedia('(forced-colors: active)'),
    ];
    const update = () => setEnabled(typeof ResizeObserver !== 'undefined' && !queries.some((query) => query.matches));
    const releasePress = () => document.querySelectorAll<HTMLElement>('.sc-glass-control[data-pressed]').forEach((element) => delete element.dataset.pressed);
    update();
    queries.forEach((query) => query.addEventListener('change', update));
    window.addEventListener('blur', releasePress);
    return () => {
      queries.forEach((query) => query.removeEventListener('change', update));
      window.removeEventListener('blur', releasePress);
    };
  }, []);

  return <EffectsContext.Provider value={enabled}>{children}</EffectsContext.Provider>;
}

export function useGlassEffects() {
  return useContext(EffectsContext);
}
