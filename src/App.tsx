import { useEffect, useState } from 'react';
import type { Route } from './components/ui';
import { AppShell } from './components/AppShell';
import { Home } from './pages/Home';
import { Assessment, Results } from './pages/Assessment';
import { Catalogue, Product } from './pages/Protection';
import { Guide } from './pages/Guides';
import { About, Legal, LegalDoc, Support } from './pages/Company';
import { SecurityScan } from './pages/SecurityScan';
import { ProductDetail, Products } from './pages/Products';
import { Admin } from './pages/Admin';
import { findProduct } from './data/products';

export default function App() {
  const [path, setPath] = useState<Route>((window.location.pathname as Route) || '/');
  const [platform, setPlatform] = useState<'Android' | 'iPhone' | ''>('');
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [scanning, setScanning] = useState(false);

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

  const startAssessment = () => {
    if (!platform) return;
    setScanning(true);
    window.setTimeout(() => {
      const timestamp = new Date().toISOString();
      try { window.localStorage.setItem('sentriq-last-assessment', timestamp); } catch { setAssessmentComplete(true); }
      setScanning(false);
      setAssessmentComplete(true);
      go('/results');
    }, 900);
  };

  const knownRoutes = ['/', '/assessment', '/results', '/security-scan', '/antivirus', '/products', '/product/guard', '/guides/android', '/guides/iphone', '/support', '/admin', '/privacy', '/about', '/terms', '/disclaimer'];
  const isKnown = knownRoutes.includes(path) || path.startsWith('/products/');

  return (
    <AppShell path={path} go={go}>
      {path === '/' && <Home go={go} />}
      {path === '/assessment' && <Assessment platform={platform} setPlatform={setPlatform} start={startAssessment} busy={scanning} />}
      {path === '/results' && <Results done={assessmentComplete} go={go} />}
      {path === '/security-scan' && <SecurityScan go={go} />}
      {path === '/products' && <Products go={go} />}
      {path.startsWith('/products/') && (() => { const product = findProduct(path.replace('/products/', '')); return product ? <ProductDetail product={product} go={go} /> : <Products go={go} />; })()}
      {path === '/antivirus' && <Catalogue go={go} />}
      {path === '/product/guard' && <Product go={go} />}
      {path === '/guides/android' && <Guide type="Android" go={go} />}
      {path === '/guides/iphone' && <Guide type="iPhone" go={go} />}
      {path === '/support' && <Support go={go} />}
      {path === '/admin' && <Admin />}
      {path === '/privacy' && <Legal />}
      {path === '/terms' && <LegalDoc kind="Terms" />}
      {path === '/disclaimer' && <LegalDoc kind="Disclaimer" />}
      {path === '/about' && <About />}
      {!isKnown && <Home go={go} />}
    </AppShell>
  );
}
