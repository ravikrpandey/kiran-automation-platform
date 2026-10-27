# Kiran Automation — full-stack demo

This repository contains a React/Vite frontend and an independent Node.js/Express + MySQL demo for fresh business enquiries and career applications. The intended demo deployment is Render Free, Aiven MySQL and private Cloudflare R2 for resumes. It does not connect to or migrate the legacy PHP site, customer accounts or existing lead data.

## GitHub Pages static preview

The user-requested GitHub Pages version is a static visual/catalog preview only. GitHub Pages cannot run the Node/MySQL API or private resume storage, so enquiry and career forms, resume uploads, and administrator access are disabled in that build; it collects no submissions. The full-stack Render/Aiven/R2 demo remains separate and is not deployed. Pages builds are kept `noindex` while the public demo and privacy policy are awaiting owner review.

## Local development

Use Node.js 22 and the repository-pinned pnpm 10.18. Install with `pnpm install --frozen-lockfile`, copy `.env.example` to `.env`, and fill only values for services you control. `pnpm dev` starts Vite on port 3000 and the API on port 4000; `pnpm build` creates the prerendered frontend and bundled Node service. Run `pnpm check` and `pnpm test` for local checks. `pnpm db:migrate` applies the checked-in migrations to `DATABASE_URL`.

Use only a disposable local/demo MySQL database. Never point tests at Kiran's live systems or use real customer data. For a fresh local database, migrate it before database-backed flows. `pnpm admin:hash` prompts for and confirms a password without echoing it, then prints a salted scrypt hash. Set the email/hash through private local environment variables and run `pnpm admin:bootstrap` after migrations; this command creates one administrator or verifies the matching existing one. Production startup performs the checked-in migrations with bounded retries and the same one-admin bootstrap from private runtime settings.

See [Deployment and configuration](docs/DEPLOYMENT.md) for Render/Aiven/R2 setup, TLS, privacy and operational gates. Hosting assumptions and source citations are in [hosting and storage research](docs/hosting-and-storage-research.md).

## Demo limitations and security

Render Free sleeps after 15 idle minutes and has ephemeral disk; Aiven Free is a small single-node prototype database that may power off after inactivity. This is a temporary, low-volume demo, not an always-on or production-grade lead system. Resume submissions remain unavailable until private R2 credentials are configured and tested. SMTP is intentionally unconfigured: forms must not claim that an email was sent.

Never commit `.env`, database credentials, Aiven CA material, admin password hashes, R2/mail keys or customer-identifying exports. Enter private values only in the ignored local `.env` or the relevant provider dashboard. Do not collect real/business submissions until privacy, retention, backup/recovery and operational gates have been completed. No production domain or DNS change is included.
