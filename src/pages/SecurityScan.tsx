import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Route } from '../components/ui';
import { Eyebrow, Icon, type IconName } from '../components/ui';

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
    { id: 'privacy', label: 'Local privacy signals', state: storageAvailable && cookieAvailable ? 'passed' : 'attention', detail: storageAvailable && cookieAvailable ? 'Browser storage and cookie controls are available for your review.' : 'Some browser privacy controls could not be confirmed.', icon: 'spark' },
    { id: 'permissions', label: 'Permission controls', state: permissionApi ? 'passed' : 'unavailable', detail: permissionApi ? 'Your browser exposes permission controls. Review notifications, camera, microphone, and location in browser settings.' : 'This browser does not expose its permission controls to this page.', icon: 'activity' },
    { id: 'connection', label: 'Connection information', state: online ? (connection.connection ? 'passed' : 'unavailable') : 'attention', detail: online ? connectionDetail : 'The browser currently reports that it is offline.', icon: 'activity' },
    { id: 'native', label: 'Apps, files, and malware', state: 'unavailable', detail: 'A website cannot inspect installed applications, internal storage, private photos, SMS, call history, operating-system malware, or hidden background processes.', icon: 'scan' },
  ];
};

const labelForState = (state: State) => state === 'passed' ? 'Passed' : state === 'attention' ? 'Needs attention' : 'Not available';
const iconForState = (state: State): IconName => state === 'passed' ? 'check' : state === 'attention' ? 'activity' : 'close';

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
    return `${touch} ${viewport} We use this only as a display hint, not proof of your operating system or device security.`;
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
            try { localStorage.setItem('sentriq-security-assessment', JSON.stringify({ completedAt, device: device ?? 'Other device', isDemo: false, findings: report } satisfies StoredAssessment)); } catch { /* Local persistence is optional. */ }
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
  const startDemo = () => { setDemo(true); setStage('intro'); };

  return <section className="scan-page">
    <div className="scan-wrap">
      <div className="scan-topline"><span><Icon name="shield" size={15}/> SENTRIQ SECURITY ASSESSMENT</span><button className="scan-exit" onClick={() => go('/')}>Exit assessment <Icon name="close" size={15}/></button></div>
      {demo && <div className="demo-banner"><Icon name="spark" size={16}/><span><b>DEMONSTRATION MODE</b> — sample activity and findings only. No device checks are being run.</span></div>}
      {stage === 'select' && <DeviceSelection device={device} setDevice={setDevice} deviceHint={deviceHint} onContinue={() => setStage('intro')} onDemo={startDemo}/>} 
      {stage === 'intro' && <ScanIntro device={device} isDemo={demo} onStart={begin} onBack={() => { setDemo(false); setStage('select'); }}/>} 
      {stage === 'scanning' && <ScanningView progress={progress} elapsed={elapsed} currentName={currentName} activity={activity} isDemo={demo}/>} 
      {stage === 'results' && <ResultsView findings={findings} device={device} isDemo={demo} completedAt={savedAt} onRestart={restart} onDemoRestart={() => { setDemo(true); setStage('intro'); }} go={go}/>} 
    </div>
  </section>;
}

function DeviceSelection({ device, setDevice, deviceHint, onContinue, onDemo }: { device: DeviceKind | null; setDevice: (device: DeviceKind) => void; deviceHint: string; onContinue: () => void; onDemo: () => void }) {
  const options: { title: DeviceKind; note: string; icon: IconName }[] = [
    { title: 'Android', note: 'Google Pixel, Samsung, and other Android phones', icon: 'phone' },
    { title: 'iPhone', note: 'Apple iPhone running iOS', icon: 'phone' },
    { title: 'Other device', note: 'Tablet, desktop, or a device you would rather not identify', icon: 'globe' },
  ];
  return <div className="scan-card scan-selection"><Eyebrow>Step 1 of 3 · Device selection</Eyebrow><h1>Start with your<br/><em>device type.</em></h1><p className="scan-lede">Choose a device to tailor the educational recommendations. This choice does not verify your operating system or its security.</p><div className="scan-device-hint"><Icon name="activity" size={17}/><span><b>Available browser information</b><small>{deviceHint}</small></span></div><div className="scan-device-options">{options.map(option => <button key={option.title} className={`scan-device-option ${device === option.title ? 'selected' : ''}`} onClick={() => setDevice(option.title)} aria-pressed={device === option.title}><span className="scan-device-icon"><Icon name={option.icon} size={22}/></span><span><b>{option.title}</b><small>{option.note}</small></span><span className="scan-radio"/></button>)}</div><div className="scan-actions"><button className="scan-action-secondary" onClick={onDemo}>Try demonstration mode <Icon name="spark" size={16}/></button><button className="sq-button sq-button-primary" disabled={!device} onClick={onContinue}>Continue <Icon name="arrow" size={17}/></button></div></div>;
}

function ScanIntro({ device, isDemo, onStart, onBack }: { device: DeviceKind | null; isDemo: boolean; onStart: () => void; onBack: () => void }) {
  return <div className="scan-card scan-intro"><div className="scan-intro-art"><div className="scan-intro-rings"/><span><Icon name="scan" size={42}/></span></div><Eyebrow>{isDemo ? 'Demonstration mode · Sample data only' : `Step 2 of 3 · ${device ?? 'Device'} selected`}</Eyebrow><h1>Ready to Check Your<br/><em>Device Security?</em></h1><p className="scan-lede">This is a browser-based security assessment, not a full antivirus scan. It checks the current page, browser-accessible security signals, and available browser capabilities.</p><div className="scan-limit-grid"><span><Icon name="check" size={15}/></span><b>It can check</b><small>HTTPS, secure context, browser capabilities, and available privacy or connection signals.</small><span><Icon name="close" size={15}/></span><b>It cannot check</b><small>Apps, files, photos, messages, calls, operating-system malware, or hidden processes.</small></div><div className="scan-actions"><button className="scan-action-secondary" onClick={onBack}>Back</button><button className="sq-button sq-button-primary" onClick={onStart}>{isDemo ? 'Start Demonstration' : 'Start Security Assessment'} <Icon name="arrow" size={17}/></button></div></div>;
}

function ScanningView({ progress, elapsed, currentName, activity, isDemo }: { progress: number; elapsed: number; currentName: string; activity: string[]; isDemo: boolean }) {
  const progressStyle = { '--scan-progress': `${progress * 3.6}deg` } as CSSProperties & Record<'--scan-progress', string>;
  return <div className="scan-card scan-running"><div className="scan-running-label"><span><i/> {isDemo ? 'DEMONSTRATION RUNNING' : 'ASSESSMENT RUNNING'}</span><span>LOCAL BROWSER CHECK</span></div><div className="scan-progress-wrap"><div className="scan-progress" style={progressStyle}><div><strong>{progress}%</strong><small>COMPLETE</small></div></div><div className="scan-pulse scan-pulse-a"/><div className="scan-pulse scan-pulse-b"/></div><h1>{currentName}</h1><p className="scan-elapsed">Elapsed time <b>00:{String(elapsed).padStart(2, '0')}</b></p><div className="scan-running-grid"><div className="scan-log"><div className="scan-panel-heading"><span>ACTIVITY LOG</span><span>{activity.length} EVENTS</span></div>{activity.map((item, index) => <div className="scan-log-item" key={item}><span className={index === activity.length - 1 && progress < 100 ? 'active' : ''}>{index === activity.length - 1 && progress < 100 ? <i/> : <Icon name="check" size={12}/>}</span>{item}<time>{index === activity.length - 1 && progress < 100 ? 'NOW' : 'DONE'}</time></div>)}</div><aside className="scan-status-panel"><div className="scan-panel-heading"><span>STATUS</span><span className="scan-live">LIVE</span></div><div><Icon name="lock" size={17}/><span><b>Private session</b><small>Checks run in this browser.</small></span></div><div><Icon name="scan" size={17}/><span><b>No file access</b><small>Native data stays unavailable.</small></span></div><div><Icon name="shield" size={17}/><span><b>Clear boundaries</b><small>No threat claims without evidence.</small></span></div></aside></div></div>;
}

function ResultsView({ findings, device, isDemo, completedAt, onRestart, onDemoRestart, go }: { findings: Finding[]; device: DeviceKind | null; isDemo: boolean; completedAt: string | null; onRestart: () => void; onDemoRestart: () => void; go: (route: Route) => void }) {
  const passed = findings.filter(finding => finding.state === 'passed').length;
  const attention = findings.filter(finding => finding.state === 'attention').length;
  const unavailable = findings.filter(finding => finding.state === 'unavailable').length;
  const formattedDate = completedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(completedAt)) : 'Just now';
  return <div className="scan-results"><div className="scan-result-hero"><div><Eyebrow>{isDemo ? 'Demonstration results · Sample only' : 'Assessment complete · Browser-accessible results'}</Eyebrow><h1>{isDemo ? 'Sample report,' : 'Your browser report,'}<br/><em>{isDemo ? 'clearly marked.' : 'clearly explained.'}</em></h1><p>{isDemo ? 'These findings are simulated for product demonstration. They describe no aspect of your actual device.' : 'These findings are limited to what this browser can observe. No device files, applications, or operating-system processes were scanned.'}</p></div><div className="scan-summary"><span><b>{passed}</b><small>PASSED</small></span><span><b>{attention}</b><small>NEEDS ATTENTION</small></span><span><b>{unavailable}</b><small>NOT AVAILABLE</small></span><i>{formattedDate}</i></div></div><div className="scan-result-layout"><div className="scan-findings"><div className="scan-result-section-head"><div><h2>Verified checks</h2><p>Checks that the browser could confirm on this page.</p></div><span>{device ?? 'Other device'}</span></div>{findings.filter(finding => finding.state === 'passed').map(finding => <FindingRow key={finding.id} finding={finding}/>) }{attention > 0 && <><div className="scan-result-section-head unavailable-head"><div><h2>Needs attention</h2><p>Review these browser or connection settings yourself.</p></div></div>{findings.filter(finding => finding.state === 'attention').map(finding => <FindingRow key={finding.id} finding={finding}/>)}</>}<div className="scan-result-section-head unavailable-head"><div><h2>Checks we could not perform</h2><p>These require a native app, system access, or explicit permissions.</p></div></div>{findings.filter(finding => finding.state === 'unavailable').map(finding => <FindingRow key={finding.id} finding={finding}/>)}</div><aside className="scan-recommendations"><Eyebrow>Next steps</Eyebrow><h2>Security recommendations</h2><ol><li><b>Keep your phone and apps updated.</b><span>System updates often contain important security fixes.</span></li><li><b>Review permissions and notifications.</b><span>Remove access that no longer makes sense for an app or website.</span></li><li><b>Use a device lock and unique passwords.</b><span>Enable multi-factor authentication on important accounts.</span></li><li><b>Use trusted help for suspected compromise.</b><span>Contact the provider or a qualified technician through a trusted channel.</span></li></ol><div className="scan-compat"><Icon name="phone" size={18}/><span><b>Device compatibility</b><small>{device === 'iPhone' ? 'iOS limits browser and security-app access to other apps and files.' : device === 'Android' ? 'Android security apps may offer more checks, with permissions you choose to grant.' : 'Capabilities vary by browser and device; this report is browser-only.'}</small></span></div></aside></div><div className="scan-result-actions"><button className="scan-action-secondary" onClick={onRestart}>Run Assessment Again <Icon name="scan" size={16}/></button>{isDemo && <button className="scan-action-secondary" onClick={onDemoRestart}>Restart Demo <Icon name="spark" size={16}/></button>}<button className="sq-button sq-button-quiet" onClick={() => go('/antivirus')}>Explore Antivirus Products <Icon name="arrow" size={16}/></button><button className="sq-button sq-button-primary" onClick={() => go('/support')}>Contact Technical Support <Icon name="arrow" size={16}/></button></div></div>;
}

function FindingRow({ finding }: { finding: Finding }) { return <article className={`scan-finding scan-finding-${finding.state}`}><span className="scan-finding-icon"><Icon name={finding.icon} size={18}/></span><div><b>{finding.label}</b><p>{finding.detail}</p></div><span className="scan-state"><Icon name={iconForState(finding.state)} size={13}/>{labelForState(finding.state)}</span></article>; }
