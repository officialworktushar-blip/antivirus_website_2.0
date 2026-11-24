import { useEffect, useState } from 'react';
import type { Route } from '../components/ui';
import { Icon } from '../components/ui';
import { deriveAdvisorReport, type AdvisorEntry, type AdvisorGroup } from '../advisor';
import { formatAssessmentDate, readStoredAssessment } from '../scan';

const ringRadius = 52;
const ringCircumference = 2 * Math.PI * ringRadius;

const groupIcons = { critical: 'alert', minor: 'activity', completed: 'check' } as const;

const stateText = (entry: AdvisorEntry) => {
  if (entry.state === 'passed') return 'Passed';
  if (entry.state === 'attention') return 'Review';
  return 'Unsupported';
};

export function TrustedAdvisor({ go }: { go: (route: Route) => void }) {
  const [assessment, setAssessment] = useState(() => readStoredAssessment());
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    const load = () => setAssessment(readStoredAssessment());
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const report = deriveAdvisorReport(assessment);
  const scoreOffset = ringCircumference * (1 - (report.score ?? 0) / 100);
  const date = assessment ? formatAssessmentDate(assessment.completedAt) : null;

  const renderGroup = (group: AdvisorGroup) => (
    <details className={`advisor-group advisor-group-${group.id}`} key={group.id} open={group.id === 'critical'}>
      <summary>
        <span className={`advisor-group-icon advisor-tone-${group.id === 'critical' ? 'red' : group.id === 'minor' ? 'orange' : 'green'}`}>
          <Icon name={groupIcons[group.id]} size={17} />
        </span>
        <span className="advisor-group-copy"><b>{group.title}</b><small>{group.subtitle}</small></span>
        <span className="advisor-group-count">{group.entries.length}</span>
        <Icon name="chevron" size={15} />
      </summary>
      <div className="advisor-group-body">
        {group.entries.length === 0 ? (
          <p className="advisor-empty">No verified findings in this group.</p>
        ) : group.entries.map(entry => (
          <details className="advisor-issue" key={entry.id}>
            <summary>
              <span className={`advisor-issue-dot advisor-tone-${entry.tone}`} />
              <span className="advisor-issue-title"><b>{entry.title}</b><small>{entry.finding}</small></span>
              <span className={`advisor-issue-state advisor-tone-${entry.tone}`}>{stateText(entry)}</span>
              <Icon name="chevron" size={14} />
            </summary>
            <div className="advisor-issue-body">
              <div className="advisor-detail"><span>Finding</span><p>{entry.finding}</p></div>
              <div className="advisor-detail"><span>Evidence</span><p>{entry.evidence}</p></div>
              <div className="advisor-detail"><span>Risk explanation</span><p>{entry.risk}</p></div>
              <div className="advisor-detail"><span>Recommended action</span><p>{entry.action}</p></div>
            </div>
          </details>
        ))}
      </div>
    </details>
  );

  return (
    <section className="advisor-page">
      <div className="advisor-wrap">
        <header className="advisor-topbar">
          <button className="advisor-back" onClick={() => go('/')}><Icon name="arrow-back" size={16} /> Back</button>
          <h1>Trusted Advisor</h1>
          <button className="advisor-info-button" onClick={() => setInfoOpen(!infoOpen)} aria-expanded={infoOpen} aria-label="How the advisor score works">
            <Icon name="info" size={18} />
          </button>
        </header>

        {infoOpen && (
          <div className="advisor-info">
            <Icon name="info" size={16} />
            <div>
              <b>How this score is calculated</b>
              <p>Only saved browser-assessment findings with explicitly defined rules contribute points. Unsupported checks are shown for context and are excluded from the score. No device files or installed apps are inspected.</p>
            </div>
          </div>
        )}

        <article className={`advisor-card advisor-score-card advisor-tone-${report.tone}`}>
          <div className="advisor-gauge" role="img" aria-label={report.score === null ? 'Assessment Incomplete' : `Protection score ${report.score} out of 100`}>
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle className="advisor-gauge-track" cx="60" cy="60" r={ringRadius} transform="rotate(-90 60 60)" />
              {report.score !== null && (
                <circle className="advisor-gauge-value" cx="60" cy="60" r={ringRadius} transform="rotate(-90 60 60)" strokeDasharray={ringCircumference} strokeDashoffset={scoreOffset} />
              )}
            </svg>
            <div className="advisor-gauge-center">
              <strong>{report.score ?? '—'}{report.score !== null && <small>/100</small>}</strong>
              <span>{report.score === null ? 'Assessment Incomplete' : 'Device Protection Score'}</span>
            </div>
          </div>
          <div className="advisor-score-copy">
            <span className="advisor-eyebrow">PROTECTION STATUS</span>
            <h2>{report.status}</h2>
            <p>{report.score === null ? report.reason : report.statusDetail}</p>
            <div className="advisor-status-row">
              <span className="advisor-tone-red"><i /> {report.criticalCount} critical</span>
              <span className="advisor-tone-orange"><i /> {report.minorCount} minor</span>
              <span className="advisor-tone-green"><i /> {report.completedCount} completed</span>
            </div>
            <small className="advisor-score-date">{date ? `Assessment saved ${date}` : 'No saved assessment date'}</small>
          </div>
        </article>

        <section className="advisor-message">
          <span className="advisor-message-icon"><Icon name="shield-check" size={22} /></span>
          <div><h2>Review Your Device Security</h2><p>Explore the checks that may need your attention.</p></div>
        </section>

        <div className="advisor-groups">{report.groups.map(renderGroup)}</div>

        <article className="advisor-card advisor-support">
          <div className="advisor-support-copy">
            <span className="advisor-support-icon"><Icon name="chat" size={20} /></span>
            <div><b>Connect With Us</b><p>A support specialist can help interpret these results and explain what the browser checks can and cannot verify.</p></div>
          </div>
          <button onClick={() => go('/support')}>Connect With Us <Icon name="arrow" size={14} /></button>
        </article>
      </div>
    </section>
  );
}
