import type { ReactNode } from 'react';
import { Icon, type IconName } from './ui';

export function SecurityGauge({ value, label, caption, tone = 'green', size = 168 }: { value: number; label: string; caption?: string; tone?: 'green' | 'blue' | 'orange' | 'red'; size?: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={`security-gauge gauge-${tone}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" role="img" aria-label={`${label}: ${clamped} percent`}>
        <circle className="gauge-track" cx="70" cy="70" r={radius} />
        <circle className="gauge-value" cx="70" cy="70" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="gauge-center">
        <Icon name="shield-check" size={24} />
        <strong>{clamped}<small>%</small></strong>
        <span>{label}</span>
      </div>
      {caption && <small className="gauge-caption">{caption}</small>}
    </div>
  );
}

export function StatusRow({ icon, title, detail, status, tone }: { icon: IconName; title: string; detail: string; status: string; tone: 'green' | 'orange' | 'red' | 'blue' }) {
  return (
    <div className="status-row">
      <span className={`status-icon tone-${tone}`}><Icon name={icon} size={18} /></span>
      <span className="status-copy"><b>{title}</b><small>{detail}</small></span>
      <span className={`status-chip chip-${tone}`}>{status}</span>
    </div>
  );
}

export function QuickAction({ icon, title, detail, onClick, tone = 'blue' }: { icon: IconName; title: string; detail: string; onClick: () => void; tone?: 'blue' | 'green' | 'orange' | 'red' }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <span className={`quick-icon tone-${tone}`}><Icon name={icon} size={20} /></span>
      <span><b>{title}</b><small>{detail}</small></span>
      <Icon name="chevron" size={16} />
    </button>
  );
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="section-header">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      {action}
    </div>
  );
}
