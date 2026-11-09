import { Glass } from 'glisse';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
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

  return (
    <Surface
      className={surfaceClass}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        const element = event.currentTarget;
        const box = element.getBoundingClientRect();
        if (!box.width || !box.height) return;
        element.style.setProperty('--lg-x', `${((event.clientX - box.left) / box.width) * 100}%`);
        element.style.setProperty('--lg-y', `${((event.clientY - box.top) / box.height) * 100}%`);
        element.dataset.pressed = '';
      }}
      onPointerUp={(event) => delete event.currentTarget.dataset.pressed}
      onPointerCancel={(event) => delete event.currentTarget.dataset.pressed}
      onPointerLeave={(event) => delete event.currentTarget.dataset.pressed}
      onBlur={(event) => delete event.currentTarget.dataset.pressed}
    >
      <a {...props} className={`sc-glass-link ${className}`}>
        {children}
      </a>
    </Surface>
  );
}
