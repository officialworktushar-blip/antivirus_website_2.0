CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, brand TEXT NOT NULL,
  description TEXT NOT NULL, official_url TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1,
  platforms_json TEXT NOT NULL DEFAULT '[]', features_json TEXT NOT NULL DEFAULT '[]', updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS support_requests (
  id TEXT PRIMARY KEY, name TEXT, contact TEXT, platform TEXT NOT NULL, category TEXT NOT NULL,
  description TEXT NOT NULL, consent INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, completed_at TEXT
);
CREATE TABLE IF NOT EXISTS assessment_events (
  id TEXT PRIMARY KEY, device_platform TEXT NOT NULL, is_demo INTEGER NOT NULL,
  available_checks INTEGER NOT NULL, unavailable_checks INTEGER NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS product_clicks (id TEXT PRIMARY KEY, product_slug TEXT NOT NULL, created_at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS admin_sessions (token_hash TEXT PRIMARY KEY, expires_at TEXT NOT NULL, created_at TEXT NOT NULL);
