import { useEffect, useMemo, useState } from 'react';
import type { Route } from '../components/ui';
import { Icon, type IconName } from '../components/ui';
import { capDisplayScore } from '../scan';

type FindingState = 'passed' | 'attention' | 'unavailable';
type StoredFinding = { id: string; label: string; state: FindingState; detail: string };
type StoredAssessment = { completedAt: string; device: string; isDemo: boolean; findings: StoredFinding[] };
type Tone = 'neutral' | 'passed' | 'attention' | 'unavailable';

const STORAGE_KEY = 'sentriq-security-assessment';

function readStoredAssessment(): StoredAssessment | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAssessment>;
    if (parsed.isDemo || typeof parsed.completedAt !== 'string') return null;
    if (Number.isNaN(new Date(parsed.completedAt).getTime())) return null;
    if (!Array.isArray(parsed.findings)) return null;
    const findings = parsed.findings.filter((finding): finding is StoredFinding => (
      Boolean(finding)
      && typeof finding.id === 'string'
      && typeof finding.label === 'string'
      && typeof finding.detail === 'string'
      && ['passed', 'attention', 'unavailable'].includes(finding.state)
    ));
    if (!findings.length) return null;
    return {
      completedAt: parsed.completedAt,
      device: typeof parsed.device === 'string' ? parsed.device : 'Device',
      isDemo: false,
      findings,
    };
  } catch {
    return null;
  }
}

function formatDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function stateLabel(state: FindingState): string {
  if (state === 'passed') return 'Passed';
  if (state === 'attention') return 'Review';
  return 'Unavailable';
}

function stateIcon(state: FindingState): IconName {
  if (state === 'passed') return 'check';
  if (state === 'attention') return 'alert';
  return 'info';
}

export function Home({ go }: { go: (path: Route) => void }) {
  const [assessment, setAssessment] = useState<StoredAssessment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const load = () => setAssessment(readStoredAssessment());
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const summary = useMemo(() => {
    const findings = assessment?.findings ?? [];
    const passed = findings.filter(finding => finding.state === 'passed').length;
    const attention = findings.filter(finding => finding.state === 'attention').length;
    const unavailable = findings.filter(finding => finding.state === 'unavailable').length;
    const score = capDisplayScore(findings.length ? Math.round((passed / findings.length) * 100) : null);
    const status = !assessment
      ? 'Not yet assessed'
      : attention > 0
        ? 'Review recommended'
        : passed === 0
          ? 'No verified checks'
          : 'Assessment complete';
    const tone: Tone = !assessment ? 'neutral' : attention > 0 ? 'attention' : passed > 0 ? 'passed' : 'unavailable';
    return { findings, passed, attention, unavailable, score, status, tone };
  }, [assessment]);

  const find = (id: string) => assessment?.findings.find(finding => finding.id === id) ?? null;

  const services: { title: string; icon: IconName; route: Route; ids: string[]; fallback: string }[] = [
    { title: 'Malware Protection', icon: 'shield-check', route: '/products', ids: ['native'], fallback: 'Browser checks cannot inspect files, apps, or malware.' },
    { title: 'Privacy Protection', icon: 'eye', route: '/guides/android', ids: ['privacy', 'permissions'], fallback: 'No privacy assessment result is available yet.' },
    { title: 'Web Protection', icon: 'lock', route: '/guides/iphone', ids: ['https', 'context', 'browser'], fallback: 'No web protection assessment result is available yet.' },
    { title: 'Network Security', icon: 'wifi', route: '/security-scan', ids: ['connection'], fallback: 'No network assessment result is available yet.' },
    { title: 'Device Security', icon: 'phone', route: '/results', ids: ['permissions', 'browser'], fallback: 'No device security assessment result is available yet.' },
  ];

  const serviceStatus = (ids: string[], fallback: string) => {
    const matches = ids.map(id => find(id)).filter((finding): finding is StoredFinding => Boolean(finding));
    if (!assessment || !matches.length) return { label: 'Not assessed', detail: fallback, tone: 'neutral' as Tone };
    const priority: Record<FindingState, number> = { attention: 0, unavailable: 1, passed: 2 };
    const finding = [...matches].sort((left, right) => priority[left.state] - priority[right.state])[0];
    return { label: stateLabel(finding.state), detail: finding.detail, tone: finding.state as Tone };
  };

  const connectionFinding = find('connection');
  const httpsFinding = find('https');
  const networkMatch = connectionFinding?.detail.match(/Network reports ([^\s.]+)/);
  const formattedDate = assessment ? formatDate(assessment.completedAt) : null;

  const connectionState = !connectionFinding
    ? 'Not verified'
    : connectionFinding.state === 'attention'
      ? 'Offline reported'
      : connectionFinding.state === 'unavailable'
        ? 'Not exposed'
        : 'Online reported';
  const pageTransport = !httpsFinding ? 'Not verified' : httpsFinding.state === 'passed' ? 'HTTPS' : 'Not HTTPS';
  const networkType = networkMatch?.[1] ?? (!connectionFinding ? 'Not verified' : 'Not reported');

  return (
    <section className="security-dashboard">
      <div className="dash-section-head dash-page-head">
        <div>
          <span className="dash-eyebrow">SENTRIQ · SECURITY DASHBOARD</span>
          <h1>Your protection, clearly shown.</h1>
        </div>
        <span className="dash-head-status"><i /> Local browser checks</span>
      </div>

      <section className="dash-section" aria-labelledby="protection-score-title">
        <div className="dash-section-head">
          <h2 id="protection-score-title">Device Protection Score</h2>
          <span className={`dash-status-pill dash-tone-${summary.tone}`}>{summary.status}</span>
        </div>
        <article className="dash-card dash-score-card">
          <div className="dash-protection-gauge" role="img" aria-label={summary.score === null ? 'Not yet assessed' : `Protection score ${summary.score} percent`}>
            <svg viewBox="0 0 200 120" aria-hidden="true">
              <path className="dash-gauge-track" d="M 20 102 A 80 80 0 0 1 180 102" pathLength={100} />
              {summary.score !== null && <path className="dash-gauge-value" d="M 20 102 A 80 80 0 0 1 180 102" pathLength={100} strokeDashoffset={100 - summary.score} />}
            </svg>
            <div className="dash-gauge-center">
              <span className="dash-gauge-icon"><Icon name="shield-check" size={20} /></span>
              <strong>{summary.score ?? '—'}{summary.score !== null && <small>%</small>}</strong>
              <span className="dash-gauge-caption">{summary.score === null ? 'Not yet assessed' : `${summary.passed} of ${summary.findings.length} checks passed`}</span>
            </div>
          </div>
          <div className="dash-score-detail">
            <b>{summary.score === null ? 'No assessment results yet' : summary.status}</b>
            <p>{summary.score === null
              ? 'Run a browser assessment to see a score based only on available results.'
              : 'This score reflects only browser-accessible checks saved from your last assessment.'}</p>
            <button className="dash-details-button" onClick={() => summary.score === null ? go('/security-scan') : setDetailsOpen(!detailsOpen)}>
              See Details <Icon name="chevron" size={14} />
            </button>
          </div>
          {summary.score !== null && detailsOpen && (
            <div className="dash-score-findings">
              <div className="dash-findings-head">
                <b>Assessment findings</b>
                <button onClick={() => setDetailsOpen(false)} aria-label="Close assessment findings"><Icon name="close" size={14} /></button>
              </div>
              {summary.findings.map(finding => (
                <div className="dash-finding" key={finding.id}>
                  <span className={`dash-finding-icon dash-tone-${finding.state}`}><Icon name={stateIcon(finding.state)} size={13} /></span>
                  <span><b>{finding.label}</b><small>{finding.detail}</small></span>
                  <em className={`dash-tone-${finding.state}`}>{stateLabel(finding.state)}</em>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="dash-section" aria-labelledby="scanner-title">
        <div className="dash-section-head"><h2 id="scanner-title">Scanner</h2></div>
        <article className="dash-card dash-scanner-card">
          <span className="dash-scanner-icon"><Icon name="scan" size={26} /></span>
          <div className="dash-scanner-copy">
            <b>{assessment ? summary.status : 'No assessment performed'}</b>
            <span>{formattedDate ? `Last assessment: ${formattedDate}` : 'No assessment recorded'}</span>
            <small>{assessment ? 'Results are saved on this device.' : 'Check only what this browser can verify.'}</small>
          </div>
          <button className="dash-scan-button" onClick={() => go('/security-scan')}><Icon name="scan" size={16} /> Scan Now</button>
        </article>
      </section>

      <section className="dash-section" aria-labelledby="services-title">
        <div className="dash-section-head">
          <h2 id="services-title">Security Services</h2>
          <span className="dash-section-note">Assessment status only</span>
        </div>
        <div className="dash-service-grid">
          {services.map(service => {
            const status = serviceStatus(service.ids, service.fallback);
            return (
              <article className="dash-card dash-service-card" key={service.title}>
                <span className={`dash-service-icon dash-tone-${status.tone}`}><Icon name={service.icon} size={19} /></span>
                <div className="dash-service-copy"><b>{service.title}</b><small>{status.detail}</small></div>
                <div className="dash-service-foot">
                  <span className={`dash-service-status dash-tone-${status.tone}`}>{status.label}</span>
                  <button onClick={() => go(service.route)}>Details <Icon name="chevron" size={13} /></button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dash-section" aria-labelledby="connectivity-title">
        <div className="dash-section-head">
          <h2 id="connectivity-title">Connectivity</h2>
          <span className="dash-section-note">Verified only</span>
        </div>
        <article className="dash-card dash-connect-card">
          <div className="dash-connect-head">
            <span className={`dash-connect-icon dash-tone-${connectionFinding ? connectionFinding.state : 'neutral'}`}><Icon name="wifi" size={20} /></span>
            <div><b>Network Security</b><small>{formattedDate ? `From last assessment · ${formattedDate}` : 'No assessment recorded'}</small></div>
            <span className={`dash-service-status dash-tone-${connectionFinding ? connectionFinding.state : 'neutral'}`}>{connectionFinding ? stateLabel(connectionFinding.state) : 'Not assessed'}</span>
          </div>
          <div className="dash-connect-rows">
            <div><span>Connection</span><b>{connectionState}</b></div>
            <div><span>Page transport</span><b>{pageTransport}</b></div>
            <div><span>Browser-reported network</span><b>{networkType}</b></div>
          </div>
          <p className="dash-connect-note"><Icon name="info" size={13} /> VPN and location are not displayed because this browser cannot verify them.</p>
        </article>
      </section>

      <section className="dash-section" aria-labelledby="support-title">
        <h2 className="dash-visually-hidden" id="support-title">Support</h2>
        <article className="dash-card dash-support-card">
          <div className="dash-support-copy">
            <span className="dash-support-icon"><Icon name="chat" size={20} /></span>
            <div>
              <b>Need help protecting your device?</b>
              <small>Get clear, practical guidance from SENTRIQ.</small>
            </div>
          </div>
          <button onClick={() => go('/support')}>Connect With Us <Icon name="arrow" size={14} /></button>
        </article>
      </section>
    </section>
  );
}
