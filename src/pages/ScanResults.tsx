import { useEffect, useState } from 'react';
import type { Route } from '../components/ui';
import { Badge, Icon } from '../components/ui';
import { ScanFindingList, ScanNotice } from '../components/Scanner';
import { clearAssessment, formatAssessmentDate, readStoredAssessment, scoreFromFindings } from '../scan';

export function ScanResults({ go }: { go: (route: Route) => void }) {
  const [assessment, setAssessment] = useState(() => readStoredAssessment());

  useEffect(() => {
    const load = () => setAssessment(readStoredAssessment());
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  if (!assessment) {
    return (
      <section className="results-page scan-results-page">
        <div className="results-page-inner">
          <article className="scan-card scan-results-empty">
            <span className="scanner-visual"><span><Icon name="scan" size={36} /></span></span>
            <span className="scan-ui-step">NO SAVED ASSESSMENT</span>
            <h1>No assessment yet</h1>
            <p>Run a browser check to see real results. SENTRIQ will only show signals this browser can actually confirm.</p>
            <button className="scanner-primary" onClick={() => go('/security-scan')}><Icon name="scan" size={16} /> Start Scan</button>
          </article>
        </div>
      </section>
    );
  }

  const score = scoreFromFindings(assessment.findings);
  const counts = assessment.findings.reduce((total, finding) => {
    total[finding.state] += 1;
    return total;
  }, { passed: 0, attention: 0, unavailable: 0 });
  const date = formatAssessmentDate(assessment.completedAt);
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
          <button className="scanner-secondary" onClick={() => go('/security-scan')}><Icon name="refresh" size={15} /> Run scan again</button>
          <button className="scanner-secondary" onClick={() => go('/')}><Icon name="arrow-back" size={15} /> Dashboard</button>
          <button className="scanner-cancel" onClick={clear}>Clear saved result</button>
        </div>
      </div>
    </section>
  );
}
