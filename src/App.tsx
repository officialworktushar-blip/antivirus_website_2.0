import { useEffect, useState } from 'react';
import type { Route } from './components/ui';
import { Icon } from './components/ui';
import { Home } from './pages/Home';
import { Assessment, Results } from './pages/Assessment';
import { Catalogue, Product } from './pages/Protection';
import { Guide } from './pages/Guides';
import { About, Legal, LegalDoc, Support } from './pages/Company';
import { SecurityScan } from './pages/SecurityScan';
import { ProductDetail, Products } from './pages/Products';
import { findProduct } from './data/products';

type NavigationItem = { label: string; href: Route | '#services' | '#products'; section?: string };
const navigation: NavigationItem[] = [
  { label: 'Home', href: '/' }, { label: 'Security Scan', href: '/security-scan' },
  { label: 'Protection', href: '#services', section: 'services' }, { label: 'Products', href: '/products' },
  { label: 'Support', href: '/support' },
];

export default function App() {
  const [path, setPath] = useState<Route>((window.location.pathname as Route) || '/');
  const [menuOpen, setMenuOpen] = useState(false);
  const [platform, setPlatform] = useState<'Android' | 'iPhone' | ''>('');
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const handlePopState = () => { setPath((window.location.pathname as Route) || '/'); setMenuOpen(false); };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const go = (destination: Route) => {
    window.history.pushState({}, '', destination);
    setPath(destination);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/');
      setPath('/');
      window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const localLink = (destination: Route, label: string) => (
    <a href={destination} onClick={(event) => { event.preventDefault(); go(destination); }}>{label}</a>
  );

  const startAssessment = () => {
    if (!platform) return;
    setScanning(true);
    window.setTimeout(() => {
      const timestamp = new Date().toISOString();
      try { window.localStorage.setItem('sentriq-last-assessment', timestamp); } catch { /* Keep the assessment usable if storage is disabled. */ }
      setScanning(false);
      setAssessmentComplete(true);
      go('/results');
    }, 900);
  };

  return <div className="app-shell">
    <div className="topline"><span><i className="status-dot"/> Mobile Security &amp; Digital Protection</span><span className="topline-right">Independent guidance <b className="top-sep">/</b> Privacy first <b className="top-sep">/</b> Made for mobile</span></div>
    <header className="site-header">
      <a className="brand" href="/" onClick={event => { event.preventDefault(); go('/'); }} aria-label="SENTRIQ home"><span className="brand-mark"><Icon name="shield" size={21}/></span><span>SENTRIQ<span className="brand-period">.</span></span></a>
      <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`} aria-label="Main navigation">
        {navigation.map(item => <a key={item.label} href={item.href} aria-current={!item.section && path === item.href ? 'page' : undefined} onClick={event => { event.preventDefault(); item.section ? scrollTo(item.section) : go(item.href as Route); }}>{item.label}</a>)}
      </nav>
      <div className="header-actions"><button className="button button-small button-primary" onClick={() => go('/security-scan')}>Check my device <Icon name="arrow" size={16}/></button></div>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}><Icon name={menuOpen ? 'close' : 'menu'}/></button>
    </header>

    <main>
      {path === '/' && <Home go={go}/>}
      {path === '/assessment' && <Assessment platform={platform} setPlatform={setPlatform} start={startAssessment} busy={scanning}/>}
      {path === '/results' && <Results done={assessmentComplete} go={go}/>}
      {path === '/security-scan' && <SecurityScan go={go}/>}
      {path === '/products' && <Products go={go}/>}
      {path.startsWith('/products/') && (() => { const product = findProduct(path.replace('/products/', '')); return product ? <ProductDetail product={product} go={go}/> : <Products go={go}/>; })()}
      {path === '/antivirus' && <Catalogue go={go}/>}
      {path === '/product/guard' && <Product go={go}/>}
      {path === '/guides/android' && <Guide type="Android" go={go}/>}
      {path === '/guides/iphone' && <Guide type="iPhone" go={go}/>}
      {path === '/support' && (
        <Support go={go}/>
      )}
      {path === '/privacy' && <Legal/>}
      {path === '/terms' && <LegalDoc kind="Terms"/>}
      {path === '/disclaimer' && <LegalDoc kind="Disclaimer"/>}
      {path === '/about' && <About/>}
      {!['/', '/assessment', '/results', '/security-scan', '/antivirus', '/products', '/product/guard', '/guides/android', '/guides/iphone', '/support', '/privacy', '/about', '/terms', '/disclaimer'].includes(path) && !path.startsWith('/products/') && <Home go={go}/>}
    </main>

    <footer className="site-footer sq-footer">
      <div className="footer-main">
        <div className="footer-brand"><a className="brand" href="/" onClick={event => { event.preventDefault(); go('/'); }}><span className="brand-mark"><Icon name="shield" size={21}/></span><span>SENTRIQ<span className="brand-period">.</span></span></a><p>Clear guidance for a<br/>safer digital life.</p><span className="footer-note"><Icon name="lock" size={14}/> Privacy comes first</span></div>
        <div className="footer-col"><h4>Explore</h4>{localLink('/about','About SENTRIQ')}{localLink('/security-scan','Security scan')}{localLink('/support','Contact support')}</div>
        <div className="footer-col"><h4>Information</h4>{localLink('/privacy','Privacy policy')}{localLink('/terms','Terms of use')}{localLink('/disclaimer','Disclaimer')}</div>
        <div className="footer-col"><h4>Product directory</h4>{localLink('/products','All providers')}<a href="https://www.bitdefender.com/en-us/consumer/mobile-security-android" target="_blank" rel="noopener noreferrer">Bitdefender</a><a href="https://www.malwarebytes.com/mobile" target="_blank" rel="noopener noreferrer">Malwarebytes</a><a href="https://us.norton.com/products/norton-360-for-mobile" target="_blank" rel="noopener noreferrer">Norton 360</a><a href="https://www.avast.com/en-us/avast-one" target="_blank" rel="noopener noreferrer">Avast One</a></div>
      </div>
      <div className="footer-bottom"><span>© 2026 SENTRIQ. Independent mobile security guidance.</span><span>We are not affiliated with any provider listed.</span></div>
    </footer>
  </div>;
}
