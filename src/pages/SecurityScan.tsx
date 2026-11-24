import { useEffect, useMemo, useState } from 'react';
import type { Route } from '../components/ui';
import { Badge, Icon, type IconName } from '../components/ui';
import { SecurityGauge } from '../components/Dashboard';

type DeviceKind = 'Android' | 'iPhone' | 'Other device';
type Stage = 'select' | 'intro' | 'scanning' | 'results';
type State = 'passed' | 'attention' | 'unavailable';
type Finding = { id: string; label: string; state: State; detail: string; icon: IconName };
type StoredAssessment = { completedAt: string; device: DeviceKind; isDemo: boolean; findings: Finding[] };

const DEMO_FINDINGS: Finding[] = [
  { id: 'demo-https', label: 'HTTPS connection', state: 'passed', detail: 'Sample: the connection is shown as encrypted.', icon: 'lock' },
  { id: 'demo-context', label: 'Secure browser context', state: 'passed', detail: 'Sample: modern browser security APIs are available.', icon: 'shield' },
  { id: 'demo-permission', label: 'Notification permissions', state: 'attention', detail: 'Sample: review which websites are allowed to send alerts.', icon: 'activity' },
  { id: 'demo-apps', label: 'Installed apps and files', state: 'unavailable', detail: 'Sample: browser assessments cannot inspect apps, files, messages, or background processes.', icon: 'scan' },
];

const getBrowserLabel = () => {
  const agent = navigator.userAgent;
  if (/Edg\//.test(agent)) return 'Microsoft Edge';
  if (/Firefox\//.test(agent)) return 'Firefox';
  if (/CriOS|Chrome\//.test(agent)) return 'Chrome';
  if (/Safari\//.test(agent)) return 'Safari';
  return 'Your browser';
};

const getFindings = (): Finding[] => {
  const connection = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
  const https = window.location.protocol === 'https:';
  const storageAvailable = (() => { try { sessionStorage.setItem('__sentriq_test', '1'); sessionStorage.removeItem('__sentriq_test'); return true; } catch { return false; } })();
  const cookieAvailable = navigator.cookieEnabled;
  const permissionApi = 'permissions' in navigator;
  const online = navigator.onLine;
  const connectionDetail = connection.connection?.effectiveType ? `Network reports ${connection.connection.effectiveType}${connection.connection.saveData ? ' with data saver enabled' : ''}.` : 'The browser does not expose connection details.';
  return [
    { id: 'https', label: 'HTTPS connection', state: https ? 'passed' : 'attention', detail: https ? 'This page is being delivered over HTTPS.' : 'This page is not using HTTPS. Avoid entering sensitive information here.', icon: 'lock' },
    { id: 'context', label: 'Secure browser context', state: window.isSecureContext ? 'passed' : 'attention', detail: window.isSecureContext ? 'Secure-context browser features are available on this page.' : 'Secure-context browser features are unavailable on this page.', icon: 'shield' },
    { id: 'browser', label: 'Browser capability', state: 'passed', detail: `${getBrowserLabel()} reports JavaScript, local storage, and basic web security capabilities.`, icon: 'globe' },
    { id: 'privacy', label: 'Local privacy signals', state: storageAvailable && cookieAvailable ? 'passed' : 'attention', detail: storageAvailable && cookieAvailable ? 'Browser storage and cookie controls are available for your review.' : 'Some browser privacy controls could not be confirmed.', icon: 'eye' },
    { id: 'permissions', label: 'Permission controls', state: permissionApi ? 'passed' : 'unavailable', detail: permissionApi ? 'Your browser exposes permission controls. Review notifications, camera, microphone, and location in browser settings.' : 'This browser does not expose its permission controls to this page.', icon: 'activity' },
    { id: 'connection', label: 'Connection information', state: online ? (connection.connection ? 'passed' : 'unavailable') : 'attention', detail: online ? connectionDetail : 'The browser currently reports that it is offline.', icon: 'wifi' },
    { id: 'native', label: 'Apps, files, and malware', state: 'unavailable', detail: 'A website cannot inspect installed applications, internal storage, private photos, SMS, call history, operating-system malware, or hidden background processes.', icon: 'scan' },
  ];
};

const labelForState = (state: State) => state === 'passed' ? 'Passed' : state === 'attention' ? 'Review' : 'Unavailable';
const iconForState = (state: State): IconName => state === 'passed' ? 'check' : state === 'attention' ? 'alert' : 'info';

export function SecurityScan({ go }: { go: (to: Route) => void }) {
  const [stage, setStage] = useState<Stage>('select');
  const [device, setDevice] = useState<DeviceKind | null>(null);
  const [demo, setDemo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const deviceHint = useMemo(() => {
    const touch = navigator.maxTouchPoints > 0 ? 'Touch input is available.' : 'Touch input is not reported.';
    const viewport = `${window.innerWidth} × ${window.innerHeight} viewport`;
    return `${touch} ${viewport} This is a display hint only, not proof of your operating system.`;
  }, []);

  const currentName = progress < 18 ? 'Preparing a private browser check' : progress < 36 ? 'Checking page connection' : progress < 55 ? 'Reviewing secure browser context' : progress < 73 ? 'Checking browser capabilities' : progress < 90 ? 'Reviewing available privacy signals' : 'Preparing your report';
  const activity = [
    'Assessment initialized locally', 'HTTPS connection checked', 'Secure context reviewed',
    'Browser capabilities reviewed', 'Privacy signals reviewed', 'Report ready',
  ].slice(0, Math.max(1, Math.ceil(progress / 18)));

  useEffect(() => {
    if (stage !== 'scanning') return;
    const started = Date.now();
    const timer = window.setInterval(() => {
      const seconds = Math.floor((Date.now() - started) / 1000);
      setElapsed(seconds);
      setProgress(previous => {
        const next = Math.min(100, previous + (previous < 75 ? 4 : previous < 94 ? 2 : 1));
        if (next === 100) {
          window.clearInterval(timer);
          const report = demo ? DEMO_FINDINGS : getFindings();
          setFindings(report);
          const completedAt = new Date().toISOString();
          setSavedAt(completedAt);
          if (!demo) {
            try { localStorage.setItem('sentriq-security-assessment', JSON.stringify({ completedAt, device: device ?? 'Other device', isDemo: false, findings: report } satisfies StoredAssessment)); } catch { setSavedAt(null); }
          }
          window.setTimeout(() => setStage('results'), 420);
        }
        return next;
      });
    }, 180);
    return () => window.clearInterval(timer);
  }, [stage, demo, device]);

  const begin = () => { setProgress(0); setElapsed(0); setFindings([]); setSavedAt(null); setStage('scanning'); };
  const restart = () => { setDemo(false); setDevice(null); setProgress(0); setElapsed(0); setFindings([]); setStage('select'); };

  return (
    <section className="scan-page">
      <div className="scan-wrap">
        <div className="scan-topbar">
          <button className="plain-button" onClick={() => go('/')}><Icon name="arrow-back" size={17} /> Dashboard</button>
          <Badge tone="green"><Icon name="lock" size={13} /> Private browser check</Badge>
        </div>

        {demo && <div className="demo-banner"><Icon name="info" size={18} /><span><b>Demonstration mode.</b> Sample activity and findings only. No device checks are being run.</span></div>}

        {stage === 'select' && <DeviceSelection device={device} setDevice={setDevice} deviceHint={deviceHint} onContinue={() => setStage('intro')} onDemo={() => { setDemo(true); setStage('intro'); }} go={go} />}
        {stage === 'intro' && <ScanIntro device={device} isDemo={demo} onStart={begin} onBack={() => { setDemo(false); setStage('select'); }} />}
        {stage === 'scanning' && <ScanningView progress={progress} elapsed={elapsed} currentName={currentName} activity={activity} isDemo={demo} />}
        {stage === 'results' && <ResultsView findings={findings} device={device} isDemo={demo} completedAt={savedAt} onRestart={restart} onDemoRestart={() => { setDemo(true); setStage('intro'); }} go={go} />}
      </div>
    </section>
  );
}

function DeviceSelection({ device, setDevice, deviceHint, onContinue, onDemo, go }: { device: DeviceKind | null; setDevice: (device: DeviceKind) => void; deviceHint: string; onContinue: () => void; onDemo: () => void; go: (to: Route) => void }) {
  const options: { title: DeviceKind; note: string; icon: IconName }[] = [
    { title: 'Android', note: 'Pixel, Samsung, and other Android phones', icon: 'phone' },
    { title: 'iPhone', note: 'Apple iPhone running iOS', icon: 'phone' },
    { title: 'Other device', note: 'Tablet, desktop, or prefer not to say', icon: 'globe' },
  ];

  return (
    <div className="scan-card">
      <span className="scan-step">STEP 1 OF 3 · DEVICE</span>
      <h1>Choose your device.</h1>
      <p className="scan-lede">This helps tailor educational guidance. It does not verify your operating system or its security.</p>
      <div className="device-options">
        {options.map(option => (
          <button key={option.title} className={`device-option ${device === option.title ? 'selected' : ''}`} onClick={() => setDevice(option.title)} aria-pressed={device === option.title}>
            <span className="device-icon"><Icon name={option.icon} size={22} /></span>
            <span><b>{option.title}</b><small>{option.note}</small></span>
            <span className="radio-dot" />
          </button>
        ))}
      </div>
      <div className="scan-hint"><Icon name="info" size={17} /><span><b>Available browser information</b><small>{deviceHint}</small></span></div>
      <div className="scan-actions">
        <button className="secondary-button" onClick={onDemo}><Icon name="spark" size={16} /> Try demo</button>
        <button className="primary-button" disabled={!device} onClick={onContinue}>Continue <Icon name="arrow" size={17} /></button>
      </div>
      <button className="text-button scan-back" onClick={() => go('/')}>Back to dashboard</button>
    </div>
  );
}

function ScanIntro({ device, isDemo, onStart, onBack }: { device: DeviceKind | null; isDemo: boolean; onStart: () => void; onBack: () => void }) {
  return (
    <div className="scan-card scan-intro">
      <div className="intro-visual"><span><Icon name="scan" size={42} /></span></div>
      <span className="scan-step">{isDemo ? 'DEMONSTRATION MODE' : `STEP 2 OF 3 · ${device ?? 'DEVICE'}`}</span>
      <h1>Ready to check your browser security?</h1>
      <p className="scan-lede">This is a browser-based assessment, not a full antivirus scan. It checks this page and browser-accessible security signals.</p>
      <div className="limit-grid">
        <div><span className="limit-icon good"><Icon name="check" size={16} /></span><span><b>It can check</b><small>HTTPS, secure context, browser capabilities, and available privacy or connection signals.</small></span></div>
        <div><span className="limit-icon bad"><Icon name="close" size={16} /></span><span><b>It cannot check</b><small>Apps, files, photos, messages, calls, operating-system malware, or hidden processes.</small></span></div>
      </div>
      <div className="scan-actions">
        <button className="secondary-button" onClick={onBack}><Icon name="arrow-back" size={16} /> Back</button>
        <button className="primary-button" onClick={onStart}>{isDemo ? 'Start demonstration' : 'Start assessment'} <Icon name="arrow" size={17} /></button>
      </div>
    </div>
  );
}

function ScanningView({ progress, elapsed, currentName, activity, isDemo }: { progress: number; elapsed: number; currentName: string; activity: string[]; isDemo: boolean }) {
  return (
    <div className="scan-card scan-running">
      <div className="running-topline"><Badge tone="blue">{isDemo ? 'Demo running' : 'Assessment running'}</Badge><span><i /> Local browser check</span></div>
      <div className="scan-gauge-wrap">
        <SecurityGauge value={progress} label="Complete" caption="Local progress" tone="blue" size={196} />
      </div>
      <h1>{currentName}</h1>
      <p className="scan-elapsed">Elapsed time <b>00:{String(elapsed).padStart(2, '0')}</b></p>
      <div className="running-grid">
        <div className="log-panel">
          <div className="panel-heading"><span>ACTIVITY LOG</span><span>{activity.length} EVENTS</span></div>
          {activity.map((item, index) => (
            <div className="log-item" key={item}>
              <span className={index === activity.length - 1 && progress < 100 ? 'active' : ''}>{index === activity.length - 1 && progress < 100 ? <i /> : <Icon name="check" size={12} />}</span>
              {item}
              <time>{index === activity.length - 1 && progress < 100 ? 'NOW' : 'DONE'}</time>
            </div>
          ))}
        </div>
        <aside className="privacy-panel">
          <div className="panel-heading"><span>PRIVACY</span><span className="live-dot">LIVE</span></div>
          <div><Icon name="lock" size={18} /><span><b>Private session</b><small>Checks run in this browser.</small></span></div>
          <div><Icon name="scan" size={18} /><span><b>No file access</b><small>Native data stays unavailable.</small></span></div>
          <div><Icon name="shield" size={18} /><span><b>Clear boundaries</b><small>No threat claims without evidence.</small></span></div>
        </aside>
      </div>
    </div>
  );
}

function ResultsView({ findings, device, isDemo, completedAt, onRestart, onDemoRestart, go }: { findings: Finding[]; device: DeviceKind | null; isDemo: boolean; completedAt: string | null; onRestart: () => void; onDemoRestart: () => void; go: (route: Route) => void }) {
  const passed = findings.filter(finding => finding.state === 'passed').length;
  const attention = findings.filter(finding => finding.state === 'attention').length;
  const unavailable = findings.filter(finding => finding.state === 'unavailable').length;
  const score = findings.length ? Math.round((passed / findings.length) * 100) : 0;
  const formattedDate = completedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(completedAt)) : 'Just now';
  const groups: { title: string; detail: string; state: State; items: Finding[] }[] = [
    { title: 'Passed checks', detail: 'Signals this browser could confirm.', state: 'passed', items: findings.filter(item => item.state === 'passed') },
    { title: 'Needs attention', detail: 'Review these settings yourself.', state: 'attention', items: findings.filter(item => item.state === 'attention') },
    { title: 'Checks we could not perform', detail: 'These need native access or explicit permission.', state: 'unavailable', items: findings.filter(item => item.state === 'unavailable') },
  ];

  return (
    <div className="results-page">
      <div className="result-hero">
        <div>
          <span className="scan-step">{isDemo ? 'DEMONSTRATION RESULTS · SAMPLE ONLY' : 'ASSESSMENT COMPLETE'}</span>
          <h1>{isDemo ? 'Sample report,' : 'Your browser report,'}<br /><span className="accent-text">{isDemo ? 'clearly marked.' : 'clearly explained.'}</span></h1>
          <p>{isDemo ? 'These findings are simulated for demonstration. They describe no aspect of your actual device.' : 'Findings are limited to what this browser can observe. No device files, applications, or operating-system processes were scanned.'}</p>
        </div>
        <SecurityGauge value={score} label="Passed" caption={`${passed} of ${findings.length} checks`} tone={attention ? 'orange' : 'green'} size={176} />
      </div>

      <div className="result-stats">
        <div><span className="stat-icon green"><Icon name="check" size={18} /></span><b>{passed}</b><small>PASSED</small></div>
        <div><span className="stat-icon orange"><Icon name="alert" size={18} /></span><b>{attention}</b><small>NEEDS ATTENTION</small></div>
        <div><span className="stat-icon neutral"><Icon name="info" size={18} /></span><b>{unavailable}</b><small>NOT AVAILABLE</small></div>
      </div>

      <div className="result-layout">
        <div className="findings-column">
          {groups.map(group => group.items.length > 0 && (
            <section className="findings-group" key={group.state}>
              <div className="group-heading"><div><h2>{group.title}</h2><p>{group.detail}</p></div><Badge tone={group.state === 'passed' ? 'green' : group.state === 'attention' ? 'orange' : 'neutral'}>{group.items.length}</Badge></div>
              {group.items.map(finding => <FindingRow key={finding.id} finding={finding} />)}
            </section>
          ))}
          <p className="result-device"><Icon name="phone" size={15} /> Selected device: {device ?? 'Other device'} · {formattedDate}</p>
        </div>

        <aside className="recommendation-card">
          <span className="scan-step">NEXT STEPS</span>
          <h2>Security recommendations</h2>
          <ol>
            <li><b>Keep your phone and apps updated.</b><span>System updates often close known security gaps.</span></li>
            <li><b>Review app permissions.</b><span>Remove access that is no longer needed.</span></li>
            <li><b>Use official download sources.</b><span>Avoid apps from links in unexpected messages.</span></li>
            <li><b>Choose trusted protection.</b><span>Compare reputable tools for your platform.</span></li>
          </ol>
          <button className="primary-button full" onClick={() => go('/products')}><Icon name="shield-check" size={17} /> Explore protection</button>
        </aside>
      </div>

      <div className="result-actions">
        <button className="secondary-button" onClick={isDemo ? onDemoRestart : onRestart}><Icon name="refresh" size={17} /> Run another scan</button>
        <button className="plain-button" onClick={() => go('/')}><Icon name="arrow-back" size={16} /> Back to dashboard</button>
      </div>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  return (
    <article className={`finding-row finding-${finding.state}`}>
      <span className={`finding-icon tone-${finding.state === 'passed' ? 'green' : finding.state === 'attention' ? 'orange' : 'red'}`}><Icon name={finding.icon} size={18} /></span>
      <span className="finding-copy"><b>{finding.label}</b><small>{finding.detail}</small></span>
      <span className={`finding-state state-${finding.state}`}><Icon name={iconForState(finding.state)} size={13} /> {labelForState(finding.state)}</span>
    </article>
  );
}
