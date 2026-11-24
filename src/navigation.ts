import type { IconName, Route } from './components/ui';

export type PrimaryNavId = 'dashboard' | 'security' | 'tools' | 'settings';

export type PrimaryNavItem = {
  id: PrimaryNavId;
  label: string;
  route: Route;
  icon: IconName;
};

export const primaryNavItems: PrimaryNavItem[] = [
  { id: 'dashboard', label: 'Dashboard', route: '/', icon: 'home' },
  { id: 'security', label: 'Security', route: '/security-scan', icon: 'shield-check' },
  { id: 'tools', label: 'Tools', route: '/tools', icon: 'grid' },
  { id: 'settings', label: 'Settings', route: '/settings', icon: 'settings' },
];

export const secondaryLinks: { label: string; route: Route; group: 'Discover' | 'Guidance' | 'Account' }[] = [
  { label: 'Product directory', route: '/products', group: 'Discover' },
  { label: 'Protection overview', route: '/product/guard', group: 'Discover' },
  { label: 'Security catalogue', route: '/antivirus', group: 'Discover' },
  { label: 'Security tools', route: '/tools', group: 'Discover' },
  { label: 'Android guide', route: '/guides/android', group: 'Guidance' },
  { label: 'iPhone guide', route: '/guides/iphone', group: 'Guidance' },
  { label: 'Device assessment', route: '/assessment', group: 'Guidance' },
  { label: 'Assessment results', route: '/results', group: 'Guidance' },
  { label: 'Trusted Advisor', route: '/trusted-advisor', group: 'Guidance' },
  { label: 'Support', route: '/support', group: 'Account' },
  { label: 'About SENTRIQ', route: '/about', group: 'Account' },
  { label: 'Privacy', route: '/privacy', group: 'Account' },
  { label: 'Terms', route: '/terms', group: 'Account' },
  { label: 'Disclaimer', route: '/disclaimer', group: 'Account' },
  { label: 'Admin', route: '/admin', group: 'Account' },
];

export const knownRoutes: Route[] = [
  '/', '/assessment', '/results', '/security-scan', '/trusted-advisor', '/tools', '/antivirus', '/products',
  '/product/guard', '/guides/android', '/guides/iphone', '/support', '/settings',
  '/admin', '/privacy', '/about', '/terms', '/disclaimer',
];

export function isPrimaryNavActive(id: PrimaryNavId, path: Route): boolean {
  switch (id) {
    case 'dashboard':
      return path === '/';
    case 'security':
      return path === '/security-scan' || path === '/assessment' || path === '/results' || path === '/trusted-advisor';
    case 'tools':
      return path === '/tools' || path.startsWith('/tools/') || path === '/products' || path.startsWith('/products/') || path === '/antivirus' || path === '/product/guard' || path.startsWith('/guides/');
    case 'settings':
      return path === '/settings' || path === '/support' || path === '/admin' || path === '/privacy' || path === '/about' || path === '/terms' || path === '/disclaimer';
  }
}
