import type { ReactNode } from 'react';
import type { Route } from './ui';
import { Icon } from './ui';

export function Brand({ go }: { go: (route: Route) => void }) {
  return (
    <a className="brand" href="/" aria-label="SENTRIQ dashboard" onClick={(event) => { event.preventDefault(); go('/'); }}>
      <span className="brand-mark"><Icon name="shield-check" size={18} /></span>
      <span className="brand-word">SENTRIQ</span>
    </a>
  );
}

export function AppHeader({ go, menuOpen, onToggleMenu, children }: { go: (route: Route) => void; menuOpen: boolean; onToggleMenu: () => void; children?: ReactNode }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <Brand go={go} />
        {children}
        <div className="header-actions">
          <span className="header-status"><i /> Local checks</span>
          <button className="header-scan" onClick={() => go('/security-scan')}>
            <Icon name="scan" size={15} /> Scan now
          </button>
        </div>
        <button className="menu-button" onClick={onToggleMenu} aria-expanded={menuOpen} aria-controls="app-navigation-drawer" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}>
          <Icon name={menuOpen ? 'close' : 'menu'} size={20} />
        </button>
      </div>
    </header>
  );
}
