import { useState, type ReactNode } from 'react';
import type { Route } from './ui';
import { Icon, type IconName } from './ui';

type NavItem = { label: string; route: Route; icon: IconName };

const navItems: NavItem[] = [
  { label: 'Home', route: '/', icon: 'home' },
  { label: 'Scan', route: '/security-scan', icon: 'scan' },
  { label: 'Protection', route: '/products', icon: 'shield-check' },
  { label: 'Guides', route: '/guides/android', icon: 'book' },
  { label: 'Support', route: '/support', icon: 'chat' },
];

export function Brand({ go }: { go: (route: Route) => void }) {
  return (
    <a className="brand" href="/" aria-label="SENTRIQ home" onClick={(event) => { event.preventDefault(); go('/'); }}>
      <span className="brand-mark"><Icon name="shield-check" size={20} /></span>
      <span>SENTRIQ<span className="brand-dot">.</span></span>
    </a>
  );
}

export function AppShell({ path, go, children }: { path: Route; go: (route: Route) => void; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (route: Route) => { go(route); setMenuOpen(false); };
  const isActive = (route: Route) => {
    if (route === '/') return path === '/';
    if (route === '/guides/android') return path.startsWith('/guides/');
    return path === route || path.startsWith(`${route}/`);
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <Brand go={navigate} />
          <nav className="top-nav" aria-label="Main navigation">
            {navItems.map(item => (
              <a key={item.route} href={item.route} aria-current={isActive(item.route) ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(item.route); }}>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <span className="header-status"><i /> Protection ready</span>
            <button className="primary-button header-cta" onClick={() => navigate('/security-scan')}>
              <Icon name="scan" size={16} /> Run scan
            </button>
          </div>
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
          </button>
        </div>
        {menuOpen && (
          <nav className="mobile-menu" aria-label="Mobile navigation">
            {navItems.map(item => (
              <a key={item.route} href={item.route} aria-current={isActive(item.route) ? 'page' : undefined} onClick={(event) => { event.preventDefault(); navigate(item.route); }}>
                <Icon name={item.icon} size={18} /> {item.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <div className="footer-inner">
          <div>
            <Brand go={navigate} />
            <p>Clear mobile security guidance. Independent by design.</p>
          </div>
          <nav aria-label="Footer navigation">
            <a href="/about" onClick={(event) => { event.preventDefault(); navigate('/about'); }}>About</a>
            <a href="/privacy" onClick={(event) => { event.preventDefault(); navigate('/privacy'); }}>Privacy</a>
            <a href="/terms" onClick={(event) => { event.preventDefault(); navigate('/terms'); }}>Terms</a>
            <a href="/disclaimer" onClick={(event) => { event.preventDefault(); navigate('/disclaimer'); }}>Disclaimer</a>
            <a href="/admin" onClick={(event) => { event.preventDefault(); navigate('/admin'); }}>Admin</a>
          </nav>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SENTRIQ. Independent mobile security guidance.</span>
          <span>Not affiliated with any listed provider.</span>
        </div>
      </footer>

      <nav className="bottom-nav" aria-label="Bottom navigation">
        {navItems.map(item => (
          <button key={item.route} className={isActive(item.route) ? 'active' : ''} aria-current={isActive(item.route) ? 'page' : undefined} onClick={() => navigate(item.route)}>
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
