import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('SENTRIQ render error', error, info);
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="app-error">
          <div className="app-error-card">
            <strong className="boot-fallback-brand">SENTRIQ</strong>
            <h1>SENTRIQ could not load</h1>
            <p>Reload the page to try again. Saved assessment data stays in this browser.</p>
            <button type="button" className="primary-button" onClick={() => window.location.reload()}>Reload page</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}

let rootElement = document.getElementById('root');
if (!rootElement) {
  rootElement = document.createElement('div');
  rootElement.id = 'root';
  document.body.appendChild(rootElement);
}

try {
  createRoot(rootElement).render(
    <AppErrorBoundary>
      <StrictMode><App /></StrictMode>
    </AppErrorBoundary>,
  );
} catch (error) {
  console.error('SENTRIQ startup error', error);
  rootElement.innerHTML = '<div class="boot-fallback"><div class="boot-fallback-card"><strong class="boot-fallback-brand">SENTRIQ</strong><h1>SENTRIQ could not load</h1><p>Reload the page to try again.</p></div></div>';
}
