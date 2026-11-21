import { useMemo, useState } from 'react';
import { Eyebrow, Icon, PageIntro } from '../components/ui';
import type { Route } from '../components/ui';
import { productFilters, products, type ProductFilter, type SecurityProduct } from '../data/products';

type Props = { go: (route: Route) => void };

const qualifies = (product: SecurityProduct, filter: ProductFilter) => {
  if (filter === 'android') return product.platforms.includes('Android');
  if (filter === 'ios') return product.platforms.includes('iOS');
  if (filter === 'cross-platform') return product.platforms.length > 1;
  return product.features.some(feature => feature.category === filter);
};

export function Products({ go }: Props) {
  const [active, setActive] = useState<ProductFilter[]>([]);
  const visible = useMemo(() => products.filter(product => active.every(filter => qualifies(product, filter))), [active]);
  const toggle = (filter: ProductFilter) => setActive(current => current.includes(filter) ? current.filter(item => item !== filter) : [...current, filter]);
  return <>
    <PageIntro eyebrow="INDEPENDENT PRODUCT DIRECTORY" title="Mobile protection," accent="clearly compared." text="Explore official product information and downloads from established providers. Features, compatibility, and availability can vary by plan, region, and operating system."/>
    <section className="products-page section-wrap">
      <div className="products-disclosure"><Icon name="globe" size={18}/><span><b>Independent directory</b><small>SENTRIQ is not affiliated with these providers. Product names, logos, and links point to their official sites or official app stores.</small></span></div>
      <div className="product-filter-row"><div><span>FILTER PRODUCTS</span><b>{visible.length} available</b></div><div className="product-filter-list">{productFilters.map(filter => <button key={filter.id} className={active.includes(filter.id) ? 'active' : ''} onClick={() => toggle(filter.id)} aria-pressed={active.includes(filter.id)}>{filter.label}</button>)}</div></div>
      <div className="product-directory-grid">{visible.map(product => <ProductCard key={product.slug} product={product} go={go}/>)}</div>
      {visible.length === 0 && <div className="product-empty"><Icon name="scan" size={22}/><h2>No products match every selected filter.</h2><p>Remove a filter to see the full directory.</p><button className="sq-text-link" onClick={() => setActive([])}>Clear filters <Icon name="close" size={15}/></button></div>}
      <ComparisonTable go={go}/>
    </section>
  </>;
}

function ProductCard({ product, go }: { product: SecurityProduct; go: (route: Route) => void }) {
  return <article className="directory-card"><div className="directory-card-top"><img src={product.logoUrl} alt={`${product.brand} official favicon`} onError={event => { event.currentTarget.style.display = 'none'; }}/><span>{product.platforms.join(' + ')}</span></div><p className="directory-brand">{product.brand}</p><h2>{product.name}</h2><p className="directory-copy">{product.description}</p><div className="directory-tags">{product.features.slice(0, 3).map(feature => <span key={feature.title}>{feature.title}</span>)}</div><div className="directory-card-actions"><button onClick={() => go(`/products/${product.slug}` as Route)}>View details <Icon name="arrow" size={16}/></button><a href={product.officialUrl} target="_blank" rel="noopener noreferrer">Official site <Icon name="chevron" size={15}/></a></div></article>;
}

function ComparisonTable({ go }: Props) {
  return <section className="product-comparison"><div className="product-comparison-heading"><div><Eyebrow>At a glance</Eyebrow><h2>Compare listed products.</h2></div><p>This table indicates whether the provider lists a category for the product. It does not compare effectiveness, pricing, or plans.</p></div><div className="comparison-scroll"><table><thead><tr><th>Product</th><th>Android</th><th>iOS</th><th>Malware protection</th><th>Privacy tools</th><th>Scam protection</th><th/></tr></thead><tbody>{products.map(product => <tr key={product.slug}><th><span className="comparison-brand"><img src={product.logoUrl} alt="" onError={event => { event.currentTarget.style.display = 'none'; }}/>{product.name}</span></th><td><Cell yes={product.platforms.includes('Android')}/></td><td><Cell yes={product.platforms.includes('iOS')}/></td><td><Cell yes={product.features.some(feature => feature.category === 'malware')}/></td><td><Cell yes={product.features.some(feature => feature.category === 'privacy')}/></td><td><Cell yes={product.features.some(feature => feature.category === 'scam')}/></td><td><button onClick={() => go(`/products/${product.slug}` as Route)} aria-label={`View ${product.name}`}>View <Icon name="arrow" size={14}/></button></td></tr>)}</tbody></table></div></section>;
}

function Cell({ yes }: { yes: boolean }) { return <span className={yes ? 'comparison-yes' : 'comparison-no'}>{yes ? <><Icon name="check" size={14}/> Listed</> : <><Icon name="close" size={14}/> —</>}</span>; }

export function ProductDetail({ product, go }: { product: SecurityProduct; go: (route: Route) => void }) {
  const alternatives = products.filter(item => item.slug !== product.slug);
  return <>
    <section className="product-detail-hero"><div className="section-wrap product-detail-hero-inner"><a className="product-back" href="/products" onClick={event => { event.preventDefault(); go('/products'); }}>← All products</a><div className="product-detail-logo"><img src={product.logoUrl} alt={`${product.brand} official favicon`} onError={event => { event.currentTarget.style.display = 'none'; }}/><span>{product.brand}</span></div><h1>{product.name}</h1><p>{product.description}</p><span className="product-platform-badge"><Icon name="phone" size={16}/>{product.platforms.join(' and ')} support listed by provider</span></div></section>
    <section className="product-detail-page section-wrap"><div className="product-detail-main"><section><Eyebrow>Product overview</Eyebrow><h2>Provider-described mobile security tools.</h2><p>{product.note} Read the provider’s official documentation before choosing a product or enabling permissions.</p></section><section className="detail-section"><div className="detail-section-head"><Eyebrow>Feature breakdown</Eyebrow><h2>What the provider lists.</h2></div><div className="detail-feature-grid">{product.features.map(feature => <article key={feature.title}><span><Icon name={feature.category === 'malware' ? 'shield' : feature.category === 'scam' ? 'activity' : 'lock'} size={19}/></span><h3>{feature.title}</h3><p>{feature.detail}</p></article>)}</div></section><section className="detail-section"><div className="detail-section-head"><Eyebrow>Platform compatibility</Eyebrow><h2>Android and iOS.</h2></div><div className="compatibility-cards"><article><span className="compat-icon">A</span><h3>Android</h3><p>{product.android}</p></article><article><span className="compat-icon"><Icon name="phone" size={20}/></span><h3>iOS</h3><p>{product.ios}</p></article></div></section><section className="detail-section"><div className="detail-section-head"><Eyebrow>Installation</Eyebrow><h2>Use official sources.</h2></div><ol className="install-steps">{product.installSteps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol></section></div><aside className="product-download-panel"><span className="download-label">OFFICIAL DOWNLOADS</span><h2>Choose your device.</h2><p>These links leave SENTRIQ and open official provider or official app-store pages.</p><a className="download-official" href={product.officialUrl} target="_blank" rel="noopener noreferrer">Visit official website <Icon name="arrow" size={16}/></a>{product.playStore && <a className="download-store" href={product.playStore.url} target="_blank" rel="noopener noreferrer"><span className="store-mark">▶</span>{product.playStore.label}<Icon name="arrow" size={15}/></a>}{product.appStore && <a className="download-store" href={product.appStore.url} target="_blank" rel="noopener noreferrer"><span className="store-mark">●</span>{product.appStore.label}<Icon name="arrow" size={15}/></a>}<div className="download-note"><Icon name="lock" size={16}/><span>Check the provider’s current requirements, privacy information, price, and permissions before installation.</span></div></aside></section>
    <section className="section-wrap related-products"><div className="product-comparison-heading"><div><Eyebrow>Compare alternatives</Eyebrow><h2>Other listed products.</h2></div></div><div className="related-grid">{alternatives.map(item => <button key={item.slug} onClick={() => go(`/products/${item.slug}` as Route)}><img src={item.logoUrl} alt="" onError={event => { event.currentTarget.style.display = 'none'; }}/><span><b>{item.name}</b><small>{item.platforms.join(' + ')}</small></span><Icon name="chevron" size={17}/></button>)}</div></section>
  </>;
}
