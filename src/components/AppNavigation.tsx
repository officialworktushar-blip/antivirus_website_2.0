import type { ComponentProps } from 'react';
import type { Route } from './ui';
import { Icon } from './ui';
import { isPrimaryNavActive, primaryNavItems, secondaryLinks } from '../navigation';

function NavLink({ route, label, icon, active, go }: { route: Route; label: string; icon?: ComponentProps<typeof Icon>['name']; active: boolean; go: (route: Route) => void }) {
  return (
    <a href={route} aria-current={active ? 'page' : undefined} onClick={(event) => { event.preventDefault(); go(route); }}>
      {icon && <Icon name={icon} size={18} />}
      <span>{label}</span>
    </a>
  );
}

export function DesktopNav({ path, go }: { path: Route; go: (route: Route) => void }) {
  return (
    <nav className="desktop-nav" aria-label="Primary navigation">
      {primaryNavItems.map(item => (
        <NavLink key={item.id} route={item.route} label={item.label} active={isPrimaryNavActive(item.id, path)} go={go} />
      ))}
    </nav>
  );
}

export function BottomNav({ path, go }: { path: Route; go: (route: Route) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {primaryNavItems.map(item => {
        const active = isPrimaryNavActive(item.id, path);
        return (
          <button key={item.id} className={`bottom-nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} onClick={() => go(item.route)}>
            <span className="bottom-nav-icon"><Icon name={item.icon} size={20} /></span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function NavigationDrawer({ path, go }: { path: Route; go: (route: Route) => void }) {
  const groups = ['Discover', 'Guidance', 'Account'] as const;

  return (
    <nav className="navigation-drawer" id="app-navigation-drawer" aria-label="All navigation">
      <div className="drawer-section">
        <span className="drawer-label">MAIN</span>
        {primaryNavItems.map(item => (
          <NavLink key={item.id} route={item.route} label={item.label} icon={item.icon} active={isPrimaryNavActive(item.id, path)} go={go} />
        ))}
      </div>
      {groups.map(group => (
        <div className="drawer-section" key={group}>
          <span className="drawer-label">{group.toUpperCase()}</span>
          {secondaryLinks.filter(link => link.group === group).map(link => (
            <NavLink key={link.route} route={link.route} label={link.label} active={path === link.route} go={go} />
          ))}
        </div>
      ))}
    </nav>
  );
}

export function AppFooter({ go }: { go: (route: Route) => void }) {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-brand"><span className="brand-mark"><Icon name="shield-check" size={18} /></span><span>SENTRIQ</span></div>
        <div className="footer-links">
          {secondaryLinks.filter(link => link.group === 'Account').map(link => (
            <a key={link.route} href={link.route} onClick={(event) => { event.preventDefault(); go(link.route); }}>{link.label}</a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 SENTRIQ. Independent mobile security guidance.</span>
        <span>Not affiliated with any listed provider.</span>
      </div>
    </footer>
  );
}
