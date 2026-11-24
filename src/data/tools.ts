import type { IconName, Route } from '../components/ui';

export type ToolTone = 'blue' | 'green' | 'orange' | 'neutral';

export type ToolPoint = { title: string; detail: string };
export type ToolAction = { label: string; route: Route };

export type SecurityTool = {
  id: string;
  name: string;
  description: string;
  icon: IconName;
  status: string;
  tone: ToolTone;
  route: Route;
  eyebrow: string;
  overview: string;
  points: ToolPoint[];
  note: string;
  actions: ToolAction[];
};

export const securityTools: SecurityTool[] = [
  {
    id: 'web-security-check',
    name: 'Web Security Check',
    description: 'Run browser-accessible checks for HTTPS, secure context, privacy signals, and connection details.',
    icon: 'shield-check',
    status: 'Available now',
    tone: 'green',
    route: '/security-scan',
    eyebrow: 'LIVE BROWSER CHECK',
    overview: 'This check uses only information this browser can safely expose. It does not claim to scan files, apps, messages, or system processes.',
    points: [
      { title: 'Connection check', detail: 'Confirms whether the page is delivered over HTTPS and whether the browser reports a secure context.' },
      { title: 'Browser capability check', detail: 'Reviews cryptographic and privacy-related browser signals that are available to the page.' },
      { title: 'Clear limits', detail: 'Unsupported checks are labeled, so a missing result is never presented as a passed security check.' },
    ],
    note: 'The result is a browser assessment, not a full antivirus scan. A trusted native security app is still needed for device-level protection.',
    actions: [
      { label: 'Open check', route: '/security-scan' },
      { label: 'Review results', route: '/results' },
    ],
  },
  {
    id: 'privacy-assessment',
    name: 'Privacy Assessment',
    description: 'Understand which privacy signals a website can observe and which settings need manual review.',
    icon: 'eye',
    status: 'Browser-based',
    tone: 'blue',
    route: '/tools/privacy-assessment',
    eyebrow: 'PRIVACY GUIDANCE',
    overview: 'A website cannot inspect private data on your device. This page explains the limited privacy signals a browser check can report and what you should review yourself.',
    points: [
      { title: 'What can be checked', detail: 'A browser check can report HTTPS state, secure context, storage signals, permission APIs, and connection details.' },
      { title: 'What cannot be checked', detail: 'Private files, messages, call logs, installed apps, and account activity are outside browser access.' },
      { title: 'Review manually', detail: 'Open browser settings to review site data, camera, microphone, location, and notification permissions.' },
    ],
    note: 'SENTRIQ does not ask for private content and does not use browser checks to make claims about device storage.',
    actions: [
      { label: 'Run browser check', route: '/security-scan' },
      { label: 'Read privacy policy', route: '/privacy' },
    ],
  },
  {
    id: 'browser-security',
    name: 'Browser Security',
    description: 'Review whether key browser protections and secure-context capabilities are available.',
    icon: 'globe',
    status: 'Browser-based',
    tone: 'blue',
    route: '/tools/browser-security',
    eyebrow: 'BROWSER PROTECTION',
    overview: 'Browser security depends on a trusted browser, a secure HTTPS connection, and current security APIs. This guide explains the signals used by the browser assessment.',
    points: [
      { title: 'Secure connection', detail: 'HTTPS protects information in transit and enables browser security features that are unavailable on insecure pages.' },
      { title: 'Updated browser', detail: 'Current browser versions include security fixes and support modern protections such as Web Crypto.' },
      { title: 'Permission hygiene', detail: 'Remove site permissions you no longer need and avoid granting access to untrusted pages.' },
    ],
    note: 'Browser security signals help judge the current browsing session; they do not replace a native security solution.',
    actions: [
      { label: 'Open browser check', route: '/security-scan' },
      { label: 'View advisor', route: '/trusted-advisor' },
    ],
  },
  {
    id: 'network-security-guide',
    name: 'Network Security Guide',
    description: 'Practical habits for safer browsing on home, mobile, and public networks.',
    icon: 'wifi',
    status: 'Guide',
    tone: 'blue',
    route: '/tools/network-security-guide',
    eyebrow: 'CONNECTION GUIDANCE',
    overview: 'Network safety depends on trusted connections, HTTPS, and careful behavior on networks you do not control.',
    points: [
      { title: 'Prefer trusted networks', detail: 'Avoid sensitive account or payment tasks on public Wi-Fi unless you trust the network and the site uses HTTPS.' },
      { title: 'Verify the address', detail: 'Check the domain before signing in and avoid links from unexpected messages.' },
      { title: 'Keep software current', detail: 'Browser and operating-system updates close known network and TLS vulnerabilities.' },
    ],
    note: 'The browser check can report connection details only when the browser exposes them; it cannot audit the entire network.',
    actions: [
      { label: 'Check connection', route: '/security-scan' },
      { label: 'Contact support', route: '/support' },
    ],
  },
  {
    id: 'phishing-awareness',
    name: 'Phishing Awareness',
    description: 'Learn how suspicious messages, lookalike pages, and urgent requests are used to steal access.',
    icon: 'alert',
    status: 'Education',
    tone: 'orange',
    route: '/tools/phishing-awareness',
    eyebrow: 'AWARENESS',
    overview: 'Phishing relies on urgency and imitation. Slow down, verify the destination, and never share codes or passwords after following an unexpected link.',
    points: [
      { title: 'Check the sender', detail: 'Look closely at addresses and display names; attackers often imitate trusted contacts or brands.' },
      { title: 'Open known addresses', detail: 'Navigate to important services by typing the known address or using a trusted bookmark.' },
      { title: 'Protect credentials', detail: 'Never enter a one-time code, password, or recovery phrase because a message asked you to.' },
    ],
    note: 'SENTRIQ cannot judge whether a message is genuine. Ask a support specialist if you are unsure about a request.',
    actions: [
      { label: 'Ask support', route: '/support' },
      { label: 'Review devices', route: '/security-scan' },
    ],
  },
  {
    id: 'device-security-guide',
    name: 'Device Security Guide',
    description: 'Follow practical Android and iPhone checks for updates, permissions, and app sources.',
    icon: 'phone',
    status: 'Guide',
    tone: 'blue',
    route: '/tools/device-security-guide',
    eyebrow: 'DEVICE GUIDANCE',
    overview: 'Device security depends on the operating system, app sources, permissions, and screen access controls. Use the platform guides for step-by-step checks.',
    points: [
      { title: 'Install updates', detail: 'Apply operating-system and app updates promptly from official sources.' },
      { title: 'Review permissions', detail: 'Allow only the access each app needs and remove permissions that are no longer useful.' },
      { title: 'Use a lock screen', detail: 'Require a strong PIN, pattern, or biometric unlock and avoid simple codes.' },
    ],
    note: 'A website cannot inspect installed apps or files, so these guides focus on settings you can verify on the device.',
    actions: [
      { label: 'Android guide', route: '/guides/android' },
      { label: 'iPhone guide', route: '/guides/iphone' },
    ],
  },
  {
    id: 'password-safety-guide',
    name: 'Password Safety Guide',
    description: 'Build safer sign-in habits with unique passwords, passkeys, and multi-factor authentication.',
    icon: 'lock',
    status: 'Guide',
    tone: 'blue',
    route: '/tools/password-safety-guide',
    eyebrow: 'ACCOUNT SAFETY',
    overview: 'Strong account security reduces the damage when one service is compromised. Use unique credentials and enable additional verification where available.',
    points: [
      { title: 'Use unique passwords', detail: 'Never reuse a password across important accounts; a breach on one site can unlock others.' },
      { title: 'Prefer passkeys', detail: 'Passkeys reduce password reuse and phishing risk when the service supports them.' },
      { title: 'Enable verification', detail: 'Turn on multi-factor authentication and store recovery codes in a safe place.' },
    ],
    note: 'SENTRIQ does not collect passwords or recovery codes and cannot test the strength of credentials entered on this site.',
    actions: [
      { label: 'Browser check', route: '/security-scan' },
      { label: 'Security guidance', route: '/guides/android' },
    ],
  },
  {
    id: 'security-recommendations',
    name: 'Security Recommendations',
    description: 'Turn assessment findings and guidance into a focused list of next actions.',
    icon: 'activity',
    status: 'Recommendations',
    tone: 'blue',
    route: '/tools/security-recommendations',
    eyebrow: 'NEXT ACTIONS',
    overview: 'Recommendations are based on browser-accessible evidence, not assumptions about your device. Review the result, fix verified issues, and choose protection that fits your platform.',
    points: [
      { title: 'Review the assessment', detail: 'Open Trusted Advisor to see verified findings, their evidence, and suggested actions.' },
      { title: 'Address confirmed issues', detail: 'Prioritize insecure connections, missing secure context, and permissions you no longer need.' },
      { title: 'Choose trusted protection', detail: 'Use a reputable native security app for files, apps, and system-level threats.' },
    ],
    note: 'No support contact is required to view results, and missing information is never presented as a critical issue.',
    actions: [
      { label: 'Open advisor', route: '/trusted-advisor' },
      { label: 'Explore protection', route: '/products' },
    ],
  },
];

export function findTool(id: string): SecurityTool | undefined {
  return securityTools.find(tool => tool.id === id);
}
