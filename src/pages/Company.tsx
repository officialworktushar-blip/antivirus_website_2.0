import type { ReactNode } from 'react';
import type { Route } from '../components/ui';
import { Eyebrow, Icon, PageIntro, type IconName } from '../components/ui';

type CompanyCardProps = { icon: IconName; eyebrow: string; title: string; children: ReactNode };
type PageProps = { go: (route: Route) => void };

const toTel = (value: string) => value.trim().replace(/[^+\d]/g, '').replace(/(?!^)\+/g, '');

function CompanyCard({ icon, eyebrow, title, children }: CompanyCardProps) {
  return (
    <article className="app-card company-card">
      <div className="company-card-head">
        <span className="company-icon"><Icon name={icon} size={19} /></span>
        <div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>
      </div>
      <div className="company-card-body">{children}</div>
    </article>
  );
}

function CompanyActions({ items, go }: { items: { label: string; icon: IconName; route: Route; primary?: boolean }[]; go: (route: Route) => void }) {
  return (
    <div className="company-actions">
      {items.map(item => (
        <button key={item.label} className={item.primary ? 'primary-button' : 'secondary-button'} type="button" onClick={() => go(item.route)}>
          <Icon name={item.icon} size={15} /> {item.label}
        </button>
      ))}
    </div>
  );
}

export function About({ go }: PageProps) {
  return (
    <section className="company-page">
      <div className="section-wrap company-inner">
        <PageIntro eyebrow="ABOUT SENTRIQ" title="Security that feels" accent="human." text="SENTRIQ turns mobile security into clear choices, plain language, and checks that stay inside your browser." />
        <article className="app-card company-lead">
          <span className="company-mark"><Icon name="shield-check" size={34} /></span>
          <div>
            <Eyebrow>OUR INTRODUCTION</Eyebrow>
            <h2>Practical guidance for the phone you use every day.</h2>
            <p>SENTRIQ helps you understand security signals, compare protection options, and decide when to ask for help. It is an educational experience, not an antivirus engine or a managed security service.</p>
          </div>
        </article>
        <div className="company-grid">
          <CompanyCard icon="spark" eyebrow="Our mission" title="Make safety understandable">
            <p>We want people to feel capable, not frightened, when they think about mobile security. That means short explanations, honest limits, and steps a person can actually take.</p>
            <div className="company-points"><span><Icon name="check" size={14} /> Clear over confusing</span><span><Icon name="check" size={14} /> Privacy over pressure</span><span><Icon name="check" size={14} /> Progress over perfection</span></div>
          </CompanyCard>
          <CompanyCard icon="scan" eyebrow="How the assessment works" title="Browser signals, honestly explained">
            <p>The assessment checks only what this browser exposes: HTTPS, secure context, browser cryptography, connection hints, privacy controls, and configuration signals.</p>
            <p>A website cannot inspect installed apps, files, photos, messages, calls, operating-system malware, or background processes. SENTRIQ says so plainly wherever results appear.</p>
          </CompanyCard>
          <CompanyCard icon="globe" eyebrow="Independent recommendations" title="Product links are not endorsements">
            <p>SENTRIQ lists mobile protection products using official provider and app-store sources. Names, features, and links are provided for independent reference.</p>
            <div className="company-callout"><Icon name="info" size={16} /><span>SENTRIQ does not own, operate, sell, or receive payment for these antivirus products. Confirm current features and terms with each provider.</span></div>
          </CompanyCard>
        </div>
        <CompanyActions items={[{ label: 'Run browser check', icon: 'scan', route: '/security-scan' }, { label: 'View recommendations', icon: 'shield-check', route: '/products', primary: true }]} go={go} />
      </div>
    </section>
  );
}

export function Privacy({ go }: PageProps) {
  return (
    <section className="company-page">
      <div className="section-wrap company-inner">
        <PageIntro eyebrow="PRIVACY INFORMATION" title="Your information," accent="your choice." text="This page explains what SENTRIQ reads, what it stores, and what happens when you follow an external link." />
        <div className="company-grid company-grid-wide">
          <CompanyCard icon="user" eyebrow="Data collected" title="No account or credential collection">
            <p>SENTRIQ does not ask you to create an account or provide passwords, one-time codes, recovery keys, or banking information.</p>
            <p>The support page uses a configured phone number through your device dialer only when you tap Call Support. Remote assistance opens only after consent and an explicit click.</p>
          </CompanyCard>
          <CompanyCard icon="globe" eyebrow="Browser information accessed" title="Only available browser signals">
            <p>The platform hint reads user-agent and touch information. Live checks read the page protocol, secure-context state, Web Crypto availability, text encoding support, online state, reported connection type, cookie setting, permission API availability, session-storage availability, and credential or passkey support.</p>
            <p>These checks do not read files, installed applications, photos, messages, calls, or device storage.</p>
          </CompanyCard>
          <CompanyCard icon="shield-check" eyebrow="Assessment data handling" title="Results stay on this device">
            <p>Real assessment findings are assembled in the browser. If history is enabled, the latest result is saved in local storage so it can appear on Dashboard, Results, and Trusted Advisor.</p>
            <p>Demonstration results are clearly labelled as samples. They are not presented as real findings.</p>
          </CompanyCard>
          <CompanyCard icon="lock" eyebrow="Local storage usage" title="You can turn history off">
            <p>SENTRIQ uses local storage for the latest assessment and the preference that controls whether new assessments are saved. Settings can clear saved history and disable future saving.</p>
            <p>If your browser blocks storage, the page continues to run and reports that the result cannot be restored.</p>
          </CompanyCard>
          <CompanyCard icon="arrow" eyebrow="Third-party links" title="Links open only when you choose">
            <p>Product pages link to official provider sites and app stores. The Open AnyDesk control links only to a configured official AnyDesk destination after consent.</p>
            <p>Once you leave SENTRIQ, those sites control their own privacy practices and terms.</p>
          </CompanyCard>
          <CompanyCard icon="activity" eyebrow="Remote support disclosures" title="Access requires your approval">
            <p>AnyDesk remote access may allow a helper to view your screen, guide changes, or control the device during a session you approve.</p>
            <p>SENTRIQ never launches AnyDesk automatically, never claims a technician is connected, never enables unattended access by default, and never asks for passwords, OTPs, or financial credentials.</p>
          </CompanyCard>
        </div>
        <div className="company-callout company-callout-wide"><Icon name="info" size={17} /><span>This page describes the current browser-based SENTRIQ experience. It is not a substitute for a production privacy notice.</span></div>
        <CompanyActions items={[{ label: 'Open Settings', icon: 'settings', route: '/settings' }, { label: 'Contact support', icon: 'chat', route: '/support', primary: true }]} go={go} />
      </div>
    </section>
  );
}

export function Terms({ go }: PageProps) {
  return (
    <section className="company-page">
      <div className="section-wrap company-inner">
        <PageIntro eyebrow="TERMS OF USE" title="Clear terms," accent="clear limits." text="These terms describe how to use this educational website and what its assessments and support options do not do." />
        <div className="company-grid company-grid-wide">
          <CompanyCard icon="book" eyebrow="Website usage" title="Use the guidance lawfully">
            <p>SENTRIQ is provided for general mobile-security education. You may read the guidance, run browser checks, and use the tools for lawful purposes.</p>
            <p>Do not attempt to disrupt the site, misrepresent its results, or use its content as a substitute for professional advice.</p>
          </CompanyCard>
          <CompanyCard icon="scan" eyebrow="Assessment limitations" title="A browser check is not a device scan">
            <p>The assessment reports only signals available to this browser. HTTPS and secure-context results describe this page and connection, not the safety of your whole device or every network you use.</p>
            <p>SENTRIQ cannot inspect files, installed apps, photos, messages, calls, operating-system malware, or background processes.</p>
          </CompanyCard>
          <CompanyCard icon="globe" eyebrow="Third-party antivirus disclaimer" title="Recommendations are independent">
            <p>Product names, descriptions, and links are provided for reference from official sources. SENTRIQ is not affiliated with, endorsed by, or selling those providers.</p>
            <p>Features, pricing, availability, and store listings can change. Confirm current details with the provider before installing or purchasing anything.</p>
          </CompanyCard>
          <CompanyCard icon="chat" eyebrow="Support limitations" title="Help requires your consent">
            <p>Support content is guidance, not an emergency response service. Remote access starts only after you approve the connection, and no technician is claimed to be connected by opening AnyDesk.</p>
            <p>Never share passwords, one-time codes, recovery keys, or financial credentials. For compromised accounts, contact the affected provider directly.</p>
          </CompanyCard>
        </div>
        <div className="company-callout company-callout-wide"><Icon name="info" size={17} /><span>Nothing in SENTRIQ is legal advice or a guarantee of protection.</span></div>
        <CompanyActions items={[{ label: 'Read privacy policy', icon: 'lock', route: '/privacy' }, { label: 'Get help', icon: 'chat', route: '/support', primary: true }]} go={go} />
      </div>
    </section>
  );
}

export function Disclaimer({ go }: PageProps) {
  return (
    <section className="company-page">
      <div className="section-wrap company-inner">
        <PageIntro eyebrow="DISCLAIMER" title="Understand the" accent="boundaries." text="SENTRIQ provides education and browser-only checks. It is not an antivirus product, managed service, or professional diagnosis." />
        <div className="company-grid company-grid-wide">
          <CompanyCard icon="shield" eyebrow="Assessment scope" title="Browser signals only">
            <p>Results reflect information this browser exposes. They do not prove that a phone is free of malware or that an account is safe.</p>
          </CompanyCard>
          <CompanyCard icon="activity" eyebrow="Support scope" title="Guidance, not emergency service">
            <p>Use a trusted provider for urgent account or device issues. Remote assistance is optional and begins only after your approval.</p>
          </CompanyCard>
        </div>
        <CompanyActions items={[{ label: 'Read full terms', icon: 'book', route: '/terms', primary: true }]} go={go} />
      </div>
    </section>
  );
}

export function Help({ go }: PageProps) {
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE?.trim() ?? '';
  const tel = toTel(supportPhone);
  const phoneReady = /^\+?\d{7,15}$/.test(tel);

  return (
    <section className="company-page">
      <div className="section-wrap company-inner">
        <PageIntro eyebrow="HELP CENTER" title="Answers before" accent="you call." text="Start with common questions, then use the Android or iPhone guidance that matches your device." />
        <div className="company-grid">
          <CompanyCard icon="chat" eyebrow="Frequently asked questions" title="Quick answers">
            <div className="company-faq">
              <details><summary>Is SENTRIQ an antivirus app?</summary><p>No. SENTRIQ explains browser-visible signals and links to independent protection products. It does not scan files, apps, or system malware.</p></details>
              <details><summary>Are results saved?</summary><p>The latest result is saved only if assessment history is enabled in Settings. You can turn saving off and clear saved history at any time.</p></details>
              <details><summary>Can support ask for my password?</summary><p>No. Do not share passwords, one-time codes, recovery keys, or banking information with anyone who contacts you unexpectedly.</p></details>
              <details><summary>Does opening AnyDesk connect someone?</summary><p>No. The button opens the configured destination only after consent. You must approve any connection yourself.</p></details>
            </div>
          </CompanyCard>
          <CompanyCard icon="phone" eyebrow="Android security information" title="Android checks">
            <div className="help-platform-list">
              <div><Icon name="check" size={15} /><span>Keep the operating system and apps updated.</span></div>
              <div><Icon name="check" size={15} /><span>Install apps from trusted stores and review permissions.</span></div>
              <div><Icon name="check" size={15} /><span>Use screen lock, secure browsing, and a trusted protection app.</span></div>
              <div><Icon name="check" size={15} /><span>Review device-admin and accessibility access regularly.</span></div>
            </div>
            <button className="text-button" type="button" onClick={() => go('/guides/android')}>Open Android guide <Icon name="chevron" size={14} /></button>
          </CompanyCard>
          <CompanyCard icon="lock" eyebrow="iPhone security information" title="iPhone checks">
            <div className="help-platform-list">
              <div><Icon name="check" size={15} /><span>Keep iOS and apps updated from the App Store.</span></div>
              <div><Icon name="check" size={15} /><span>Use Face ID or Touch ID and a strong passcode.</span></div>
              <div><Icon name="check" size={15} /><span>Review app permissions, location access, and notifications.</span></div>
              <div><Icon name="check" size={15} /><span>Remember that iOS limits traditional malware scanning by websites.</span></div>
            </div>
            <button className="text-button" type="button" onClick={() => go('/guides/iphone')}>Open iPhone guide <Icon name="chevron" size={14} /></button>
          </CompanyCard>
          <CompanyCard icon="chat" eyebrow="Contact details" title="Reach support safely">
            <div className="help-contact-list">
              <div><Icon name="phone" size={15} /><span><b>Phone</b><small>{phoneReady ? supportPhone : 'No support phone configured.'}</small></span>{phoneReady && <a className="text-button" href={`tel:${tel}`}>Call <Icon name="chevron" size={14} /></a>}</div>
              <div><Icon name="chat" size={15} /><span><b>Support center</b><small>Call and consent-gated remote assistance.</small></span><button className="text-button" type="button" onClick={() => go('/support')}>Open <Icon name="chevron" size={14} /></button></div>
            </div>
          </CompanyCard>
        </div>
        <CompanyActions items={[{ label: 'Run browser check', icon: 'scan', route: '/security-scan' }, { label: 'Contact support', icon: 'chat', route: '/support', primary: true }]} go={go} />
      </div>
    </section>
  );
}
