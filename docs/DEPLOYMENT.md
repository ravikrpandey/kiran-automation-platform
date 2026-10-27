# Deployment and configuration — temporary full-stack demo

## Scope and status

This guide describes the independent demo: Node.js 22/Express serves the built React/Vite frontend and `/api/*` from one origin; Drizzle/MySQL uses a new Aiven service; career resumes use a private Cloudflare R2 bucket. Only fresh demo submissions are stored. There is no connection to the legacy PHP system, account migration, production domain or DNS change.

Aiven, Render and R2 accounts/credentials have not been configured. Do not apply the Blueprint or deploy until implementation review, private settings and explicit deployment preparation are complete. Never place provider credentials, CA material, administrator password hashes, session cookies, resume files or SMTP credentials in this repository, a public issue or chat. Use the ignored local `.env` or provider private dashboards.

## Local setup

1. Install Node.js 22 and use the repository-pinned pnpm 10.18. From the repository root, install with `pnpm install --frozen-lockfile`.
2. Copy `.env.example` to `.env`; keep variables empty for services not configured. The `pnpm dev` command starts Vite on port 3000 and the Express API on port 4000; the Vite `/api` proxy keeps browser requests same-origin.
3. Configure a disposable local MySQL database and its `DATABASE_URL`. For remote MySQL, configure `MYSQL_SSL_CA` and require certificate verification. Do not disable TLS verification to bypass a certificate problem.
4. Apply the checked-in migrations to an empty disposable database using `pnpm db:migrate`. Do not use `pnpm db:push` for deployment; it changes schema outside the reviewed migration history. `pnpm build` does not contact or migrate a database.
5. Run `pnpm check`, `pnpm test` and `pnpm build`. Do not test by submitting to Kiran's live forms or by using real customer data.

### One administrator only

There is no public customer registration/login. Run `pnpm admin:hash` in an interactive terminal; it asks for the password twice without echoing it and prints a salted scrypt hash. Do not put a plaintext password in a command, source file, shell history, issue or chat. Configure `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD_HASH` privately.

After migrating a fresh demo database, `pnpm admin:bootstrap` creates the single matching administrator or verifies that the same administrator already exists; it refuses incomplete settings, a different existing administrator or multiple accounts. Production startup runs reviewed migrations with bounded connection retries and performs the same bootstrap automatically. Remove or rotate bootstrap settings after first setup where operationally safe. Admin sessions are random database-backed tokens; password changes revoke existing sessions. There are no demo/default credentials and no email password-reset flow.

## Aiven MySQL and TLS

Create a new Aiven MySQL service for this demo only; do not point it at an existing business database. The researched free plan shape is one node with 1 CPU, 1 GB RAM and 1 GB storage, may power off after inactivity and is intended for prototype/small workloads. Confirm current plan and limits in the Aiven console.

Set `DATABASE_URL` to the service's MySQL connection URL and `MYSQL_SSL_CA` to the Aiven project CA PEM, supplied privately to the runtime. The application requires verified TLS for production and non-local development. Never disable certificate verification or store the DSN/CA in Git. Use an empty demo database for the first migration. Render Free does not support `preDeployCommand`; migrations run from the production startup path, not the build. `/api/health` is liveness; Render uses `/api/ready`, which waits for the migration step and checks MySQL readiness.

## Render Blueprint

`render.yaml` defines a native Node web service in Singapore on the Free plan, with disabled automatic deploys, frozen pnpm install/build, `pnpm start`, and `/api/ready`. Render supplies `PORT`; the production server honors it. The build is migration-free and there is no `preDeployCommand`.

When the implementation and private settings are ready and deployment is explicitly authorized:

1. Apply a Blueprint from `ravikrpandey/kiran-automation-platform`, branch `main`, then review the proposed service/config before confirming. Leave automatic deploys disabled.
2. Enter `DATABASE_URL`, `MYSQL_SSL_CA`, `ADMIN_BOOTSTRAP_EMAIL` and `ADMIN_BOOTSTRAP_PASSWORD_HASH` through Render's private Environment dashboard. Configure all four `R2_*` values only if R2 is ready. SMTP values remain blank. Do not use fake values to force startup.
3. Confirm build, startup migrations/bootstrap and `/api/ready`. Smoke-test forms and access control only with disposable data and the private test bucket. Expect cold starts and possible database idle wake-up.

No Render/Aiven accounts or private credentials are configured at the time of this guide. Do not treat this file as evidence of a completed deployment.

## Private Cloudflare R2 resumes

Create a dedicated private bucket and narrow-scope S3-compatible credentials for it. Configure `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID` and `R2_SECRET_ACCESS_KEY` privately. The server validates PDF/DOC/DOCX extension and file signatures, caps a resume at 5 MiB, holds it in memory only for the request, writes it directly to R2, and stores the private object key in MySQL. It does not use Render disk or a public bucket.

Browser-to-bucket upload CORS is not required by this implementation because upload bytes are sent server-to-server. An authenticated admin may request a short-lived (60-second) signed download URL; treat it as a bearer secret. Before enabling career submissions, verify private object access, expiry, authorized admin checks, failure cleanup and deletion/retention operations. Until all R2 values exist, the career form reports upload unavailability and does not accept applications.

## Email later, not now

`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` and `MAIL_FROM` remain blank. Form records are persisted independently; their `notification_status` starts as `not_configured`, and the UI explicitly states that email acknowledgements/notifications are not sent. No mail sender or email password-reset feature is enabled.

Render Free blocks outbound SMTP ports 25, 465 and 587. Later notification delivery needs an implemented/tested provider HTTP API, a provider-supported alternate SMTP port, or a suitable upgraded host. Keep credentials private and test delivery, errors/bounces and privacy wording before enabling mail.

## Temporary-demo limits and production gates

Render Free sleeps after 15 minutes idle and has ephemeral filesystem storage; Aiven Free is a small single-node prototype service and may power off after inactivity. This demo can be unavailable during wake-up and has limited capacity. Do not describe it as always-on, production-grade or safe for business-critical lead records.

Before real/business use, obtain owner/privacy review for the notice, controller/contact identity, purpose/consent and applicable legal text; implement retention and deletion rules; test database and resume backup/restore; complete private R2 upload/download/authorization/expiry/deletion checks; review admin sessions, CSRF/origin controls, rate limits and error handling; verify fresh-database migrations, monitoring and capacity; rotate/scoped credentials; and approve a production release/domain plan. No DNS or production-domain change is part of this task.

Provider research, source links and constraints are recorded in [hosting-and-storage-research.md](hosting-and-storage-research.md).
