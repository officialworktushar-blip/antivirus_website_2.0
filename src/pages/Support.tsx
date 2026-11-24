import { useMemo, useState } from 'react';
import type { Route } from '../components/ui';
import { Icon, PageIntro } from '../components/ui';
import { clearAssessment } from '../scan';

type SupportProps = { go: (route: Route) => void };

const toTel = (value: string) => value.trim().replace(/[^+\d]/g, '').replace(/(?!^)\+/g, '');

export function Support({ go }: SupportProps) {
  const [consent, setConsent] = useState(false);
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE?.trim() ?? '';
  const anyDeskConfigured = import.meta.env.VITE_ANYDESK_SUPPORT_URL?.trim() ?? '';
  const tel = toTel(supportPhone);
  const phoneReady = /^\+?\d{7,15}$/.test(tel);
  const anyDeskUrl = useMemo(() => {
    try {
      const url = new URL(anyDeskConfigured);
      const host = url.hostname.toLowerCase();
      const officialHost = host === 'anydesk.com' || host.endsWith('.anydesk.com');
      if (url.protocol !== 'https:' || url.username || url.password || !officialHost) return '';
      return url.toString();
    } catch {
      return '';
    }
  }, [anyDeskConfigured]);

  const showRemote = () => document.getElementById('remote-assistance')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const rerunAssessment = () => {
    clearAssessment();
    go('/security-scan/real');
  };

  return (
    <section className="spt-page">
      <div className="section-wrap spt-inner">
        <PageIntro
          eyebrow="SUPPORT CENTER"
          title="Technical Support"
          text="Get clear help with security findings and protection choices. Choose a support option you understand, and stay in control of what you share."
        />

        <article className="app-card spt-hero-card">
          <div className="spt-hero-grid">
            <div className="spt-hero-copy">
              <span className="spt-hero-icon"><Icon name="phone" size={22} /></span>
              <h2>Need Help With Your Device?</h2>
              <p>Our technical support team can help you understand security findings and available protection options.</p>
            </div>
            <div className="spt-hero-side">
              <span className="spt-status"><Icon name="check" size={13} /> Support options are shown clearly</span>
              <p>Never share passwords, one-time codes, recovery keys, or banking details with anyone who contacts you unexpectedly.</p>
            </div>
          </div>
          <div className="spt-actions">
            {phoneReady ? (
              <a className="primary-button" href={`tel:${tel}`}><Icon name="phone" size={16} /> Call Support</a>
            ) : (
              <button className="primary-button" type="button" disabled><Icon name="phone" size={16} /> Call Support</button>
            )}
            <button className="secondary-button" type="button" onClick={showRemote}><Icon name="activity" size={16} /> Remote Assistance</button>
          </div>
          {!phoneReady && <p className="spt-config-note">Call Support becomes available when a valid `VITE_SUPPORT_PHONE` value is configured.</p>}
        </article>

        <div className="spt-section-grid">
          <article className="app-card spt-card">
            <span className="spt-card-icon"><Icon name="info" size={18} /></span>
            <h2>Support contact details</h2>
            <div className="spt-contact-list">
              <div className="spt-contact-row">
                <Icon name="phone" size={16} />
                <span><b>Phone</b><small>{phoneReady ? supportPhone : 'Not configured'}</small></span>
              </div>
              <div className="spt-contact-row">
                <Icon name="activity" size={16} />
                <span><b>Remote assistance</b><small>{anyDeskUrl ? 'Official AnyDesk destination configured' : 'Not configured or not verified'}</small></span>
              </div>
              <div className="spt-contact-row">
                <Icon name="scan" size={16} />
                <span><b>Security assessment</b><small>Browser-only checks available on this website</small></span>
              </div>
            </div>
          </article>

          <article className="app-card spt-card" id="remote-assistance">
            <span className="spt-card-icon"><Icon name="activity" size={18} /></span>
            <h2>Remote assistance, only with your approval</h2>
            <p>Remote assistance is optional. It is intended for guided help with settings and security findings after you choose to start it.</p>
            <ol className="spt-steps">
              <li className="spt-step"><span>1</span><div><b>What it is</b><p>Remote assistance lets a support helper guide you through a task on your device during a session you start yourself.</p></div></li>
              <li className="spt-step"><span>2</span><div><b>What AnyDesk may allow</b><p>With your approval, AnyDesk remote access may allow a helper to view your screen, guide changes, or control the device to complete a task.</p></div></li>
              <li className="spt-step"><span>3</span><div><b>You approve the connection</b><p>A connection does not start until you approve it. Opening AnyDesk is not a claim that a technician is connected.</p></div></li>
              <li className="spt-step"><span>4</span><div><b>You stay in control</b><p>Verify who is helping you, do not enable unattended access, and stop the session at any time.</p></div></li>
            </ol>
            <div className="spt-safety"><Icon name="lock" size={16} /><span>SENTRIQ will not ask for passwords, OTPs, recovery keys, or financial credentials during remote assistance.</span></div>
            <label className="spt-consent">
              <input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)} />
              <span>I understand that remote access may allow someone to view or control this device, and I approve starting the connection myself.</span>
            </label>
            {anyDeskUrl && consent ? (
              <a className="primary-button spt-remote-action" href={anyDeskUrl} target="_blank" rel="noopener noreferrer"><Icon name="globe" size={16} /> Open AnyDesk</a>
            ) : (
              <button className="primary-button spt-remote-action" type="button" disabled><Icon name="globe" size={16} /> Open AnyDesk</button>
            )}
            <p className="spt-config-note">The Open AnyDesk button appears only after you give consent and only when an official AnyDesk destination is configured for SENTRIQ.</p>
          </article>
        </div>

        <article className="app-card spt-followup">
          <span className="spt-card-icon"><Icon name="refresh" size={18} /></span>
          <div>
            <h2>Run Security Assessment Again</h2>
            <p>After support, clear the saved result and run a fresh browser check. The new scan shows only updated findings from actual available checks; sample readings are never shown.</p>
          </div>
          <button className="secondary-button" type="button" onClick={rerunAssessment}><Icon name="scan" size={16} /> Run Security Assessment Again</button>
        </article>

        <section className="spt-faq">
          <h2>Support FAQ</h2>
          <details>
            <summary>Can support tell me whether my phone is infected?</summary>
            <p>Not from this website alone. A browser check can confirm only the signals available to this browser. A qualified technician or a trusted security product is needed for device-level inspection.</p>
          </details>
          <details>
            <summary>Will SENTRIQ ask for passwords or verification codes?</summary>
            <p>No. Do not share passwords, one-time codes, recovery keys, or banking information. Contact the affected provider directly if an account may be at risk.</p>
          </details>
          <details>
            <summary>Does clicking Open AnyDesk connect a technician?</summary>
            <p>No. It opens the configured AnyDesk destination in a new tab. You must review and approve any connection yourself.</p>
          </details>
          <details>
            <summary>Can unattended access be enabled automatically?</summary>
            <p>No. Do not enable unattended access by default. Keep remote access limited to a session you approve.</p>
          </details>
        </section>
      </div>
    </section>
  );
}
