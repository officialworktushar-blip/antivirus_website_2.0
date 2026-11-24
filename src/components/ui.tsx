import type { ReactNode } from 'react';

export type Route = '/' | '/assessment' | '/results' | '/security-scan' | '/trusted-advisor' | '/tools' | `/tools/${string}` | '/antivirus' | '/products' | `/products/${string}` | '/product/guard' | '/guides/android' | '/guides/iphone' | '/support' | '/settings' | '/admin' | '/privacy' | '/about' | '/terms' | '/disclaimer';

export type IconName =
  | 'shield' | 'shield-check' | 'scan' | 'phone' | 'lock' | 'arrow' | 'arrow-back' | 'check'
  | 'menu' | 'close' | 'spark' | 'chevron' | 'globe' | 'activity' | 'home' | 'alert'
  | 'clock' | 'download' | 'mail' | 'chat' | 'wifi' | 'user' | 'bell' | 'broom'
  | 'battery' | 'eye' | 'refresh' | 'info' | 'book' | 'plus' | 'grid' | 'settings';

const paths: Record<IconName, ReactNode> = {
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /></>,
  'shield-check': <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path d="M4 12h16" /></>,
  phone: <><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></>,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  arrow: <><path d="M5 12h14m-7-7 7 7-7 7" /></>,
  'arrow-back': <><path d="M19 12H5m7 7-7-7 7-7" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m18 6-12 12M6 6l12 12" />,
  spark: <path d="m12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2z" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  globe: <><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 0 1 0 20" /></>,
  activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
  alert: <><path d="M12 3 2 20h20L12 3Z" /><path d="M12 9v5m0 3h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5" /><path d="M4 19h16" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  chat: <><path d="M21 12a8 8 0 0 1-8 8H7l-4 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" /></>,
  wifi: <><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8 16a6 6 0 0 1 8 0" /><path d="M12 20h.01" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" /></>,
  broom: <><path d="m14 4 6 6-8 8-6-6 8-8Z" /><path d="m8 12-5 8 8-5" /></>,
  battery: <><rect x="2" y="7" width="18" height="10" rx="2" /><path d="M22 10v4M6 10v4m4-4v4" /></>,
  eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M4 17v-5h5" /><path d="M6 9a7 7 0 0 1 12-2l2 5M4 12l2 5a7 7 0 0 0 12-2" /></>,
  info: <><circle cx="12" cy="12" r="10" /><path d="M12 11v6m0-10h.01" /></>,
  book: <><path d="M4 4h7a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4V4Z" /><path d="M20 4h-3a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h3V4Z" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21H9v-.05a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.6 15a1.7 1.7 0 0 0-1.55-1H2V9h.05A1.7 1.7 0 0 0 3.6 8a1.7 1.7 0 0 0-.34-1.87L3.2 6.07 6.03 3.24l.06.06A1.7 1.7 0 0 0 8 3.6a1.7 1.7 0 0 0 1-1.55V2h5v.05a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 20.4 8a1.7 1.7 0 0 0 1.55 1H22v5h-.05a1.7 1.7 0 0 0-1.55 1Z" /></>,
};

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="eyebrow">{children}</div>;
}

export function Badge({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'red' | 'orange' | 'neutral' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function PageIntro({ eyebrow, title, accent, text }: { eyebrow: string; title: string; accent?: string; text: string }) {
  return (
    <section className="page-intro section-wrap">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title} {accent && <span className="accent-text">{accent}</span>}</h1>
      <p>{text}</p>
    </section>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <article className={`app-card ${className}`.trim()}>{children}</article>;
}
