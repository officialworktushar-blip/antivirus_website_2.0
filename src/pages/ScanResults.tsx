import { Component, useEffect, useState, type ReactNode } from 'react';
import type { Route, IconName } from '../components/ui';
import { Badge, Icon } from '../components/ui';
import { ScanFindingList, ScanNotice, ScanProgressRing } from '../components/Scanner';
import {
  ASSESSMENT_STORAGE_KEY,
  clearAssessment,
  formatAssessmentDate,
  scoreFromFindings,
  type ScanFinding,
  type ScanState,
} from '../scan';

const supportedStates = ['passed', 'attention', 'unavailable'] as const;

type DisplayAssessment = {
  completedAt: string;
  device: string;
  isDemo: boolean;
  findings: ScanFinding[];
  partial: boolean;
};

function isScanState(value: unknown): value is ScanState {
  return typeof value === 'string' && (supportedStates as readonly string[]).includes(value);
}

function displayDate(value: string): string | null {
  if (!value) return null;
  try {
    return formatAssessmentDate(value);
  } catch {
    return null;
  }
}

function displayScore(findings: ScanFinding[]): number | null {
  try {
    return scoreFromFindings(findings);
  } catch {
    return null;
  }
}

function readDisplayAssessment(): DisplayAssessment | null {
  try {
    const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const record = parsed as Record<string, unknown>;
    const sourceFindings = Array.isArray(record.findings) ? record.findings : [];
    const findings: ScanFinding[] = [];
    let partial = !Array.isArray(record.findings);

    sourceFindings.forEach((entry) => {
      if (!entry || typeof entry !== 'object') {
        partial = true;
        return;
      }
      const finding = entry as Record<string, unknown>;
      if (
        typeof finding.id !== 'string'
        || typeof finding.label !== 'string'
        || typeof finding.detail !== 'string'
        || !isScanState(finding.state)
      ) {
        partial = true;
        return;
      }
      findings.push({
        id: finding.id,
        label: finding.label,
        detail: finding.detail,
        state: finding.state,
        icon: typeof finding.icon === 'string' ? finding.icon as IconName : 'info',
      });
    });

    if (!findings.length) return null;

    const device = typeof record.device === 'string' && record.device.trim() ? record.device : 'Device';
    const completedAt = typeof record.completedAt === 'string' ? record.completedAt : '';
    if (device === 'Device' || !displayDate(completedAt) || record.isDemo !== true && record.isDemo !== false) partial = true;

    return {
      completedAt,
      device,
      isDemo: record.isDemo === true,
      findings,
      partial,
    };
  } catch {
    return null;
  }
}

function EmptyState({ go, failed = false }: { go: (route: Route) => void; failed?: boolean }) {
  return (
    <section className="results-page scan-results-page">
      <div className="results-page-inner">
        <article className="scan-card scan-results-empty">
          <span className="scanner-visual"><span><Icon name={failed ? 'alert' : 'scan'} size={36} /></span></span>
          <span className="scan-ui-step">{failed ? 'RESULTS UNAVAILABLE' : 'ASSESSMENT RESULTS'}</span>
          <h1>{failed ? 'Results Could Not Be Displayed' : 'No Assessment Available'}</h1>
          <p>{failed
            ? 'The saved report could not be read safely. Start a new device check to continue.'
            : 'Complete a device security assessment to view your results here.'}</p>
          <button className="scanner-primary" onClick={() => go('/security-scan')}>Check Your Device</button>
        </article>
      </div>
    </section>
  );
}

class ResultsBoundary extends Component<{ go: (route: Route) => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return <EmptyState go={this.props.go} failed />;
    return this.props.children;
  }
}

function ResultsContent({ go }: { go: (route: Route) => void }) {
  const [assessment, setAssessment] = useState<DisplayAssessment | null>(() => readDisplayAssessment());

  useEffect(() => {
    const load = () => setAssessment(readDisplayAssessment());
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  if (!assessment) return <EmptyState go={go} />;

  const score = displayScore(assessment.findings);
  const counts = { passed: 0, attention: 0, unavailable: 0 };
  assessment.findings.forEach((finding) => {
    if (finding.state === 'passed') counts.passed += 1;
    else if (finding.state === 'attention') counts.attention += 1;
    else if (finding.state === 'unavailable') counts.unavailable += 1;
  });
  const date = displayDate(assessment.completedAt);
  const clear = () => {
    clearAssessment();
    setAssessment(null);
  };

  return (
    <section className="results-page scan-results-page">
      <div className="results-page-inner">
        <div className="scan-results-heading">
          <div>
            <span className="scan-ui-step">{assessment.isDemo ? 'DEMONSTRATION · SAMPLE RESULTS' : 'BROWSER ASSESSMENT RESULTS'}</span>
            <h1>{assessment.isDemo ? 'Demonstration report' : 'Your browser report'}</h1>
            <p>{assessment.isDemo
              ? 'These values are samples only. No browser check or device scan was performed.'
              : 'Findings are limited to what this browser could observe. No files, apps, messages, or system processes were scanned.'}</p>
          </div>
          <Badge tone={assessment.isDemo ? 'orange' : 'green'}>{assessment.isDemo ? 'Demonstration' : 'Complete'}</Badge>
        </div>

        {assessment.partial && (
          <ScanNotice tone="warning">Some saved details were incomplete and were omitted. The findings below are the valid saved results.</ScanNotice>
        )}
        {assessment.isDemo && (
          <ScanNotice tone="warning"><b>DEMONSTRATION.</b> Sample findings are shown for illustration only and are not actual results.</ScanNotice>
        )}

        <div className="scan-results-hero">
          <div>
            <span className="scan-ui-step">{assessment.isDemo ? 'SAMPLE SCORE' : 'PROTECTION SCORE'}</span>
            <h2>{assessment.isDemo ? 'How a report looks' : score === null ? 'No score available' : score === 100 ? 'All visible checks passed' : 'Review the details below'}</h2>
            <p>Selected platform: {assessment.device} · {date ?? 'Completed recently'}</p>
          </div>
          <ScanProgressRing value={score ?? 0} label={assessment.isDemo ? 'Sample' : 'Passed'} />
        </div>

        <div className="scan-results-stats">
          <div><span className="stat-icon green"><Icon name="check" size={18} /></span><b>{counts.passed}</b><small>PASSED</small></div>
          <div><span className="stat-icon orange"><Icon name="alert" size={18} /></span><b>{counts.attention}</b><small>REVIEW</small></div>
          <div><span className="stat-icon neutral"><Icon name="info" size={18} /></span><b>{counts.unavailable}</b><small>UNAVAILABLE</small></div>
        </div>

        <div className="scan-results-layout">
          <section className="findings-group scan-results-findings">
            <div className="group-heading"><div><h2>Available findings</h2><p>Each result states what was checked and what could not be verified.</p></div></div>
            <ScanFindingList findings={assessment.findings} />
          </section>
          <aside className="recommendation-card scan-results-aside">
            <span className="scan-ui-step">NEXT STEPS</span>
            <h2>Keep your device protected</h2>
            <ol>
              <li><b>Review permission controls.</b><span>Check camera, microphone, location, and notifications in your device settings.</span></li>
              <li><b>Keep software updated.</b><span>Install operating-system and app updates from trusted sources.</span></li>
              <li><b>Use a trusted security app.</b><span>A native app is still needed for files, apps, and system-level threats.</span></li>
            </ol>
            <button className="scanner-primary full" onClick={() => go('/products')}>Explore protection <Icon name="arrow" size={15} /></button>
          </aside>
        </div>

        <div className="result-actions scan-results-actions">
          <button className="scanner-secondary" onClick={() => go('/trusted-advisor')}><Icon name="activity" size={15} /> Trusted Advisor</button>
          <button className="scanner-secondary" onClick={() => go('/security-scan')}><Icon name="refresh" size={15} /> Run scan again</button>
          <button className="scanner-secondary" onClick={() => go('/')}><Icon name="arrow-back" size={15} /> Dashboard</button>
          <button className="scanner-cancel" onClick={clear}>Clear saved result</button>
        </div>
      </div>
    </section>
  );
}

export function ScanResults({ go }: { go: (route: Route) => void }) {
  return (
    <ResultsBoundary go={go}>
      <ResultsContent go={go} />
    </ResultsBoundary>
  );
}
