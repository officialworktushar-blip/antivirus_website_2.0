import type { Route } from '../components/ui';
import { Badge, Icon } from '../components/ui';
import type { SecurityTool } from '../data/tools';
import { securityTools } from '../data/tools';

function ToolButton({ tool, go }: { tool: SecurityTool; go: (route: Route) => void }) {
  return (
    <button className="tool-open" onClick={() => go(tool.route)} aria-label={`Open ${tool.name}`}>
      Open <Icon name="arrow" size={14} />
    </button>
  );
}

export function Tools({ go }: { go: (route: Route) => void }) {
  return (
    <section className="tools-page">
      <div className="tools-inner">
        <header className="tools-heading">
          <span className="tools-eyebrow">SECURITY UTILITIES</span>
          <h1>Security Tools</h1>
          <p>Use browser-based checks and practical guidance to understand what this device can safely report.</p>
        </header>

        <div className="tools-note">
          <Icon name="info" size={17} />
          <p><b>Browser checks only.</b> SENTRIQ cannot inspect files, apps, messages, or system processes from a web page.</p>
        </div>

        <div className="tools-grid">
          {securityTools.map(tool => (
            <article className="tool-card" key={tool.id}>
              <div className="tool-card-top">
                <span className="tool-icon"><Icon name={tool.icon} size={20} /></span>
                <Badge tone={tool.tone}>{tool.status}</Badge>
              </div>
              <h2>{tool.name}</h2>
              <p>{tool.description}</p>
              <ToolButton tool={tool} go={go} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ToolDetail({ tool, go }: { tool: SecurityTool; go: (route: Route) => void }) {
  return (
    <section className="tools-page tools-detail-page">
      <div className="tools-inner">
        <button className="tools-back" onClick={() => go('/tools')}><Icon name="arrow-back" size={15} /> All tools</button>

        <article className="tool-detail-card">
          <div className="tool-detail-head">
            <span className="tool-icon tool-icon-large"><Icon name={tool.icon} size={24} /></span>
            <div className="tool-detail-title">
              <span className="tools-eyebrow">{tool.eyebrow}</span>
              <h1>{tool.name}</h1>
            </div>
            <Badge tone={tool.tone}>{tool.status}</Badge>
          </div>

          <p className="tool-detail-lead">{tool.overview}</p>

          <div className="tool-detail-points">
            {tool.points.map((point, index) => (
              <div className="tool-point" key={point.title}>
                <span className="tool-point-number">{String(index + 1).padStart(2, '0')}</span>
                <div><b>{point.title}</b><p>{point.detail}</p></div>
              </div>
            ))}
          </div>

          <div className="tool-detail-note">
            <Icon name="info" size={16} />
            <p>{tool.note}</p>
          </div>

          <div className="tool-detail-actions">
            {tool.actions.map((action, index) => (
              <button
                className={index === 0 ? 'tool-action-primary' : 'tool-action-secondary'}
                key={`${action.route}-${action.label}`}
                onClick={() => go(action.route)}
              >
                {action.label} <Icon name="arrow" size={14} />
              </button>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
