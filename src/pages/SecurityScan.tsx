import { useEffect, useRef, useState } from 'react';
import type { Route } from '../components/ui';
import { Badge, Icon } from '../components/ui';
import { DeviceChoice, ScanCheckList, ScanFindingList, ScanNotice, ScanProgressRing, ScanStepHeader } from '../components/Scanner';
import {
  clearAssessment,
  demoFindings,
  detectPlatformHint,
  formatAssessmentDate,
  isAssessmentHistoryEnabled,
  runBrowserChecks,
  saveAssessment,
  scanActivities,
  type Platform,
  type ScanFinding,
} from '../scan';

type Stage = 'start' | 'platform' | 'scanning' | 'complete';

const sleep = (duration: number) => new Promise<void>(resolve => { window.setTimeout(resolve, duration); });

export function SecurityScan({ go, onlyReal = false }: { go: (to: Route) => void; onlyReal?: boolean }) {
  const [stage, setStage] = useState<Stage>('start');
  const [device, setDevice] = useState<Platform | null>(null);
  const [demo, setDemo] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>([]);
  const [findings, setFindings] = useState<ScanFinding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saveWarning, setSaveWarning] = useState<string | null>(null);
  const [finishedAt, setFinishedAt] = useState<string | null>(null);
  const runRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const hint = useRef(detectPlatformHint()).current;

  useEffect(() => () => {
    runRef.current += 1;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const reset = (nextStage: Stage = 'start') => {
    runRef.current += 1;
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
    setStage(nextStage);
    setProgress(0);
    setActiveIndex(0);
    setCompleted([]);
    setFindings([]);
    setError(null);
    setSaveWarning(null);
    setFinishedAt(null);
    setDemo(false);
    setDevice(null);
  };

  const startScan = async () => {
    if (!device) return;
    const token = ++runRef.current;
    clearAssessment();
    setStage('scanning');
    setProgress(0);
    setActiveIndex(0);
    setCompleted([]);
    setFindings([]);
    setError(null);
    setSaveWarning(null);
    setFinishedAt(null);

    let available: ScanFinding[];
    try {
      available = demo && !onlyReal ? demoFindings() : runBrowserChecks();
    } catch {
      available = [{
        id: 'error',
        label: 'Security Configuration',
        state: 'unavailable',
        detail: 'The browser check could not be completed because this browser blocked the required API.',
        icon: 'info',
      }];
      setError('One or more checks were unavailable. Available results will still be shown.');
    }

    for (let index = 0; index < scanActivities.length; index += 1) {
      if (runRef.current !== token) return;
      const activity = scanActivities[index];
      setActiveIndex(index);
      await sleep(420);
      if (runRef.current !== token) return;
      const group = available.filter(finding => (activity.ids as readonly string[]).includes(finding.id));
      setFindings(previous => [...previous, ...group]);
      setCompleted(previous => [...previous, activity.title]);
      setProgress(Math.round(((index + 1) / scanActivities.length) * 100));
    }

    if (runRef.current !== token) return;
    const completedAt = new Date().toISOString();
    const historyEnabled = isAssessmentHistoryEnabled();
    const saved = saveAssessment({ completedAt, device, isDemo: demo, findings });
    setFinishedAt(completedAt);
    if (!saved) setSaveWarning(historyEnabled
      ? 'This browser blocked local storage, so the results cannot be restored after leaving the page.'
      : 'Assessment history is turned off in Settings, so this result was not saved.');
    setStage('complete');
    timerRef.current = window.setTimeout(() => {
      if (runRef.current === token) go('/results');
    }, 600);
  };

  const cancelScan = () => {
    reset('start');
    setError('Scan cancelled. No results were saved.');
  };

  const currentActivity = scanActivities[Math.min(activeIndex, scanActivities.length - 1)];
  const remaining = scanActivities.slice(activeIndex + 1).map(activity => activity.title);
  const finishedLabel = finishedAt ? formatAssessmentDate(finishedAt) : null;

  return (
    <section className="scan-page device-scanner-page">
      <div className="scan-wrap device-scanner-wrap">
        <div className="scan-topbar scanner-topbar">
          <button className="plain-button" onClick={() => go('/')}><Icon name="arrow-back" size={16} /> Dashboard</button>
          <Badge tone="green"><Icon name="lock" size={13} /> Private browser check</Badge>
        </div>

        {demo && stage !== 'start' && (
          <div className="demo-banner scanner-demo-banner">
            <Icon name="alert" size={17} />
            <span><b>DEMONSTRATION.</b> These are sample values. No browser check or device scan was performed.</span>
          </div>
        )}

        {error && <ScanNotice tone="warning">{error}</ScanNotice>}
        {saveWarning && <ScanNotice tone="warning">{saveWarning}</ScanNotice>}

        {stage === 'start' && (
          <article className="scan-card scanner-card scanner-start">
            <div className="scanner-visual"><span><Icon name="scan" size={38} /></span></div>
            <ScanStepHeader
              step="STEP 1 · START SCAN"
              title="Check Your Device"
              text="Review the security signals available to your browser."
              aside={<Badge tone={onlyReal ? 'green' : 'blue'}>{onlyReal ? 'Live checks only' : 'Browser only'}</Badge>}
            />
            <div className="scanner-limits">
              <div><span className="limit-icon good"><Icon name="check" size={15} /></span><span><b>What it checks</b><small>HTTPS, secure context, browser capabilities, privacy signals, and verifiable configuration.</small></span></div>
              <div><span className="limit-icon bad"><Icon name="close" size={15} /></span><span><b>What it cannot check</b><small>Files, installed apps, photos, messages, calls, operating-system malware, or background processes.</small></span></div>
            </div>
            <div className="scanner-actions">
              {!onlyReal && <button className="scanner-secondary" onClick={() => { setDemo(true); setStage('platform'); }}>Preview demonstration</button>}
              <button className="scanner-primary" onClick={() => setStage('platform')}><Icon name="scan" size={16} /> Start Scan</button>
            </div>
          </article>
        )}

        {stage === 'platform' && (
          <article className="scan-card scanner-card scanner-platform">
            <ScanStepHeader
              step={`STEP 2 · DEVICE PLATFORM${demo ? ' · DEMONSTRATION' : ''}`}
              title="Confirm your platform"
              text="Choose the platform you want the guidance to match. Browser hints are shown, but only your selection is used."
              aside={<Badge tone={hint.suggested ? 'green' : 'neutral'}>{hint.label}</Badge>}
            />
            <DeviceChoice value={device} suggested={hint.suggested} hint={hint.detail} onSelect={setDevice} />
            <div className="scanner-actions">
              <button className="scanner-secondary" onClick={() => reset('start')}><Icon name="arrow-back" size={15} /> Back</button>
              <button className="scanner-primary" disabled={!device} onClick={startScan}>Continue <Icon name="arrow" size={16} /></button>
            </div>
          </article>
        )}

        {stage === 'scanning' && (
          <article className="scan-card scanner-card scanner-running">
            <div className="scanner-running-top">
              <span><i /> <b>{demo ? 'DEMONSTRATION' : 'LIVE BROWSER CHECK'}</b></span>
              <span>{completed.length} of {scanActivities.length} checks complete</span>
            </div>
            <ScanProgressRing value={progress} label="Complete" />
            <div className="scanner-current">
              <span className="scanner-current-step">CURRENT ACTIVITY</span>
              <h2>{currentActivity.title}</h2>
              <p>{currentActivity.detail}</p>
            </div>
            <ScanCheckList completed={completed} remaining={remaining} />
            <div className="scanner-running-foot">
              <p><Icon name="lock" size={13} /> No device storage or installed applications are accessed.</p>
              <button className="scanner-cancel" onClick={cancelScan}>Cancel scan</button>
            </div>
          </article>
        )}

        {stage === 'complete' && (
          <article className="scan-card scanner-card scanner-complete">
            <div className="scanner-visual"><span><Icon name="shield-check" size={38} /></span></div>
            <ScanStepHeader
              step={`STEP 4 · COMPLETE${demo ? ' · DEMONSTRATION' : ''}`}
              title="Checks complete"
              text={demo ? 'Demonstration values are ready. No live check was performed.' : 'All available browser checks are complete. Opening your results.'}
            />
            <ScanFindingList findings={findings} />
            <div className="scanner-complete-meta">
              <Icon name="clock" size={14} />
              <span>{finishedLabel ? `Completed ${finishedLabel}` : 'Completed just now'}</span>
            </div>
            <div className="scanner-actions">
              <button className="scanner-secondary" onClick={() => reset('start')}>Run another scan</button>
              <button className="scanner-primary" onClick={() => go('/results')}>View results <Icon name="arrow" size={15} /></button>
            </div>
          </article>
        )}
      </div>
    </section>
  );
}
