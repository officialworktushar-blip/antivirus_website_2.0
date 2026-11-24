import { capDisplayScore, type ScanFinding, type ScanState, type StoredAssessment } from './scan';

export type AdvisorTone = 'red' | 'orange' | 'green' | 'neutral';
export type AdvisorGroupId = 'critical' | 'minor' | 'completed';

export type AdvisorRule = {
  id: string;
  severity: 'critical' | 'minor';
  scored: boolean;
  weight: number;
  check: string;
  issueTitle: string;
  completedTitle: string;
  risk: string;
  action: string;
};

export type AdvisorEntry = {
  id: string;
  title: string;
  finding: string;
  state: ScanState;
  tone: AdvisorTone;
  checked: string;
  evidence: string;
  risk: string;
  action: string;
};

export type AdvisorGroup = {
  id: AdvisorGroupId;
  title: string;
  subtitle: string;
  entries: AdvisorEntry[];
};

export type AdvisorReport = {
  complete: boolean;
  status: string;
  statusDetail: string;
  tone: AdvisorTone;
  score: number | null;
  criticalCount: number;
  minorCount: number;
  completedCount: number;
  groups: AdvisorGroup[];
  reason: string;
};

export const advisorRules: AdvisorRule[] = [
  {
    id: 'https',
    severity: 'critical',
    scored: true,
    weight: 14,
    check: 'The protocol used to deliver this page.',
    issueTitle: 'Insecure HTTP connection',
    completedTitle: 'HTTPS connection verified',
    risk: 'Without HTTPS, information between this browser and the page can be observed or changed on the network.',
    action: 'Close this page and reopen SENTRIQ over HTTPS before entering any information.',
  },
  {
    id: 'context',
    severity: 'critical',
    scored: true,
    weight: 12,
    check: 'Whether secure-context browser features are available here.',
    issueTitle: 'Missing secure browser context',
    completedTitle: 'Secure browser context verified',
    risk: 'Secure-context features may be unavailable, so browser security checks are less reliable.',
    action: 'Use an up-to-date browser and open the site from a trusted HTTPS address.',
  },
  {
    id: 'browser',
    severity: 'minor',
    scored: true,
    weight: 10,
    check: 'Cryptographic random values, Web Crypto, and text encoding support.',
    issueTitle: 'Browser security capabilities not verified',
    completedTitle: 'Browser security capabilities verified',
    risk: 'Some browser protections could not be confirmed, reducing confidence in browser-based checks.',
    action: 'Update your browser or switch to a current, trusted browser.',
  },
  {
    id: 'web-ready',
    severity: 'minor',
    scored: true,
    weight: 10,
    check: 'HTTPS, secure context, and browser cryptography together.',
    issueTitle: 'Web protection readiness not confirmed',
    completedTitle: 'Web protection readiness verified',
    risk: 'Safer browsing relies on several browser signals working together; one missing signal reduces confidence.',
    action: 'Review connection and browser settings, then run the browser assessment again.',
  },
  {
    id: 'privacy',
    severity: 'minor',
    scored: true,
    weight: 8,
    check: 'Session storage, cookie settings, and permission controls.',
    issueTitle: 'Privacy signals could not be confirmed',
    completedTitle: 'Local privacy signals verified',
    risk: 'SENTRIQ cannot confirm which local privacy controls are available for review.',
    action: 'Check privacy and site-data settings in your browser, then reassess.',
  },
  {
    id: 'permissions',
    severity: 'minor',
    scored: true,
    weight: 8,
    check: 'Whether the browser exposes its permission controls to this page.',
    issueTitle: 'Permission controls not exposed',
    completedTitle: 'Permission controls verified',
    risk: 'Camera, microphone, location, and notification permissions must be reviewed in browser settings.',
    action: 'Open browser permissions and remove access you no longer need.',
  },
  {
    id: 'connection',
    severity: 'minor',
    scored: true,
    weight: 6,
    check: 'Online state and browser-reported connection type.',
    issueTitle: 'Connection information unavailable',
    completedTitle: 'Connection information verified',
    risk: 'Network conclusions are weaker when the browser does not expose connection details.',
    action: 'Recheck on a trusted network and avoid public Wi-Fi for sensitive tasks.',
  },
  {
    id: 'security-config',
    severity: 'minor',
    scored: true,
    weight: 6,
    check: 'Credential-management or passkey support exposed by the browser.',
    issueTitle: 'Missing verifiable security configuration',
    completedTitle: 'Security configuration verified',
    risk: 'Credential-management support could not be confirmed, so secure sign-in options remain unverified.',
    action: 'Use a current browser and enable a supported password manager or passkey provider.',
  },
  {
    id: 'native',
    severity: 'minor',
    scored: false,
    weight: 0,
    check: 'Whether a website can inspect installed apps, files, and malware.',
    issueTitle: 'Unsupported security check',
    completedTitle: 'Unsupported security check noted',
    risk: 'A website cannot draw conclusions about device storage or installed applications. Treating silence as safety would be misleading.',
    action: 'Use a trusted native security app for file, app, and system-level protection.',
  },
];

function toneFor(state: ScanState, severity: 'critical' | 'minor'): AdvisorTone {
  if (state === 'passed') return 'green';
  if (severity === 'critical') return 'red';
  return state === 'attention' ? 'orange' : 'neutral';
}

function entryFor(finding: ScanFinding, rule: AdvisorRule): AdvisorEntry {
  const passed = finding.state === 'passed';
  return {
    id: finding.id,
    title: passed ? rule.completedTitle : rule.issueTitle,
    finding: finding.label,
    state: finding.state,
    tone: toneFor(finding.state, rule.severity),
    checked: rule.check,
    evidence: `${rule.check} Observed: ${finding.detail}`,
    risk: rule.risk,
    action: rule.action,
  };
}

export function deriveAdvisorReport(assessment: StoredAssessment | null): AdvisorReport {
  const scoredRules = advisorRules.filter(rule => rule.scored);
  const hasRequiredFindings = assessment
    ? scoredRules.every(rule => assessment.findings.some(item => item.id === rule.id))
    : false;
  const reason = !assessment
    ? 'No assessment has been saved in this browser.'
    : assessment.isDemo
      ? 'Demonstration results are not used for the Trusted Advisor score.'
      : !hasRequiredFindings
        ? 'The saved assessment does not contain every defined finding needed for a score.'
        : '';

  const findings = assessment && !assessment.isDemo ? assessment.findings : [];
  const possibleWeight = scoredRules.reduce((total, rule) => total + rule.weight, 0);
  const earnedWeight = scoredRules.reduce((total, rule) => {
    const finding = findings.find(item => item.id === rule.id);
    return total + (finding?.state === 'passed' ? rule.weight : 0);
  }, 0);

  const issues = advisorRules
    .map(rule => ({ rule, finding: findings.find(item => item.id === rule.id) }))
    .filter((item): item is { rule: AdvisorRule; finding: ScanFinding } => Boolean(item.finding));

  const critical = issues
    .filter(item => item.rule.severity === 'critical' && item.finding.state !== 'passed')
    .map(item => entryFor(item.finding, item.rule));
  const minor = issues
    .filter(item => item.rule.severity === 'minor' && item.finding.state !== 'passed')
    .map(item => entryFor(item.finding, item.rule));
  const completed = issues
    .filter(item => item.finding.state === 'passed')
    .map(item => entryFor(item.finding, item.rule));

  const groups: AdvisorGroup[] = [
    { id: 'critical', title: 'Critical issues', subtitle: 'Verified browser signals that need prompt attention.', entries: critical },
    { id: 'minor', title: 'Minor issues', subtitle: 'Lower-priority findings and unsupported checks.', entries: minor },
    { id: 'completed', title: 'Completed checks', subtitle: 'Browser signals that were successfully verified.', entries: completed },
  ];

  if (reason) {
    return {
      complete: false,
      status: 'Assessment Incomplete',
      statusDetail: 'Run a browser assessment to generate a score from defined rules.',
      tone: 'neutral',
      score: null,
      criticalCount: 0,
      minorCount: 0,
      completedCount: 0,
      groups: groups.map(group => ({ ...group, entries: [] })),
      reason,
    };
  }

  const rawScore = Math.round((earnedWeight / possibleWeight) * 100);
  const score = capDisplayScore(rawScore);
  const status = critical.length > 0
    ? 'Attention required'
    : rawScore >= 80
      ? 'Protection looks good'
      : 'Review recommended';
  const tone: AdvisorTone = critical.length > 0 ? 'red' : rawScore >= 80 ? 'green' : 'orange';

  return {
    complete: true,
    status,
    statusDetail: `Weighted from ${scoredRules.length} defined browser rules. Unsupported checks are shown but not scored.`,
    tone,
    score,
    criticalCount: critical.length,
    minorCount: minor.length,
    completedCount: completed.length,
    groups,
    reason,
  };
}
