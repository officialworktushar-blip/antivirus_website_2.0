import { useEffect, useState, type ReactNode } from 'react';
import type { Route } from './ui';
import { AppHeader } from './AppHeader';
import { AppFooter, BottomNav, DesktopNav, NavigationDrawer } from './AppNavigation';
import { PageContainer } from './PageContainer';

export function AppShell({ path, go, children }: { path: Route; go: (route: Route) => void; children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (route: Route) => {
    go(route);
    setMenuOpen(false);
  };

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <AppHeader go={navigate} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)}>
        <DesktopNav path={path} go={navigate} />
      </AppHeader>

      {menuOpen && (
        <>
          <button className="drawer-backdrop" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />
          <NavigationDrawer path={path} go={navigate} />
        </>
      )}

      <main className="app-main" data-route={path} id="main-content">
        <PageContainer>{children}</PageContainer>
      </main>

      <AppFooter go={navigate} />
      <BottomNav path={path} go={navigate} />
    </div>
  );
}
