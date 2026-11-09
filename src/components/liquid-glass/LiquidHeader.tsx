import { Button, Glass } from 'glisse';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import GlassLink from './GlassLink';
import { GlassPreferences, useGlassEffects } from './preferences';

const links = [
  { href: '/#services', label: 'Services' },
  { href: '/#results', label: 'Our Work' },
  { href: '/service-areas/', label: 'Service Areas' },
  { href: '/about/', label: 'About' },
];

function pageSelection(pathname: string, hash: string): number | null {
  if (pathname.startsWith('/service-areas')) return 2;
  if (pathname.startsWith('/about')) return 3;
  if (/^\/(recurring|deep|move-in-move-out|post-construction)-cleaning-/.test(pathname)) return 0;
  if (pathname === '/' && hash === '#services') return 0;
  if (pathname === '/' && hash === '#results') return 1;
  return null;
}

function GlassNavigation() {
  const enhanced = useGlassEffects();
  const nav = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const [lens, setLens] = useState({ x: 0, width: 0 });
  const selected = focused ?? hovered ?? active;

  useEffect(() => {
    const sync = () => {
      if (location.pathname !== '/') {
        setActive(pageSelection(location.pathname, location.hash));
        return;
      }
      const y = Math.max(110, innerHeight * 0.35);
      const index = ['services', 'results'].findIndex((id) => {
        const box = document.getElementById(id)?.getBoundingClientRect();
        return box && box.top <= y && box.bottom > y;
      });
      setActive(index === -1 ? null : index);
    };
    let frame = 0;
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; sync(); });
    };
    sync();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('hashchange', sync);
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  useEffect(() => {
    const element = nav.current;
    if (!element || selected == null) return;
    const measure = () => {
      const link = element.querySelectorAll<HTMLAnchorElement>('.sc-nav-link')[selected];
      if (link) setLens({ x: link.offsetLeft, width: link.offsetWidth });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('.sc-nav-link').forEach((link) => observer.observe(link));
    return () => observer.disconnect();
  }, [selected]);

  const showLens = selected != null && lens.width > 0;
  const Surface = enhanced && showLens ? Glass : 'div';
  const style = { '--sc-lens-x': `${lens.x}px`, '--sc-lens-width': `${lens.width}px` } as CSSProperties;

  return (
    <nav
      ref={nav}
      className="desktop-nav sc-glass-nav"
      aria-label="Primary navigation"
      onPointerLeave={() => setHovered(null)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(null); }}
    >
      <div className="sc-nav-bed" data-glisse-backdrop="" aria-hidden="true" />
      <Surface className="sc-nav-lens" data-visible={showLens ? '' : undefined} style={style} aria-hidden="true" />
      {links.map((link, index) => (
        <a
          key={link.href}
          className="sc-nav-link"
          href={link.href}
          aria-current={active === index ? (index < 2 ? 'location' : 'page') : undefined}
          onPointerEnter={(event) => { if (event.pointerType === 'mouse') setHovered(index); }}
          onFocus={() => setFocused(index)}
        >{link.label}</a>
      ))}
    </nav>
  );
}

function HeaderContents({ instagramUrl }: { instagramUrl: string }) {
  const enhanced = useGlassEffects();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const menuIcon = <svg viewBox="0 0 24 24" aria-hidden="true"><path d={open ? 'M6 6L18 18M18 6L6 18' : 'M4 6H20M4 12H20M4 18H20'} /></svg>;
  const menuProps = {
    ref: button,
    className: 'menu-button sc-glass-menu-button',
    'aria-expanded': open,
    'aria-controls': 'mobile-menu',
    'aria-label': open ? 'Close menu' : 'Open menu',
    onClick: () => setOpen((value: boolean) => !value),
  };

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 40);
    const desktop = matchMedia('(min-width: 1021px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    update();
    window.addEventListener('scroll', update, { passive: true });
    desktop.addEventListener('change', resize);
    return () => {
      window.removeEventListener('scroll', update);
      desktop.removeEventListener('change', resize);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const alreadyLocked = document.body.classList.contains('menu-open');
    document.body.classList.add('menu-open');
    const background = [...document.querySelectorAll<HTMLElement>('main, .site-footer')].map((element) => ({ element, inert: element.inert }));
    background.forEach(({ element }) => { element.inert = true; });
    panel.current?.querySelector<HTMLAnchorElement>('a')?.focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        button.current?.focus();
      }
      if (event.key !== 'Tab') return;
      const items = [button.current, ...Array.from(panel.current?.querySelectorAll<HTMLAnchorElement>('a[href]') || [])].filter((item): item is HTMLButtonElement | HTMLAnchorElement => !!item);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => {
      if (!alreadyLocked) document.body.classList.remove('menu-open');
      background.forEach(({ element, inert }) => { element.inert = inert; });
      document.removeEventListener('keydown', keydown);
    };
  }, [open]);

  return (
    <header className={`site-header${compact ? ' is-compact' : ''}`} data-theme="light">
      <div className="header-shell">
        <a className="brand" href="/" aria-label="Sparkclean home">
          <img className="brand-logo" src="/images/sparkclean-logo.png" alt="" width="640" height="640" />
        </a>

        <GlassNavigation />

        <div className="header-actions">
          {instagramUrl && (
            <GlassLink variant="icon" href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Visit Sparkclean on Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4.25" />
                <circle className="instagram-dot" cx="17.4" cy="6.7" r="1" />
              </svg>
            </GlassLink>
          )}
          <GlassLink variant="primary" compact href="/contact/" className="header-cta">Request a Quote</GlassLink>
        </div>

        {enhanced
          ? <Button {...menuProps} icon={menuIcon} />
          : <button {...menuProps} type="button">{menuIcon}</button>}
      </div>

      <div ref={panel} className="mobile-menu" id="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile navigation">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          {instagramUrl && <a href={instagramUrl} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>Instagram</a>}
          <a href="tel:+19258341815" onClick={() => setOpen(false)}>Call (925) 834-1815</a>
          <a className="button button-primary" href="/contact/" onClick={() => setOpen(false)}>Request a Quote</a>
        </nav>
      </div>
    </header>
  );
}

export default function LiquidHeader(props: { instagramUrl: string }) {
  return <GlassPreferences><HeaderContents {...props} /></GlassPreferences>;
}
