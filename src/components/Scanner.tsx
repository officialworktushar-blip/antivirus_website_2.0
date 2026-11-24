import type { ReactNode } from 'react';
import { Icon } from './ui';
import { stateIcon, stateLabel, type Platform, type ScanFinding } from '../scan';

export function ScanStepHeader({ step, title, text, aside }: { step: string; title: string; text: string; aside?: ReactNode }) {
  return (
    <div className="scan-ui-head">
      <div>
        <span className="scan-ui-step">{step}</span>
        <h1>{title}</h1>
        <p className="scan-ui-lede">{text}</p>
      </div>
      {aside}
    </div>
  );
}

export function DeviceChoice({ value, suggested, hint, onSelect }: { value: Platform | null; suggested: Platform | null; hint: string; onSelect: (platform: Platform) => void }) {
  const options: { platform: Platform; note: string }[] = [
    { platform: 'Android', note: 'Samsung, Pixel, and other Android phones' },
    { platform: 'iPhone', note: 'Apple iPhone and iPad' },
  ];

  return (
    <div className="scan-ui-platforms">
      {options.map(option => (
        <button
          className={`device-choice${value === option.platform ? ' selected' : ''}`}
          key={option.platform}
          onClick={() => onSelect(option.platform)}
          aria-pressed={value === option.platform}
        >
          <span className="device-choice-icon"><Icon name="phone" size={22} /></span>
          <span className="device-choice-copy"><b>{option.platform}</b><small>{option.note}</small></span>
          {suggested === option.platform && <em>Suggested</em>}
          <i className="radio-dot" />
        </button>
      ))}
      <p className="scan-ui-hint"><Icon name="info" size={14} /> <span>{hint}</span></p>
    </div>
  );
}

export function ScanProgressRing({ value, label }: { value: number; label: string }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="scan-ui-ring" role="img" aria-label={`${label}: ${clamped} percent`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <circle className="scan-ui-ring-orbit" cx="60" cy="60" r="58" />
        <circle className="scan-ui-ring-track" cx="60" cy="60" r={radius} transform="rotate(-90 60 60)" />
        <circle className="scan-ui-ring-value" cx="60" cy="60" r={radius} transform="rotate(-90 60 60)" strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="scan-ui-ring-center">
        <span className="scan-ui-ring-mark"><Icon name="scan" size={22} /></span>
        <strong>{clamped}<small>%</small></strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

export function ScanCheckList({ completed, remaining }: { completed: string[]; remaining: string[] }) {
  return (
    <div className="scan-ui-checks">
      <div className="scan-ui-check-panel">
        <div className="scan-ui-check-heading"><b>Completed checks</b><span>{completed.length}</span></div>
        {completed.length ? completed.map(item => (
          <div className="scan-ui-check-row" key={item}>
            <span className="scan-ui-check-icon done"><Icon name="check" size={12} /></span>
            <span>{item}</span>
            <em>Done</em>
          </div>
        )) : <p className="scan-ui-empty">Waiting for the first check.</p>}
      </div>
      <div className="scan-ui-check-panel">
        <div className="scan-ui-check-heading"><b>Remaining checks</b><span>{remaining.length}</span></div>
        {remaining.length ? remaining.map(item => (
          <div className="scan-ui-check-row" key={item}>
            <span className="scan-ui-check-icon"><Icon name="clock" size={12} /></span>
            <span>{item}</span>
            <em>Queued</em>
          </div>
        )) : <p className="scan-ui-empty">All available checks are complete.</p>}
      </div>
    </div>
  );
}

export function ScanFindingList({ findings }: { findings: ScanFinding[] }) {
  return (
    <div className="scan-ui-findings">
      {findings.map(finding => (
        <article className="scan-ui-finding" key={finding.id}>
          <span className={`scan-ui-finding-icon state-${finding.state}`}><Icon name={stateIcon(finding.state)} size={16} /></span>
          <div><b>{finding.label}</b><small>{finding.detail}</small></div>
          <span className={`scan-ui-finding-state state-${finding.state}`}>{stateLabel(finding.state)}</span>
        </article>
      ))}
    </div>
  );
}

export function ScanNotice({ children, tone = 'info' }: { children: ReactNode; tone?: 'info' | 'warning' }) {
  return (
    <div className={`scan-ui-notice scan-ui-notice-${tone}`}>
      <Icon name={tone === 'warning' ? 'alert' : 'info'} size={15} />
      <span>{children}</span>
    </div>
  );
}
