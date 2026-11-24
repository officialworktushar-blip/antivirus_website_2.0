import type { IconName } from './components/ui';

export type Platform = 'Android' | 'iPhone';
export type ScanState = 'passed' | 'attention' | 'unavailable';
export type ScanFinding = { id: string; label: string; state: ScanState; detail: string; icon: IconName };
export type StoredAssessment = { completedAt: string; device: Platform; isDemo: boolean; findings: ScanFinding[] };

export const ASSESSMENT_STORAGE_KEY = 'sentriq-security-assessment';
export const ASSESSMENT_HISTORY_PREFERENCE_KEY = 'sentriq-assessment-history-enabled';
const LEGACY_ASSESSMENT_STORAGE_KEY = 'sentriq-last-assessment';

export const scanActivities = [
  { id: 'browser-security', title: 'Browser Security', detail: 'Checking browser security APIs and capabilities.', ids: ['browser', 'context'] },
  { id: 'connection-security', title: 'Connection Security', detail: 'Checking HTTPS and connection information.', ids: ['https', 'connection'] },
  { id: 'privacy-assessment', title: 'Privacy Assessment', detail: 'Reviewing available privacy signals.', ids: ['privacy', 'permissions'] },
  { id: 'web-protection', title: 'Web Protection Readiness', detail: 'Reviewing signals needed for safer browsing.', ids: ['web-ready'] },
  { id: 'security-configuration', title: 'Security Configuration', detail: 'Checking verifiable browser configuration.', ids: ['security-config', 'native'] },
] as const;

export function stateLabel(state: ScanState): string {
  if (state === 'passed') return 'Passed';
  if (state === 'attention') return 'Review';
  return 'Unavailable';
}

export function stateIcon(state: ScanState): IconName {
  if (state === 'passed') return 'check';
  if (state === 'attention') return 'alert';
  return 'info';
}

export function formatAssessmentDate(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function scoreFromFindings(findings: ScanFinding[]): number | null {
  if (!findings.length) return null;
  const passed = findings.filter(finding => finding.state === 'passed').length;
  return Math.round((passed / findings.length) * 100);
}

export function readStoredAssessment(): StoredAssessment | null {
  try {
    const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredAssessment>;
    if (typeof parsed.completedAt !== 'string') return null;
    if (parsed.device !== 'Android' && parsed.device !== 'iPhone') return null;
    if (Number.isNaN(new Date(parsed.completedAt).getTime())) return null;
    if (!Array.isArray(parsed.findings)) return null;
    const findings = parsed.findings.filter((finding): finding is ScanFinding => (
      Boolean(finding)
      && typeof finding.id === 'string'
      && typeof finding.label === 'string'
      && typeof finding.detail === 'string'
      && ['passed', 'attention', 'unavailable'].includes(finding.state)
    ));
    if (!findings.length) return null;
    return { completedAt: parsed.completedAt, device: parsed.device, isDemo: parsed.isDemo === true, findings };
  } catch {
    return null;
  }
}

export function isAssessmentHistoryEnabled(): boolean {
  try {
    return localStorage.getItem(ASSESSMENT_HISTORY_PREFERENCE_KEY) !== 'false';
  } catch {
    return true;
  }
}

export function setAssessmentHistoryEnabled(enabled: boolean): boolean {
  try {
    localStorage.setItem(ASSESSMENT_HISTORY_PREFERENCE_KEY, enabled ? 'true' : 'false');
    return true;
  } catch {
    return false;
  }
}

export function saveAssessment(assessment: StoredAssessment): boolean {
  if (!isAssessmentHistoryEnabled()) return false;
  try {
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(assessment));
    return true;
  } catch {
    return false;
  }
}

export function clearAssessment(): void {
  try { localStorage.removeItem(ASSESSMENT_STORAGE_KEY); } catch { return; }
}

export function clearAssessmentHistory(): void {
  try {
    localStorage.removeItem(ASSESSMENT_STORAGE_KEY);
    localStorage.removeItem(LEGACY_ASSESSMENT_STORAGE_KEY);
  } catch {
    return;
  }
}

export function detectPlatformHint(): { suggested: Platform | null; label: string; detail: string } {
  const agent = navigator.userAgent;
  const touch = navigator.maxTouchPoints > 0;
  const ios = /iPad|iPhone|iPod/.test(agent) || (/Macintosh/.test(agent) && touch);
  const android = /Android/i.test(agent);
  if (ios) return { suggested: 'iPhone', label: 'iPhone', detail: 'Browser information suggests iPhone or iPad. Confirm your platform below.' };
  if (android) return { suggested: 'Android', label: 'Android', detail: 'Browser information suggests Android. Confirm your platform below.' };
  return { suggested: null, label: 'No hint', detail: 'Browser information could not identify your platform. Choose one below.' };
}

export function runBrowserChecks(): ScanFinding[] {
  const checks: ScanFinding[] = [];

  const secureContext = window.isSecureContext === true;
  const https = window.location.protocol === 'https:';

  const cryptoAvailable = typeof window.crypto?.getRandomValues === 'function';
  const subtleAvailable = secureContext && typeof window.crypto?.subtle !== 'undefined';
  const textEncoderAvailable = typeof TextEncoder !== 'undefined';
  const browserPassed = cryptoAvailable && subtleAvailable && textEncoderAvailable;
  checks.push({
    id: 'browser',
    label: 'Browser Security',
    state: browserPassed ? 'passed' : 'attention',
    detail: browserPassed
      ? 'This browser exposes cryptographic random values, Web Crypto, and text encoding on a secure context.'
      : 'Some browser security APIs could not be confirmed on this page.',
    icon: 'shield',
  });

  checks.push({
    id: 'https',
    label: 'HTTPS Connection',
    state: https ? 'passed' : 'attention',
    detail: https ? 'This page is delivered over HTTPS.' : 'This page is not delivered over HTTPS. Avoid entering sensitive information here.',
    icon: 'lock',
  });

  checks.push({
    id: 'context',
    label: 'Secure Browser Context',
    state: secureContext ? 'passed' : 'attention',
    detail: secureContext ? 'Secure-context browser features are available here.' : 'Secure-context browser features are unavailable on this page.',
    icon: 'globe',
  });

  const connection = navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } };
  const online = navigator.onLine;
  const effectiveType = connection.connection?.effectiveType;
  const connectionPassed = online && Boolean(effectiveType);
  checks.push({
    id: 'connection',
    label: 'Connection Information',
    state: !online ? 'attention' : connectionPassed ? 'passed' : 'unavailable',
    detail: !online
      ? 'This browser reports that it is currently offline.'
      : effectiveType
        ? `This browser reports ${effectiveType}${connection.connection?.saveData ? ' with data saver enabled' : ''}.`
        : 'This browser does not expose connection details.',
    icon: 'wifi',
  });

  let storageAvailable = false;
  try {
    sessionStorage.setItem('__sentriq_scan_test', '1');
    storageAvailable = sessionStorage.getItem('__sentriq_scan_test') === '1';
    sessionStorage.removeItem('__sentriq_scan_test');
  } catch {
    storageAvailable = false;
  }

  const cookiesAvailable = navigator.cookieEnabled === true;
  const permissionApi = 'permissions' in navigator;
  const privacyPassed = storageAvailable && cookiesAvailable && permissionApi;
  checks.push({
    id: 'privacy',
    label: 'Local Privacy Signals',
    state: privacyPassed ? 'passed' : 'attention',
    detail: privacyPassed
      ? 'Session storage, cookie settings, and permission controls are available for review.'
      : 'One or more local privacy signals could not be confirmed.',
    icon: 'eye',
  });

  checks.push({
    id: 'permissions',
    label: 'Permission Controls',
    state: permissionApi ? 'passed' : 'unavailable',
    detail: permissionApi
      ? 'This browser exposes permission controls. Review camera, microphone, location, and notifications in browser settings.'
      : 'This browser does not expose permission controls to this page.',
    icon: 'activity',
  });

  const webReady = https && secureContext && cryptoAvailable && subtleAvailable;
  checks.push({
    id: 'web-ready',
    label: 'Web Protection Readiness',
    state: webReady ? 'passed' : 'attention',
    detail: webReady
      ? 'HTTPS, secure context, and browser cryptography are available for safer browsing.'
      : 'One or more browser signals needed for safer browsing could not be confirmed.',
    icon: 'shield-check',
  });

  const credentialsAvailable = 'credentials' in navigator;
  const passkeysAvailable = typeof (window as Window & { PublicKeyCredential?: unknown }).PublicKeyCredential !== 'undefined';
  const configurationAvailable = credentialsAvailable || passkeysAvailable;
  checks.push({
    id: 'security-config',
    label: 'Security Configuration',
    state: configurationAvailable ? 'passed' : 'unavailable',
    detail: configurationAvailable
      ? 'This browser exposes credential-management or passkey support. No account or credential was accessed.'
      : 'This browser does not expose credential-management or passkey support to this page.',
    icon: 'user',
  });

  checks.push({
    id: 'native',
    label: 'Apps, Files, and Malware',
    state: 'unavailable',
    detail: 'A website cannot inspect installed apps, files, photos, messages, calls, operating-system malware, or background processes.',
    icon: 'scan',
  });

  return checks;
}

export function demoFindings(): ScanFinding[] {
  return [
    { id: 'browser', label: 'Sample: Browser Security', state: 'passed', detail: 'Demonstration value only. No browser API was checked.', icon: 'shield' },
    { id: 'https', label: 'Sample: HTTPS Connection', state: 'passed', detail: 'Demonstration value only. No connection was checked.', icon: 'lock' },
    { id: 'context', label: 'Sample: Secure Context', state: 'passed', detail: 'Demonstration value only. No context was checked.', icon: 'globe' },
    { id: 'connection', label: 'Sample: Connection Information', state: 'unavailable', detail: 'Demonstration value only. No network information was checked.', icon: 'wifi' },
    { id: 'privacy', label: 'Sample: Local Privacy Signals', state: 'passed', detail: 'Demonstration value only. No privacy signal was checked.', icon: 'eye' },
    { id: 'permissions', label: 'Sample: Permission Controls', state: 'unavailable', detail: 'Demonstration value only. No permission was checked.', icon: 'activity' },
    { id: 'web-ready', label: 'Sample: Web Protection Readiness', state: 'attention', detail: 'Demonstration value only. No readiness signal was checked.', icon: 'shield-check' },
    { id: 'security-config', label: 'Sample: Security Configuration', state: 'passed', detail: 'Demonstration value only. No configuration was checked.', icon: 'user' },
    { id: 'native', label: 'Sample: Apps and Files', state: 'unavailable', detail: 'Demonstration only. This scan never inspects apps, files, or malware.', icon: 'scan' },
  ];
}
