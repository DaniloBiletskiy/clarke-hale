import { useEffect, useState } from 'react';
import { siteConfig, type NavTarget } from '../siteConfig';

export function Header({ onNavigate }: { onNavigate: (t: NavTarget) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (t: NavTarget) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    onNavigate(t);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <a className="brand" href="#top" onClick={go('opening')} aria-label={`${siteConfig.brand.name} — back to top`}>
        <span className="brand-name">{siteConfig.brand.name}</span>
        <span className="brand-tag">{siteConfig.brand.tag}</span>
      </a>

      <button
        className="menu-btn"
        aria-expanded={open}
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <i />
        <i />
      </button>

      <nav className={`site-nav${open ? ' open' : ''}`} aria-label="Primary">
        <ul>
          {siteConfig.nav.map((n) => (
            <li key={n.target}>
              <a href={`#${n.target}`} onClick={go(n.target)}>
                {n.label}
              </a>
            </li>
          ))}
          <li>
            <a className="nav-cta" href="#contact" onClick={go('verdict')}>
              Consultation
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
