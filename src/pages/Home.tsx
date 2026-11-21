import { useEffect, useState } from 'react';
import type { Route, IconName } from '../components/ui';
import { Eyebrow, Icon } from '../components/ui';

type CheckState = { secureContext: boolean; https: boolean; lastAssessment: string | null };
type Service = { icon: IconName; number: string; title: string; description: string; action: string; target: Route };

const services: Service[] = [
  { icon: 'shield', number: '01', title: 'Malware Protection', description: 'Learn how mobile security apps can help spot harmful downloads and what their scans can—and cannot—see.', action: 'Compare protection', target: '/antivirus' },
  { icon: 'activity', number: '02', title: 'Phishing Protection', description: 'Get practical ways to check suspicious links, messages, and unexpected requests before you respond.', action: 'Read security guides', target: '/guides/android' },
  { icon: 'globe', number: '03', title: 'Browser Security', description: 'Understand safer browsing settings, warning signs, and the limits of browser-based checks.', action: 'Check my device', target: '/security-scan' },
  { icon: 'lock', number: '04', title: 'Wi-Fi Security', description: 'Make more informed choices on public networks and learn when a reputable VPN may be useful.', action: 'Explore protection', target: '/antivirus' },
  { icon: 'spark', number: '05', title: 'Privacy Protection', description: 'Review app permissions, location access, account settings, and the data you choose to share.', action: 'Read privacy guidance', target: '/privacy' },
  { icon: 'scan', number: '06', title: 'Device Security Assessment', description: 'Work through a short, private checklist and get clear next steps for your mobile device.', action: 'Start assessment', target: '/security-scan' },
  { icon: 'phone', number: '07', title: 'Mobile Technical Support', description: 'Get help finding the right guide or preparing the details a trusted technician may need.', action: 'Get support', target: '/support' },
  { icon: 'activity', number: '08', title: 'Security Consultation', description: 'Talk through a security concern and decide what kind of qualified help is appropriate.', action: 'Contact our team', target: '/support' },
];

const vendors = [
  { name: 'Bitdefender', product: 'Mobile Security', note: 'Android & iOS', url: 'https://www.bitdefender.com/en-us/consumer/mobile-security-android' },
  { name: 'Malwarebytes', product: 'Mobile Security', note: 'Android & iOS', url: 'https://www.malwarebytes.com/mobile' },
  { name: 'Norton', product: '360 for Mobile', note: 'Android & iOS', url: 'https://us.norton.com/products/norton-360-for-mobile' },
  { name: 'Avast', product: 'Avast One', note: 'Android & iOS', url: 'https://www.avast.com/en-us/avast-one' },
];

export function Home({ go, scrollTo }: { go: (path: Route) => void; scrollTo: (id: string) => void }) {
  const [checks, setChecks] = useState<CheckState>({ secureContext: false, https: false, lastAssessment: null });
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE?.trim() ?? '';

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem('sentriq-last-assessment'); } catch { /* Storage is optional. */ }
    const protocolIsHttps = window.location.protocol === 'https:';
    setChecks({
      secureContext: window.isSecureContext,
      https: protocolIsHttps,
      lastAssessment: stored,
    });
  }, []);

  const savedDate = checks.lastAssessment ? new Date(checks.lastAssessment) : null;
  const lastAssessment = savedDate && !Number.isNaN(savedDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(savedDate)
    : 'No assessment yet';

  return <>
    <section className="sq-hero">
      <div className="sq-hero-inner">
        <div className="sq-hero-copy">
          <Eyebrow>Mobile security, made clearer</Eyebrow>
          <h1>Your Phone Deserves<br className="desktop-break"/> Better <em>Protection.</em></h1>
          <p>Understand your device security, discover trusted protection tools and get expert technical assistance.</p>
          <div className="sq-hero-actions">
            <button className="sq-button sq-button-primary" onClick={() => go('/security-scan')}>Check My Device <Icon name="arrow" size={18}/></button>
            <button className="sq-button sq-button-quiet" onClick={() => scrollTo('products')}>Explore Protection <Icon name="chevron" size={17}/></button>
          </div>
          <div className="sq-hero-assurances"><span><Icon name="lock" size={15}/>Private by design</span><span><Icon name="check" size={15}/>No download required</span></div>
        </div>
        <div className="sq-hero-art" aria-label="Illustration of a mobile security assessment dashboard">
          <div className="sq-art-grid"/><div className="sq-art-orbit sq-art-orbit-a"/><div className="sq-art-orbit sq-art-orbit-b"/>
          <div className="sq-art-device"><div className="sq-art-camera"/><div className="sq-art-screen-top"><span>SENTRIQ <i>SECURITY OVERVIEW</i></span><span className="sq-live-dot">●</span></div><div className="sq-art-shield"><div><Icon name="shield" size={35}/></div></div><div className="sq-art-score"><b>DEVICE CHECK</b><span>Good habits start<br/>with a clear view.</span><small>YOUR PERSONAL CHECKLIST</small></div><div className="sq-art-meter"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="sq-art-lines"><span>Browser &amp; connection</span><b>2 checks</b></div><div className="sq-art-lines"><span>Privacy basics</span><b>3 checks</b></div><div className="sq-art-bottom"><Icon name="lock" size={13}/> This check stays on your device</div></div>
          <div className="sq-float sq-float-top"><span className="sq-float-icon"><Icon name="activity" size={17}/></span><span><b>Clear next steps</b><small>Built around your answers</small></span></div>
          <div className="sq-float sq-float-bottom"><span className="sq-float-check"><Icon name="check" size={16}/></span><span><b>Privacy first</b><small>No files accessed</small></span></div>
          <div className="sq-art-caption"><span/> A more confident way to protect your mobile life</div>
        </div>
      </div>
      <div className="sq-hero-bottom"><span>GUIDANCE FOR EVERYDAY DIGITAL LIFE</span><span>ASSESS <b>·</b> UNDERSTAND <b>·</b> PROTECT</span></div>
    </section>

    <section className="sq-assessment section-wrap" id="assessment-card">
      <div className="sq-assessment-heading"><div><Eyebrow>A useful place to begin</Eyebrow><h2>Device security<br/><em>assessment.</em></h2><p>A short, private check-in that helps you understand the basics.</p></div><div className="sq-assess-status"><span className="sq-status-mark"><Icon name="scan" size={19}/></span><span><small>LAST ASSESSMENT STATUS</small><b>{lastAssessment}</b><i>{checks.lastAssessment ? 'Checklist completed in this browser' : 'Start when you’re ready'}</i></span></div></div>
      <div className="sq-assessment-body"><div className="sq-check-list">
        <div className="sq-check-row"><span className="sq-check-icon"><Icon name="globe"/></span><span><b>Browser security</b><small>{checks.secureContext ? 'This page is running in a secure browser context.' : 'Secure context is not confirmed on this connection.'}</small></span><span className={`sq-pill ${checks.secureContext?'sq-pill-good':'sq-pill-neutral'}`}>{checks.secureContext?'SECURE CONTEXT':'GUIDANCE'}</span></div>
        <div className="sq-check-row"><span className="sq-check-icon"><Icon name="lock"/></span><span><b>Connection security</b><small>{checks.https ? 'This page is using HTTPS.' : 'HTTPS is not confirmed for this page.'}</small></span><span className={`sq-pill ${checks.https?'sq-pill-good':'sq-pill-neutral'}`}>{checks.https?'HTTPS':'CHECK HOST'}</span></div>
        <div className="sq-check-row"><span className="sq-check-icon"><Icon name="spark"/></span><span><b>Privacy checks</b><small>No analytics or advertising trackers are configured in this prototype.</small></span><span className="sq-pill sq-pill-good">LOCAL ONLY</span></div>
      </div><aside className="sq-assessment-aside"><span className="sq-aside-index">01 — A NOTE ABOUT THIS CHECK</span><h3>Helpful guidance.<br/>Honest limits.</h3><p>A browser-based assessment cannot scan all device files or installed applications. It can check this page’s connection and guide you through security settings you can review yourself.</p><button className="sq-text-link" onClick={() => go('/security-scan')}>Start your assessment <Icon name="arrow" size={16}/></button></aside></div>
    </section>

    <section className="sq-services" id="services"><div className="section-wrap"><div className="sq-section-heading"><div><Eyebrow>How SENTRIQ can help</Eyebrow><h2>Security support for<br/>your <em>whole mobile life.</em></h2></div><p>Practical information and clear next steps for the things that matter on your phone.</p></div><div className="sq-service-grid">{services.map(service=><article className="sq-service-card" key={service.number}><div className="sq-service-top"><span className="sq-service-icon"><Icon name={service.icon} size={21}/></span><span>{service.number} / 08</span></div><h3>{service.title}</h3><p>{service.description}</p><button onClick={()=>go(service.target)} className="sq-service-link">{service.action}<Icon name="arrow" size={16}/></button></article>)}</div></div></section>

    <section className="sq-trust section-wrap"><div className="sq-trust-copy"><Eyebrow>Transparency is protection</Eyebrow><h2>Know what we can<br/>check — and <em>what we can’t.</em></h2><p>SENTRIQ can check whether this page is using HTTPS, give you educational guidance, and record that you completed a checklist in this browser. We cannot inspect your installed apps, scan your files, or confirm that a device is malware-free.</p><div className="sq-privacy-callout"><Icon name="lock" size={19}/><span><b>Your privacy stays yours.</b><small>Your assessment answers remain in this browser and are not sent to a server.</small></span></div></div><div className="sq-trust-boundaries"><div><span className="sq-boundary-mark sq-boundary-yes"><Icon name="check" size={17}/></span><span><b>What this website can do</b><small>Check its own connection, explain common security settings, and provide independent product links.</small></span></div><div><span className="sq-boundary-mark"><Icon name="close" size={17}/></span><span><b>What this website cannot do</b><small>Scan all files, inspect installed apps, remove malware, or replace a qualified technician.</small></span></div><button className="sq-text-link" onClick={()=>go('/disclaimer')}>Read our full disclaimer <Icon name="arrow" size={16}/></button></div></section>

    <section className="sq-products" id="products"><div className="section-wrap"><div className="sq-section-heading"><div><Eyebrow>Independent product directory</Eyebrow><h2>Protection worth<br/><em>looking into.</em></h2></div><p>Explore mobile security products directly with their providers. Features and availability can vary by device and region.</p></div><div className="sq-vendor-grid">{vendors.map((vendor,i)=><article className="sq-vendor-card" key={vendor.name}><div className="sq-vendor-head"><span className={`sq-vendor-glyph sq-vendor-${i}`}><Icon name={i===2?'lock':i===1?'activity':'shield'} size={20}/></span><span className="sq-vendor-availability">{vendor.note}</span></div><h3>{vendor.name}</h3><p>{vendor.product}</p><a href={vendor.url} target="_blank" rel="noopener noreferrer">Visit official site <Icon name="arrow" size={16}/></a></article>)}</div><p className="sq-affiliation-note"><Icon name="globe" size={15}/> SENTRIQ is independent and is not affiliated with or endorsed by these providers. Links open on their official websites.</p></div></section>

    <section className="sq-how section-wrap"><div className="sq-how-intro"><Eyebrow>A simple way forward</Eyebrow><h2>Three steps.<br/><em>More clarity.</em></h2><p>Good security decisions start with understanding what’s already in place.</p><button className="sq-button sq-button-primary" onClick={()=>go('/security-scan')}>Check My Device <Icon name="arrow" size={17}/></button></div><div className="sq-steps"><article><span className="sq-step-num">01</span><span className="sq-step-icon"><Icon name="scan"/></span><div><h3>Assess</h3><p>Answer a few questions and check the basics without installing an app.</p></div><span className="sq-step-arrow">→</span></article><article><span className="sq-step-num">02</span><span className="sq-step-icon"><Icon name="spark"/></span><div><h3>Understand</h3><p>See what the results mean, where the limits are, and what matters most.</p></div><span className="sq-step-arrow">→</span></article><article><span className="sq-step-num">03</span><span className="sq-step-icon"><Icon name="shield"/></span><div><h3>Protect</h3><p>Follow practical steps or compare tools directly with their providers.</p></div><span className="sq-step-arrow"><Icon name="check" size={18}/></span></article></div></section>

    <section className="sq-support"><div className="section-wrap sq-support-inner"><div className="sq-support-emblem"><Icon name="phone" size={27}/><span/></div><div className="sq-support-copy"><Eyebrow>Need a hand?</Eyebrow><h2>Real help for your<br/><em>next right step.</em></h2><p>Tell us what’s going on. We can help you find guidance or prepare for a conversation with a trusted technician.</p></div><div className="sq-support-actions">{supportPhone ? <a className="sq-button sq-button-primary" href={`tel:${supportPhone}`}>Call support <Icon name="arrow" size={17}/></a> : <button className="sq-button sq-button-primary" onClick={()=>go('/support')}>Contact support <Icon name="arrow" size={17}/></button>}<button className="sq-text-link" onClick={()=>go('/support')}>Browse support options <Icon name="chevron" size={16}/></button></div></div></section>

    <div className="sq-mobile-dock"><button className="sq-button sq-button-primary" onClick={()=>go('/security-scan')}>Check My Device <Icon name="arrow" size={17}/></button></div>
  </>;
}
