import { Glass } from 'glisse';
import type { AnchorHTMLAttributes, PointerEvent, ReactNode } from 'react';
import { useGlassEffects } from './preferences';

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'icon' | 'light';
  compact?: boolean;
  className?: string;
}

export default function GlassLink({ children, variant = 'secondary', compact = false, className = '', ...props }: Props) {
  const enhanced = useGlassEffects();
  const Surface = enhanced ? Glass : 'div';
  const surfaceClass = `sc-glass-control sc-glass-${variant}${compact ? ' sc-glass-compact' : ''}`;
  const positionLight = (event: PointerEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const box = element.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const x = `${((event.clientX - box.left) / box.width) * 100}%`;
    const y = `${((event.clientY - box.top) / box.height) * 100}%`;
    element.style.setProperty('--lg-x', x);
    element.style.setProperty('--lg-y', y);
    element.style.setProperty('--sc-light-x', x);
    element.style.setProperty('--sc-light-y', y);
  };

  return (
    <Surface
      className={surfaceClass}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        if (enhanced) positionLight(event);
        event.currentTarget.dataset.pressed = '';
      }}
      onPointerMove={(event) => {
        if (enhanced && event.pointerType === 'mouse') positionLight(event);
      }}
      onPointerUp={(event) => delete event.currentTarget.dataset.pressed}
      onPointerCancel={(event) => delete event.currentTarget.dataset.pressed}
      onPointerLeave={(event) => {
        delete event.currentTarget.dataset.pressed;
        event.currentTarget.style.removeProperty('--sc-light-x');
        event.currentTarget.style.removeProperty('--sc-light-y');
      }}
      onBlur={(event) => delete event.currentTarget.dataset.pressed}
    >
      <a {...props} className={`sc-glass-link ${className}`}>
        {children}
      </a>
    </Surface>
  );
}
