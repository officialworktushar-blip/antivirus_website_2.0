import type { Route } from '../components/ui';
import { Icon } from '../components/ui';
import { products, type SecurityProduct } from '../data/products';

const detailRoute = (product: SecurityProduct) => `/products/${product.slug}` as Route;

function ProductLogo({ product, large = false }: { product: SecurityProduct; large?: boolean }) {
  return (
    <span className={`av-logo${large ? ' av-logo-large' : ''}`}>
      <span className="av-logo-fallback" aria-hidden="true">{product.brand.charAt(0)}</span>
      <img
        src={product.logoUrl}
        alt={`${product.brand} official logo`}
        onError={event => { event.currentTarget.style.display = 'none'; }}
      />
    </span>
  );
}

function TrustSection() {
  return (
    <section className="av-trust-section">
      <span className="av-section-icon"><Icon name="shield-check" size={18} /></span>
      <div>
        <h2>Security Products We Recommend</h2>
        <p>These products are developed by independent security companies. SENTRIQ does not own these antivirus engines, operate them, or receive payment for listing them. Product details are taken from official provider pages and official app-store listings.</p>
        <small>Features, compatibility, and availability can change by platform, plan, and country. Confirm current details with the provider.</small>
      </div>
    </section>
  );
}

function HelpSection({ go }: { go: (route: Route) => void }) {
  return (
    <section className="av-help-section">
      <div>
        <span className="av-eyebrow">PERSONAL GUIDANCE</span>
        <h2>Need Help Choosing Protection?</h2>
        <p>A support specialist can help you understand your assessment and explain which product questions to ask before you decide.</p>
      </div>
      <button onClick={() => go('/support')}>Connect With Us <Icon name="arrow" size={14} /></button>
    </section>
  );
}

export function Products({ go }: { go: (route: Route) => void }) {
  return (
    <section className="av-products-page">
      <div className="av-products-inner">
        <header className="av-products-heading">
          <span className="av-eyebrow">ANTIVIRUS PRODUCTS</span>
          <h1>Mobile protection, clearly listed.</h1>
          <p>Review established mobile security products using official provider information. No ratings, prices, or partnership claims are shown here.</p>
        </header>

        <TrustSection />

        <div className="av-product-list">
          {products.map(product => (
            <article className="av-product-card" key={product.slug}>
              <div className="av-product-card-head">
                <ProductLogo product={product} />
                <div>
                  <span className="av-product-brand">{product.brand}</span>
                  <h2>{product.name}</h2>
                </div>
              </div>

              <div className="av-product-block">
                <span className="av-label">OFFICIAL DESCRIPTION</span>
                <p>{product.description}</p>
              </div>

              <div className="av-product-block">
                <span className="av-label">SUPPORTED PLATFORMS</span>
                <div className="av-chips">
                  {product.platforms.map(platform => <span key={platform}><Icon name="phone" size={12} /> {platform}</span>)}
                </div>
              </div>

              <div className="av-product-block">
                <span className="av-label">VERIFIED SECURITY CAPABILITIES</span>
                <div className="av-capability-list">
                  {product.features.map(feature => (
                    <span key={feature.title}><Icon name="check" size={12} /> {feature.title}</span>
                  ))}
                </div>
              </div>

              <div className="av-product-actions">
                <button onClick={() => go(detailRoute(product))}>View Details <Icon name="arrow" size={14} /></button>
                <a href={product.officialUrl} target="_blank" rel="noopener noreferrer">Official Website <Icon name="chevron" size={14} /></a>
              </div>
            </article>
          ))}
        </div>

        <HelpSection go={go} />
      </div>
    </section>
  );
}

export function ProductDetail({ product, go }: { product: SecurityProduct; go: (route: Route) => void }) {
  return (
    <section className="av-products-page av-detail-page">
      <div className="av-products-inner">
        <button className="av-back" onClick={() => go('/products')}><Icon name="arrow-back" size={15} /> All products</button>

        <article className="av-detail-card">
          <div className="av-detail-head">
            <ProductLogo product={product} large />
            <div>
              <span className="av-eyebrow">{product.brand.toUpperCase()}</span>
              <h1>{product.name}</h1>
              <p>{product.description}</p>
            </div>
          </div>

          <div className="av-chips av-detail-chips">
            {product.platforms.map(platform => <span key={platform}><Icon name="phone" size={12} /> {platform}</span>)}
          </div>

          <section className="av-detail-section">
            <h2>Product overview</h2>
            <p>{product.note} Review the official sources below before choosing a product or enabling permissions.</p>
          </section>

          <section className="av-detail-section">
            <h2>Features</h2>
            <div className="av-feature-list">
              {product.features.map(feature => (
                <article key={feature.title}>
                  <span className="av-feature-icon"><Icon name={feature.icon} size={18} /></span>
                  <div><b>{feature.title}</b><p>{feature.detail}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section className="av-detail-section">
            <h2>Compatibility</h2>
            <div className="av-compatibility-grid">
              <article>
                <span className="av-compat-icon"><Icon name="phone" size={17} /></span>
                <div><b>Android compatibility</b><p>{product.android}</p></div>
              </article>
              <article>
                <span className="av-compat-icon"><Icon name="shield-check" size={17} /></span>
                <div><b>iOS compatibility</b><p>{product.ios}</p></div>
              </article>
            </div>
          </section>

          <section className="av-detail-section">
            <h2>Installation guidance</h2>
            <ol className="av-install-steps">
              {product.installSteps.map((step, index) => (
                <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{step}</p></li>
              ))}
            </ol>
          </section>

          <section className="av-detail-section">
            <h2>Official links</h2>
            <div className="av-official-links">
              <a href={product.officialUrl} target="_blank" rel="noopener noreferrer"><Icon name="globe" size={16} /> Official website <Icon name="arrow" size={14} /></a>
              {product.playStore && <a href={product.playStore.url} target="_blank" rel="noopener noreferrer"><Icon name="phone" size={16} /> {product.playStore.label} <Icon name="arrow" size={14} /></a>}
              {product.appStore && <a href={product.appStore.url} target="_blank" rel="noopener noreferrer"><Icon name="phone" size={16} /> {product.appStore.label} <Icon name="arrow" size={14} /></a>}
            </div>
          </section>

          <section className="av-detail-section">
            <h2>Official sources</h2>
            <div className="av-source-list">
              {product.sources.map(source => (
                <a key={`${source.label}-${source.url}`} href={source.url} target="_blank" rel="noopener noreferrer">
                  <Icon name="info" size={14} /> {source.label} <Icon name="chevron" size={13} />
                </a>
              ))}
            </div>
            <p className="av-source-note">SENTRIQ is independent and does not own these antivirus engines or represent these providers.</p>
          </section>
        </article>

        <TrustSection />
        <HelpSection go={go} />
      </div>
    </section>
  );
}
