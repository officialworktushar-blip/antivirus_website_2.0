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

### Administration API

The optional API is a small Node 22+ service using `node:sqlite`; it creates its own local data directory and applies the checked-in migration automatically. It stores aggregate assessment events, product clicks, support requests, administrator sessions, and internal notes — never passwords, OTPs, device identifiers, or device contents.

Generate a hash with `npm run hash-admin-password -- "a long unique passphrase"`, set `SENTRIQ_ADMIN_EMAIL` and `SENTRIQ_ADMIN_PASSWORD_HASH` only on the API host, then start it with `npm run server`. Deploy it on the same HTTPS origin as the client (or place it behind a same-origin reverse proxy). The admin API provides server-side auth, CSRF checks, validation, rate limiting, and HttpOnly sessions; use a managed database and persistent rate limiter before multi-instance production deployment.

Set `VITE_API_URL` only when the API is hosted at a different same-site origin through a reverse proxy. Do not put `SENTRIQ_ADMIN_*` values, API secrets, or production credentials in a `VITE_` variable: Vite exposes those values to the browser.

### Optional support phone

Copy `.env.example` to `.env.local` and set `VITE_SUPPORT_PHONE` to your real support number in international format. If it is unset, the homepage links to the support form instead of displaying a phone number.
