import type { IconName } from '../components/ui';

export type ProductFilter = 'android' | 'ios' | 'cross-platform' | 'malware' | 'privacy' | 'scam';
export type StoreLink = { label: string; url: string };

export type SecurityFeature = {
  title: string;
  detail: string;
  category: ProductFilter;
  icon: IconName;
};

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
  features: SecurityFeature[];
  installSteps: string[];
  note: string;
  sources: StoreLink[];
};

export const products: SecurityProduct[] = [
  {
    slug: 'bitdefender',
    name: 'Bitdefender Mobile Security',
    brand: 'Bitdefender',
    description: 'An Android-focused mobile security product from Bitdefender. The provider lists malware scanning, web and scam protection, anti-theft tools, VPN access, and account-breach checks with iOS protection available through its separate mobile offering.',
    logoUrl: 'https://www.bitdefender.com/favicon.ico',
    officialUrl: 'https://www.bitdefender.com/en-us/consumer/mobile-security-android',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.bitdefender.security' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/bitdefender-mobile-security/id1255893012' },
    platforms: ['Android', 'iOS'],
    android: 'Android is supported by Bitdefender Mobile Security. The official product page lists Android 7.0 or later and an active internet connection; confirm current requirements before installing.',
    ios: 'Bitdefender also lists iOS protection through its mobile security offering. iOS capabilities are limited by Apple platform rules, so check the official App Store listing for current features and requirements.',
    features: [
      { title: 'Malware scanning', detail: 'The provider lists on-demand and on-install app scanning for Android.', category: 'malware', icon: 'shield-check' },
      { title: 'Web protection', detail: 'The provider describes warnings for fraudulent or phishing webpages.', category: 'scam', icon: 'globe' },
      { title: 'Scam protection', detail: 'The provider lists scam alerts across texts, calls, and supported chat apps.', category: 'scam', icon: 'alert' },
      { title: 'Privacy tools', detail: 'The provider lists VPN access, app lock, and account-breach checks; availability varies by platform and plan.', category: 'privacy', icon: 'lock' },
      { title: 'Anti-theft tools', detail: 'The provider describes locate and lock tools for supported Android devices.', category: 'malware', icon: 'phone' },
    ],
    installSteps: [
      'Open the official Bitdefender product page or the official app-store listing for your device.',
      'Install only from the official provider or app store link shown on this page.',
      'Open the app and follow Bitdefender’s on-screen setup instructions.',
      'Review each permission request and confirm which protections are available for your platform and subscription.',
    ],
    note: 'Feature availability differs between Android and iOS. Confirm current details on the official provider page and app-store listings.',
    sources: [
      { label: 'Official product page', url: 'https://www.bitdefender.com/en-us/consumer/mobile-security-android' },
      { label: 'Google Play listing', url: 'https://play.google.com/store/apps/details?id=com.bitdefender.security' },
      { label: 'App Store listing', url: 'https://apps.apple.com/us/app/bitdefender-mobile-security/id1255893012' },
    ],
  },
  {
    slug: 'malwarebytes',
    name: 'Malwarebytes Mobile Security',
    brand: 'Malwarebytes',
    description: 'A mobile security product for Android and iOS from Malwarebytes. The provider lists scam protection, web protection, privacy tools, identity-related tools, and Android malware scanning and removal.',
    logoUrl: 'https://www.malwarebytes.com/favicon.ico',
    officialUrl: 'https://www.malwarebytes.com/mobile',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=org.malwarebytes.antimalware' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/malwarebytes-mobile-security/id1327105431' },
    platforms: ['Android', 'iOS'],
    android: 'Android is supported. The official page lists web protection, scam text protection, a junk cleaner, a threat scanner and remover, VPN access, and digital-footprint tools; confirm current requirements in Google Play.',
    ios: 'iOS is supported. The official page lists web protection, call protection, ad and tracker blocking, scam text protection, VPN access, and digital-footprint tools; confirm current requirements in the App Store.',
    features: [
      { title: 'Malware protection', detail: 'The provider lists a threat scanner and remover for Android.', category: 'malware', icon: 'shield-check' },
      { title: 'Scam protection', detail: 'The provider lists Scam Guard, text protection, call protection, and safe browsing tools.', category: 'scam', icon: 'alert' },
      { title: 'Privacy VPN', detail: 'The provider lists high-speed Privacy VPN access; availability depends on platform and plan.', category: 'privacy', icon: 'lock' },
      { title: 'Digital footprint tools', detail: 'The provider lists digital-footprint and identity-related tools in supported plans.', category: 'privacy', icon: 'eye' },
      { title: 'Security guidance', detail: 'The provider describes personalized guidance and a live security score.', category: 'scam', icon: 'activity' },
    ],
    installSteps: [
      'Open the official Malwarebytes mobile page or the official app-store listing for your device.',
      'Install the app from Google Play or the App Store.',
      'Open the app and follow the provider’s setup flow.',
      'Review permissions and plan-dependent features before enabling them.',
    ],
    note: 'iOS protection differs from Android because Apple platform rules limit traditional malware scanning.',
    sources: [
      { label: 'Official mobile page', url: 'https://www.malwarebytes.com/mobile' },
      { label: 'Google Play listing', url: 'https://play.google.com/store/apps/details?id=org.malwarebytes.antimalware' },
      { label: 'App Store listing', url: 'https://apps.apple.com/us/app/malwarebytes-mobile-security/id1327105431' },
    ],
  },
  {
    slug: 'norton',
    name: 'Norton 360',
    brand: 'Norton',
    description: 'A mobile security suite from Norton. Norton lists Android and iOS mobile protection with device, web, Wi-Fi, VPN, and scam-related tools; availability depends on device, plan, and country.',
    logoUrl: 'https://us.norton.com/favicon.ico',
    officialUrl: 'https://us.norton.com/products/norton-360-for-mobile',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.symantec.mobilesecurity' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/norton-360-mobile-security-vpn/id1278474169' },
    platforms: ['Android', 'iOS'],
    android: 'Android is supported through Norton’s official mobile app listing. Check the official product page and Google Play listing for the current Android version requirement and available features.',
    ios: 'iOS is supported through Norton’s official mobile app listing. Check the official product page and App Store listing for the current iOS version requirement and available features.',
    features: [
      { title: 'Mobile device protection', detail: 'Norton lists device and app security tools for supported mobile plans.', category: 'malware', icon: 'shield-check' },
      { title: 'Web protection', detail: 'The provider describes tools intended to help with risky websites.', category: 'scam', icon: 'globe' },
      { title: 'Scam protection', detail: 'Norton lists scam-related protection tools in supported mobile offerings.', category: 'scam', icon: 'alert' },
      { title: 'Wi-Fi security', detail: 'The provider lists network-risk notifications as a mobile capability.', category: 'privacy', icon: 'wifi' },
      { title: 'VPN and privacy', detail: 'VPN availability depends on plan, device, and country.', category: 'privacy', icon: 'lock' },
    ],
    installSteps: [
      'Open the official Norton 360 for Mobile page or the official app-store listing for your device.',
      'Install the Norton mobile app from Google Play or the App Store.',
      'Read the provider’s license and privacy information before accepting setup choices.',
      'Enable only the protections and permissions you understand and want to use.',
    ],
    note: 'Some features depend on country, platform, and subscription. Confirm current details on official Norton pages.',
    sources: [
      { label: 'Official product page', url: 'https://us.norton.com/products/norton-360-for-mobile' },
      { label: 'Google Play listing', url: 'https://play.google.com/store/apps/details?id=com.symantec.mobilesecurity' },
      { label: 'App Store listing', url: 'https://apps.apple.com/us/app/norton-360-mobile-security-vpn/id1278474169' },
    ],
  },
  {
    slug: 'avast',
    name: 'Avast One',
    brand: 'Avast',
    description: 'An all-in-one security and privacy product from Avast for Android and iOS. The provider describes antivirus protection, web and scam tools, network checks, and privacy features with availability varying by platform and plan.',
    logoUrl: 'https://www.avast.com/favicon.ico',
    officialUrl: 'https://www.avast.com/en-us/avast-one',
    playStore: { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=com.avast.android.mobilesecurity' },
    appStore: { label: 'App Store', url: 'https://apps.apple.com/us/app/avast-one-security-privacy/id1276551855' },
    platforms: ['Android', 'iOS'],
    android: 'Android is supported through Avast’s official mobile app listing. Confirm the current Android version requirement and available features on the official product page and Google Play listing.',
    ios: 'iOS is supported through Avast’s official mobile app listing. Confirm the current iOS version requirement and available features on the official product page and App Store listing.',
    features: [
      { title: 'Antivirus protection', detail: 'Avast describes protection against viruses and other threats.', category: 'malware', icon: 'shield-check' },
      { title: 'Web and scam tools', detail: 'The provider describes web and scam protection tools for supported products.', category: 'scam', icon: 'globe' },
      { title: 'Network checks', detail: 'The provider lists Wi-Fi and network-inspection capabilities.', category: 'privacy', icon: 'wifi' },
      { title: 'Privacy features', detail: 'VPN and breach-related tools are listed by the provider; availability varies by plan and region.', category: 'privacy', icon: 'lock' },
    ],
    installSteps: [
      'Visit Avast’s official product page or your official app-store listing.',
      'Install the current Avast One mobile app.',
      'Open the app and review each requested permission before continuing.',
      'Use Avast’s in-app instructions to choose the available protections.',
    ],
    note: 'Avast describes a current Avast One app experience across its mobile offerings. Confirm details on official Avast pages.',
    sources: [
      { label: 'Official product page', url: 'https://www.avast.com/en-us/avast-one' },
      { label: 'Google Play listing', url: 'https://play.google.com/store/apps/details?id=com.avast.android.mobilesecurity' },
      { label: 'App Store listing', url: 'https://apps.apple.com/us/app/avast-one-security-privacy/id1276551855' },
    ],
  },
];

export const productFilters: { id: ProductFilter; label: string }[] = [
  { id: 'android', label: 'Android' },
  { id: 'ios', label: 'iOS' },
  { id: 'cross-platform', label: 'Cross-platform' },
  { id: 'malware', label: 'Malware Protection' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'scam', label: 'Scam Protection' },
];

export const findProduct = (slug: string) => products.find(product => product.slug === slug);
