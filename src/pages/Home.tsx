import { useEffect, useState } from 'react';
import type { Route } from '../components/ui';
import { Badge, Icon } from '../components/ui';
import { QuickAction, SectionHeader, SecurityGauge, StatusRow } from '../components/Dashboard';

type CheckState = { secureContext: boolean; https: boolean; lastAssessment: string | null };

export function Home({ go }: { go: (path: Route) => void }) {
  const [checks, setChecks] = useState<CheckState>({ secureContext: false, https: false, lastAssessment: null });
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE?.trim() ?? '';

  useEffect(() => {
    let stored: string | null = null;
    try { stored = localStorage.getItem('sentriq-last-assessment'); } catch { stored = null; }
    setChecks({
      secureContext: window.isSecureContext,
      https: window.location.protocol === 'https:',
      lastAssessment: stored,
    });
  }, []);

  const savedDate = checks.lastAssessment ? new Date(checks.lastAssessment) : null;
  const lastAssessment = savedDate && !Number.isNaN(savedDate.getTime())
    ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(savedDate)
    : 'No scan run yet';
  const readyCount = Number(checks.https) + Number(checks.secureContext) + Number(Boolean(checks.lastAssessment));
  const readiness = 54 + readyCount * (46 / 3);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const callHref = supportPhone ? `tel:${supportPhone.replace(/[^+\d]/g, '')}` : '';

  return (
    <section className="dashboard-page">
      <div className="dashboard-wrap">
        <div className="dash-topbar">
          <div><span className="dash-eyebrow">SECURITY DASHBOARD</span><h1>{greeting}, stay protected.</h1><p>Here’s a clear view of your device security basics.</p></div>
          <button className="icon-button" onClick={() => go('/support')} aria-label="Security notifications"><Icon name="bell" size={19} /><i /></button>
        </div>

        <div className="hero-grid">
          <article className="protection-card">
            <div className="card-topline"><Badge tone={readyCount === 3 ? 'green' : 'blue'}>{readyCount === 3 ? 'Protection basics ready' : 'Setup in progress'}</Badge><span><Icon name="clock" size={14} /> Updated just now</span></div>
            <div className="protection-main">
              <SecurityGauge value={readiness} label="Readiness" caption="Browser-check score" tone={readyCount === 3 ? 'green' : 'blue'} />
              <div className="protection-copy">
                <span className="big-status"><Icon name="shield-check" size={22} /> Your connection is {checks.https && checks.secureContext ? 'secure' : 'partly verified'}</span>
                <h2>Clear checks.<br />Confident next steps.</h2>
                <p>SENTRIQ reviews browser-accessible signals and gives practical guidance. It never claims to scan your files or remove malware.</p>
              </div>
            </div>
            <div className="protection-actions">
              <button className="primary-button" onClick={() => go('/security-scan')}><Icon name="scan" size={17} /> Start security scan</button>
              <button className="secondary-button" onClick={() => go('/products')}><Icon name="shield-check" size={17} /> Explore protection</button>
            </div>
          </article>

          <aside className="attention-card">
            <div className="attention-head"><span className="attention-icon"><Icon name="activity" size={20} /></span><span><small>DEVICE OVERVIEW</small><b>{readyCount} of 3 basics ready</b></span></div>
            <div className="attention-list">
              <StatusRow icon="lock" title="HTTPS connection" detail={checks.https ? 'This page is delivered securely.' : 'Confirm HTTPS before sharing details.'} status={checks.https ? 'SECURE' : 'CHECK'} tone={checks.https ? 'green' : 'orange'} />
              <StatusRow icon="shield" title="Browser security" detail={checks.secureContext ? 'Secure browser APIs are available.' : 'Secure context was not confirmed.'} status={checks.secureContext ? 'READY' : 'REVIEW'} tone={checks.secureContext ? 'green' : 'orange'} />
              <StatusRow icon="scan" title="Native malware scan" detail="Requires a trusted security app with device permission." status="NOT HERE" tone="red" />
            </div>
            <button className="text-button" onClick={() => go('/disclaimer')}>Understand scan limits <Icon name="chevron" size={15} /></button>
          </aside>
        </div>

        <section className="dashboard-section">
          <SectionHeader eyebrow="QUICK ACTIONS" title="What would you like to do?" />
          <div className="quick-grid">
            <QuickAction icon="scan" title="Quick scan" detail="Check browser signals" onClick={() => go('/security-scan')} />
            <QuickAction icon="shield-check" title="Protection" detail="Compare trusted tools" onClick={() => go('/products')} tone="green" />
            <QuickAction icon="broom" title="Privacy check" detail="Review app permissions" onClick={() => go('/guides/android')} tone="orange" />
            <QuickAction icon="chat" title="Get help" detail="Contact support safely" onClick={callHref ? () => { window.location.href = callHref; } : () => go('/support')} tone="red" />
          </div>
          {callHref && <a className="support-call-link" href={callHref}><Icon name="phone" size={16} /> Call configured support number</a>}
        </section>

        <div className="dashboard-grid">
          <article className="app-card activity-card">
            <SectionHeader eyebrow="RECENT ACTIVITY" title="Security timeline" />
            <div className="timeline">
              <div className="timeline-item"><span className="timeline-dot green"><Icon name="check" size={13} /></span><span><b>Connection reviewed</b><small>HTTPS and secure context checked in this browser</small></span><time>Now</time></div>
              <div className="timeline-item"><span className="timeline-dot blue"><Icon name="clock" size={13} /></span><span><b>Last assessment</b><small>{lastAssessment}</small></span><time>Saved locally</time></div>
              <div className="timeline-item"><span className="timeline-dot orange"><Icon name="info" size={13} /></span><span><b>Native scan still required</b><small>Use a trusted app for files, apps, and system-level threats</small></span><time>Guide</time></div>
            </div>
          </article>

          <article className="app-card layers-card">
            <SectionHeader eyebrow="PROTECTION LAYERS" title="Build better habits" />
            <div className="layer-list">
              <button onClick={() => go('/products')}><span className="layer-icon blue"><Icon name="shield" size={18} /></span><span><b>Malware protection</b><small>Understand what mobile security apps can do</small></span><Icon name="chevron" size={16} /></button>
              <button onClick={() => go('/guides/android')}><span className="layer-icon green"><Icon name="eye" size={18} /></span><span><b>Web & scam safety</b><small>Spot suspicious links and messages</small></span><Icon name="chevron" size={16} /></button>
              <button onClick={() => go('/guides/iphone')}><span className="layer-icon orange"><Icon name="wifi" size={18} /></span><span><b>Network & privacy</b><small>Make safer choices on public Wi-Fi</small></span><Icon name="chevron" size={16} /></button>
            </div>
          </article>
        </div>

        <div className="dashboard-note"><Icon name="info" size={17} /><p>SENTRIQ is independent and does not claim to be an antivirus engine. Browser checks show only what this page can verify.</p></div>
      </div>
    </section>
  );
}
