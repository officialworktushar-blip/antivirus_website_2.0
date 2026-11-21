# antivirus_website_2.0

## SENTRIQ — Mobile Security & Digital Protection

A mobile-first cybersecurity product foundation built with React, TypeScript, and Vite.

### Development

```sh
npm install
npm run dev
```

### Production build

```sh
npm run build
npm run preview
```

The current foundation is a frontend prototype. Scan results are generated in the browser; connect a trusted server-side assessment service before treating them as real device diagnostics.

### Optional support phone

Copy `.env.example` to `.env.local` and set `VITE_SUPPORT_PHONE` to your real support number in international format. If it is unset, the homepage links to the support form instead of displaying a phone number.
