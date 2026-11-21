export type ProductFilter = 'android' | 'ios' | 'cross-platform' | 'malware' | 'privacy' | 'scam';
export type StoreLink = { label: string; url: string };

export type SecurityProduct = {
  slug: string;
  name: string;
  brand: string;
  description: string;
  logoUrl: string;
  officialUrl: string;
  playStore?: StoreLink;
  appStore?: StoreLink;
  platforms: ('Android' | 'iOS')[];
  android: string;
  ios: string;
  features: { title: string; detail: string; category: ProductFilter }[];
  installSteps: string[];
  note: string;
};

export const products: SecurityProduct[] = [
  {
    slug: 'bitdefender-mobile-security', name: 'Bitdefender Mobile Security', brand: 'Bitdefender', logoUrl: 'https://www.bitdefender.com/favicon.ico',
    description: 'A mobile security product with separate Android and iOS offerings. The Android product includes malware scanning; the iOS offering focuses on web, scam, privacy, and device-setting protections within iOS limits.',
    officialUrl: 'https://www.bitdefender.com/en-us/consumer/mobile-security-android',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bitdefender.security' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/bitdefender-mobile-security/id1255893012' },
    platforms: ['Android', 'iOS'], android: 'Available for Android. Bitdefender’s current support documentation lists Android 7 or later; confirm requirements on the provider page before installing.', ios: 'Available for iPhone and iPad. iOS protections are designed around Apple’s platform restrictions; confirm current requirements in the App Store.',
    features: [
      { title: 'Malware scanning', detail: 'Android: scans installed apps and supports on-demand malware scans.', category: 'malware' },
      { title: 'Web protection', detail: 'Helps block malicious and phishing websites in supported contexts.', category: 'scam' },
      { title: 'Scam protection', detail: 'Offers tools intended to help identify suspicious links and scam attempts.', category: 'scam' },
      { title: 'Privacy tools', detail: 'Features vary by platform and can include VPN and account-exposure tools.', category: 'privacy' },
    ],
    installSteps: ['Open the official provider page or store listing.', 'Install from Google Play or the App Store.', 'Open the app and follow the provider’s on-screen setup and permission explanations.', 'Review which protections are available for your device and plan.'],
    note: 'Feature availability differs between Android and iOS.',
  },
  {
    slug: 'malwarebytes-mobile-security', name: 'Malwarebytes Mobile Security', brand: 'Malwarebytes', logoUrl: 'https://www.malwarebytes.com/favicon.ico',
    description: 'Mobile protection for Android and iOS that emphasizes scam, web, privacy, and identity-related tools; Android includes malware scanning and removal capabilities.',
    officialUrl: 'https://www.malwarebytes.com/mobile',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=org.malwarebytes.antimalware' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/malwarebytes-mobile-security/id1327105431' },
    platforms: ['Android', 'iOS'], android: 'Available for Android. The provider’s current Google Play listing specifies Android 10 or later; verify current requirements before installation.', ios: 'Available for iPhone and iPad. iOS does not permit traditional malware-file scans across the device; the provider focuses on permitted protection features.',
    features: [
      { title: 'Malware protection', detail: 'Android includes malware scanning and threat-removal capabilities.', category: 'malware' },
      { title: 'Scam and web protection', detail: 'Provider documentation describes tools for suspicious links, texts, calls, and websites.', category: 'scam' },
      { title: 'Privacy VPN', detail: 'VPN availability and plan coverage vary by platform and subscription.', category: 'privacy' },
      { title: 'Digital footprint tools', detail: 'Offers account and personal-information exposure guidance in supported plans and regions.', category: 'privacy' },
    ],
    installSteps: ['Use the official Malwarebytes site or your device’s official store.', 'Install the app, then open it.', 'Choose setup options and review requested permissions before allowing them.', 'Sign in or restore a subscription only if you already have one.'],
    note: 'iOS protection is different from Android because of iOS platform restrictions.',
  },
  {
    slug: 'norton-360', name: 'Norton 360', brand: 'Norton', logoUrl: 'https://us.norton.com/favicon.ico',
    description: 'A mobile security suite for Android and iOS with provider-described device, web, Wi-Fi, VPN, and scam-protection features. Availability varies by plan and country.',
    officialUrl: 'https://us.norton.com/products/norton-360-for-mobile',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.symantec.mobilesecurity' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/norton-360-mobile-security-vpn/id1278474169' },
    platforms: ['Android', 'iOS'], android: 'Available for Android. Norton support currently lists Android 10 or later for the Norton 360 app; confirm the latest requirement before installing.', ios: 'Available for iPhone and iPad. Norton support currently lists iOS 17 or later; confirm the latest requirement before installing.',
    features: [
      { title: 'App and device security', detail: 'Android and iOS security features differ by platform and product plan.', category: 'malware' },
      { title: 'Web and scam protection', detail: 'Provider describes protections designed to help with malicious sites and scam messages.', category: 'scam' },
      { title: 'Wi-Fi security', detail: 'Provider lists network-risk notifications as an available mobile security capability.', category: 'privacy' },
      { title: 'VPN and privacy', detail: 'VPN availability is country and plan dependent.', category: 'privacy' },
    ],
    installSteps: ['Open the official Norton product page or the official app store listing.', 'Install Norton 360 from your device’s store.', 'Read the provider’s License and Privacy information before accepting.', 'Enable only the protection settings and permissions you understand and want.'],
    note: 'Some features, including VPN and monitoring, depend on country, platform, and subscription.',
  },
  {
    slug: 'avast-one', name: 'Avast One', brand: 'Avast', logoUrl: 'https://www.avast.com/favicon.ico',
    description: 'An all-in-one security, privacy, and performance product for Android and iOS. Avast’s current mobile product experience is replacing older Avast One and Avast Mobile Security apps.',
    officialUrl: 'https://www.avast.com/en-us/avast-one',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.avast.android.mobilesecurity' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/avast-one-security-privacy/id1276551855' },
    platforms: ['Android', 'iOS'], android: 'Available for Android. Avast lists Android 9 or later for Avast One; confirm the current store requirement before installing.', ios: 'Available for iPhone and iPad. Avast lists iOS 15 or later on its product page; confirm the current App Store requirement before installing.',
    features: [
      { title: 'Antivirus protection', detail: 'Provider describes protection intended to help defend against viruses and other threats.', category: 'malware' },
      { title: 'Scam and web tools', detail: 'Provider describes Web Guard and Scam Guardian features for supported products.', category: 'scam' },
      { title: 'Network checks', detail: 'Provider describes Wi-Fi and network-inspection capabilities.', category: 'privacy' },
      { title: 'Privacy features', detail: 'VPN and breach-related tools are listed by the provider; availability varies by plan and region.', category: 'privacy' },
    ],
    installSteps: ['Visit Avast’s official product page or your official app store.', 'Install the current Avast One mobile app.', 'Open it and review each requested permission before continuing.', 'Use the provider’s in-app instructions to choose available protections.'],
    note: 'Avast is migrating older mobile apps into the current Avast One experience.',
  },
];

export const productFilters: { id: ProductFilter; label: string }[] = [
  { id: 'android', label: 'Android' }, { id: 'ios', label: 'iOS' }, { id: 'cross-platform', label: 'Cross-platform' },
  { id: 'malware', label: 'Malware Protection' }, { id: 'privacy', label: 'Privacy' }, { id: 'scam', label: 'Scam Protection' },
];

export const findProduct = (slug: string) => products.find(product => product.slug === slug);
