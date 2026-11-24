import { useEffect, useState } from 'react';
import type { Route } from './components/ui';
import { AppShell } from './components/AppShell';
import { Home } from './pages/Home';
import { Guide } from './pages/Guides';
import { About, Disclaimer, Help, Privacy, Terms } from './pages/Company';
import { Support } from './pages/Support';
import { SecurityScan } from './pages/SecurityScan';
import { ProductDetail, Products } from './pages/Products';
import { Admin } from './pages/Admin';
import { findProduct } from './data/products';
import { knownRoutes } from './navigation';
import { Settings } from './pages/Settings';
import { ScanResults } from './pages/ScanResults';
import { TrustedAdvisor } from './pages/TrustedAdvisor';
import { Tools, ToolDetail } from './pages/Tools';
import { findTool } from './data/tools';

export default function App() {
  const [path, setPath] = useState<Route>((window.location.pathname as Route) || '/');

  useEffect(() => {
    const handlePopState = () => setPath((window.location.pathname as Route) || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const go = (destination: Route) => {
    window.history.pushState({}, '', destination);
    setPath(destination);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isKnown = knownRoutes.includes(path) || path.startsWith('/products/') || path.startsWith('/tools/');

  return (
    <AppShell path={path} go={go}>
      {path === '/' && <Home go={go} />}
      {path === '/results' && <ScanResults go={go} />}
      {path === '/trusted-advisor' && <TrustedAdvisor go={go} />}
      {path === '/tools' && <Tools go={go} />}
      {path.startsWith('/tools/') && (() => { const tool = findTool(path.replace('/tools/', '')); return tool ? <ToolDetail tool={tool} go={go} /> : <Tools go={go} />; })()}
      {path === '/security-scan' && <SecurityScan go={go} />}
      {path === '/security-scan/real' && <SecurityScan go={go} onlyReal />}
      {path === '/products' && <Products go={go} />}
      {path.startsWith('/products/') && (() => { const product = findProduct(path.replace('/products/', '')); return product ? <ProductDetail product={product} go={go} /> : <Products go={go} />; })()}
      {path === '/guides/android' && <Guide type="Android" go={go} />}
      {path === '/guides/iphone' && <Guide type="iPhone" go={go} />}
      {path === '/support' && <Support go={go} />}
      {path === '/settings' && <Settings go={go} />}
      {path === '/admin' && <Admin />}
      {path === '/privacy' && <Privacy go={go} />}
      {path === '/terms' && <Terms go={go} />}
      {path === '/disclaimer' && <Disclaimer go={go} />}
      {path === '/help' && <Help go={go} />}
      {path === '/about' && <About go={go} />}
      {!isKnown && <Home go={go} />}
    </AppShell>
  );
}
