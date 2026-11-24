import { useState, type ChangeEvent } from 'react';
import type { Route } from '../components/ui';
import { Badge, Card, Icon, PageIntro } from '../components/ui';
import {
  ASSESSMENT_STORAGE_KEY,
  clearAssessmentHistory,
  formatAssessmentDate,
  isAssessmentHistoryEnabled,
  readStoredAssessment,
  setAssessmentHistoryEnabled,
} from '../scan';

type SettingItem = { label: string; detail: string; icon: 'shield-check' | 'activity' | 'grid' | 'book' | 'chat' | 'user' | 'lock'; tone: 'blue' | 'green' | 'orange' | 'red'; route: Route; action: string };

const settings: SettingItem[] = [
  { label: 'Security checks', detail: 'Run a private browser assessment and review its limits.', icon: 'shield-check', tone: 'green', route: '/security-scan', action: 'Open' },
  { label: 'Trusted Advisor', detail: 'Review verified findings and explain each result.', icon: 'activity', tone: 'blue', route: '/trusted-advisor', action: 'View' },
  { label: 'Security tools', detail: 'Open browser checks and practical security guidance.', icon: 'grid', tone: 'blue', route: '/tools', action: 'Open' },
  { label: 'Protection tools', detail: 'Browse independent mobile protection options.', icon: 'grid', tone: 'blue', route: '/products', action: 'Browse' },
  { label: 'Help center', detail: 'Read FAQs and Android or iPhone guidance.', icon: 'book', tone: 'blue', route: '/help', action: 'Open' },
  { label: 'Privacy policy', detail: 'Read how SENTRIQ handles browser-only information.', icon: 'lock', tone: 'blue', route: '/privacy', action: 'Read' },
  { label: 'Technical support', detail: 'Choose a safe way to ask for help.', icon: 'chat', tone: 'orange', route: '/support', action: 'Contact' },
  { label: 'Administration', detail: 'Restricted server-backed administration area.', icon: 'user', tone: 'red', route: '/admin', action: 'Open' },
];

const toTel = (value: string) => value.trim().replace(/[^+\d]/g, '').replace(/(?!^)\+/g, '');

export function Settings({ go }: { go: (route: Route) => void }) {
  const [historyEnabled, setHistoryEnabled] = useState(isAssessmentHistoryEnabled);
  const [stored, setStored] = useState(readStoredAssessment);
  const [message, setMessage] = useState('');
  const supportPhone = import.meta.env.VITE_SUPPORT_PHONE?.trim() ?? '';
  const tel = toTel(supportPhone);
  const phoneReady = /^\+?\d{7,15}$/.test(tel);
  const savedDate = stored ? formatAssessmentDate(stored.completedAt) : null;

  const toggleHistory = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.checked;
    if (!setAssessmentHistoryEnabled(next)) {
      setMessage('This browser blocked the preference change. No setting was saved.');
      return;
    }
    setHistoryEnabled(next);
    setMessage(next
      ? 'New assessments will be saved on this device again.'
      : 'New assessments will no longer be saved. Existing saved history can be cleared below.');
  };

  const clearHistory = () => {
    clearAssessmentHistory();
    setStored(null);
    setMessage('Locally saved assessment history was cleared from this browser.');
    window.dispatchEvent(new StorageEvent('storage', { key: ASSESSMENT_STORAGE_KEY, newValue: null }));
  };

  return (
    <section className="settings-page">
      <PageIntro eyebrow="APPLICATION PREFERENCES" title="Settings" text="Manage local assessment history and find trusted information. These preferences do not change device security state." />

      <div className="settings-layout">
        <Card className="settings-profile">
          <div className="settings-profile-head">
            <span className="settings-avatar"><Icon name="shield-check" size={26} /></span>
            <div><b>Application information</b><small>SENTRIQ 2.0 · mobile security guidance</small></div>
            <Badge tone="green">Local first</Badge>
          </div>
          <p>SENTRIQ is an educational browser experience. It explains available security signals, optional protection options, and safe support choices without installing an antivirus engine.</p>
        </Card>

        <Card className="settings-block">
          <div className="settings-block-head"><span className="settings-icon tone-blue"><Icon name="lock" size={19} /></span><div><b>Privacy information</b><small>Assessment results stay in this browser unless you clear them.</small></div></div>
          <p>SENTRIQ does not create an account or ask for passwords, one-time codes, or financial credentials. Browser checks only read signals the browser exposes to this page.</p>
          <button className="text-button" type="button" onClick={() => go('/privacy')}>Read privacy policy <Icon name="chevron" size={14} /></button>
        </Card>

        <Card className="settings-block">
          <div className="settings-block-head"><span className="settings-icon tone-green"><Icon name="activity" size={19} /></span><div><b>Assessment history preferences</b><small>Control whether new results are saved locally.</small></div></div>
          <label className="settings-toggle">
            <input type="checkbox" checked={historyEnabled} onChange={toggleHistory} />
            <span><b>Save latest assessment on this device</b><small>When off, new scan results stay only on the current screen and are not stored.</small></span>
          </label>
          <div className="settings-meta-grid">
            <div><small>STORED RESULT</small><b>{stored ? `${stored.device} · ${savedDate ?? 'saved'}` : 'No saved assessment'}</b></div>
            <div><small>SAMPLE RESULTS</small><b>{stored?.isDemo ? 'Clearly marked as demonstration' : 'Not stored as real results'}</b></div>
          </div>
          <div className="settings-actions">
            <button className="secondary-button" type="button" onClick={clearHistory} disabled={!stored}><Icon name="broom" size={15} /> Clear locally saved assessment history</button>
            <button className="text-button" type="button" onClick={() => go('/results')}>View results <Icon name="chevron" size={14} /></button>
          </div>
          {message && <p className="settings-status">{message}</p>}
        </Card>

        <Card className="settings-block">
          <div className="settings-block-head"><span className="settings-icon tone-orange"><Icon name="chat" size={19} /></span><div><b>Contact support</b><small>Use a trusted channel and share only what is necessary.</small></div></div>
          <div className="settings-contact-list">
            <div><Icon name="chat" size={15} /><span><b>Support center</b><small>Open safe call and remote-assistance options.</small></span><button className="text-button" type="button" onClick={() => go('/support')}>Open <Icon name="chevron" size={14} /></button></div>
            <div><Icon name="phone" size={15} /><span><b>Phone support</b><small>{phoneReady ? supportPhone : 'No support phone configured.'}</small></span>{phoneReady ? <a className="text-button" href={`tel:${tel}`}>Call <Icon name="chevron" size={14} /></a> : <span className="settings-muted">Unavailable</span>}</div>
          </div>
        </Card>

        <Card className="settings-groups">
          {settings.map(setting => (
            <button className="settings-row" key={setting.route} onClick={() => go(setting.route)}>
              <span className={`settings-icon tone-${setting.tone}`}><Icon name={setting.icon} size={19} /></span>
              <span className="settings-copy"><b>{setting.label}</b><small>{setting.detail}</small></span>
              <span className="settings-action">{setting.action} <Icon name="chevron" size={15} /></span>
            </button>
          ))}
        </Card>

        <Card className="settings-note">
          <Icon name="info" size={18} />
          <span><b>No device changes are made here.</b> SENTRIQ does not install an antivirus engine, access files, or alter system settings.</span>
        </Card>
      </div>
    </section>
  );
}
