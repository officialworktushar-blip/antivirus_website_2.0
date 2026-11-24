import type { Route } from '../components/ui';
import { Badge, Card, Icon, PageIntro, type IconName } from '../components/ui';

type SettingItem = { label: string; detail: string; icon: IconName; tone: 'blue' | 'green' | 'orange' | 'red'; route: Route; action: string };

const settings: SettingItem[] = [
  { label: 'Security checks', detail: 'Run a private browser assessment and review its limits.', icon: 'shield-check', tone: 'green', route: '/security-scan', action: 'Open' },
  { label: 'Protection tools', detail: 'Browse independent mobile protection options.', icon: 'grid', tone: 'blue', route: '/products', action: 'Browse' },
  { label: 'Privacy policy', detail: 'Read how SENTRIQ handles browser-only information.', icon: 'lock', tone: 'blue', route: '/privacy', action: 'Read' },
  { label: 'Technical support', detail: 'Choose a safe way to ask for help.', icon: 'chat', tone: 'orange', route: '/support', action: 'Contact' },
  { label: 'Security guidance', detail: 'Review practical Android and iPhone checklists.', icon: 'book', tone: 'blue', route: '/guides/android', action: 'View' },
  { label: 'Administration', detail: 'Restricted server-backed administration area.', icon: 'user', tone: 'red', route: '/admin', action: 'Open' },
];

export function Settings({ go }: { go: (route: Route) => void }) {
  return (
    <section className="settings-page">
      <PageIntro eyebrow="APPLICATION PREFERENCES" title="Settings" text="Manage how you move through SENTRIQ. These preferences are informational and do not change device security state." />

      <div className="settings-layout">
        <Card className="settings-profile">
          <div className="settings-profile-head">
            <span className="settings-avatar"><Icon name="shield-check" size={26} /></span>
            <div><b>SENTRIQ protection</b><small>Independent mobile security guidance</small></div>
            <Badge tone="green">Active</Badge>
          </div>
          <p>Browser checks stay on this device. A trusted mobile security app is still required for file, app, and system-level scanning.</p>
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
