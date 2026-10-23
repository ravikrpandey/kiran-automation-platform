# Kiran Automation website redesign — plan

## Scope and implementation boundary

Build an unpublished, reviewable redesign preview in the newly initialized Manus WebDev project. No source repository or production credentials were provided, so this is not a modification of Kiran Automation’s live PHP site. The project is a static React/TypeScript site with no managed server or database. It will preserve useful public URL paths where the redesign can represent them safely. Existing enquiry, career-application, login, registration, and password-reset workflows must not be replaced by a fake frontend form: until the original backend is available for integration, relevant calls to action will link explicitly to the existing live workflows. No production deployment, domain switch, destructive migration, account-system rewrite, or existing database write is included.

The public source currently identifies Kiran Automation as a Delhi-based system integrator focused on turn-key robotic automation for electronics manufacturing. Its homepage lists PCB handling/testing, SMT-machine loading, robot auto-screwing, robotic soldering, gluing/dispensing, part feeding, vision inspection, label pasting, material handling, end-of-line automation and palletizing. These are statements from the current site, not independently verified outcomes. The live navigation exposes six product categories: Industrial Furniture, Material Handling, Robotics, Inspection & Testing, Material Processing and Other Equipment. Use only category/product records and page descriptions that are verified in the route audit. Do not invent product names, specifications, project metrics, customers, testimonials, awards, certifications or response times. Claims such as “leader” are removed. Partnership statements remain omitted or flagged for business validation unless confirmed.

## Information architecture and route behavior

Retain the established paths where possible: `/`, `/about-us`, `/who-we-are`, `/services`, `/products`, `/products/industrial-furniture`, `/products/material-handling`, `/products/robotics-`, `/products/inspection-and-testing`, `/products/material-processing`, `/products/other-equipment`, `/enquiry`, `/contact-us` and `/career`. The two existing company-introduction routes will resolve to the same refreshed company content, with route metadata handled deliberately. Use a reusable product detail template only when a genuine product record and verified information are available; do not publish fictional detail entries or dead category pages.

The detailed audit also confirms a live family of 20 catalog entries under `/product_details/{slug}`. The preview will preserve each verified public slug as a route and use the real catalog title, category and first-party image. It will not copy questionable prose, technical values or downloads. Detail concerns found by audit (the EPSON/Kinova wording, residential-style ELECTRICAL PANEL copy and the likely unrelated turntable PDF) will be omitted from the new descriptions and explicitly flagged for owner review.

The site navigation will make Applications/Services, Products, About and Contact discoverable without excessive top-level links. The footer includes navigation, category links, the public email and existing account destinations; the Contact page displays the current public street address/email with an owner-confirmation note. Unverified working hours are omitted. Account actions continue to point to the existing live login/register/reset routes. The enquiry and career preview pages explain that the current live submission route remains in service and provide direct, clearly labeled links to it; the preview must not imply that a local form submission reaches Kiran’s systems. Do not recreate authentication or any external OAuth flow.

## Homepage and reusable pages

The homepage follows the sequence: brand header and contextual enquiry CTA; an editorial split hero with a verified industrial equipment image and concise positioning; a short company/capability introduction; verified application cards; product-category discovery; a clearly labeled proposed engineering conversation/delivery framework only if the audit finds no published process; authentic evidence only where available; practical FAQs with qualified answers; final enquiry action; and a compact footer. No testimonial placeholder, customer-logo wall, synthetic case study, unsupported numerical benefit or unrelated stock image will be shown.

Services/applications pages will explain only the applications described on the current site and will distinguish published company claims from independently verified project outcomes. Product category pages will use verified source descriptions and real site imagery where their relevance is clear; if an existing category has no meaningful data, explain what information can be requested and link to the existing enquiry route rather than fabricate a catalog. About content will improve grammar and structure while preserving confirmed information. Contact content will use the public contact details and direct links. Career, enquiry and account flows remain connected to the live site until the source integration is authorized and available.

## Design direction

**Design Movement:** Precision industrial editorial: an original engineering-oriented interpretation of the reference site’s clear storytelling, disciplined hierarchy and generous whitespace, not a recreation of its distinctive interface.

**Core Principles:** (1) Begin with the manufacturing task and application. (2) Treat evidence and technical clarity as the trust system. (3) Make product discovery and enquiry paths predictable. (4) Keep motion subordinate to usability.

**Color Philosophy:** Retain the existing black wordmark and warm orange arc. Use a warm near-white surface for long reading, charcoal for structure and text, restrained industrial gray for secondary information, and logo-derived orange for key links/actions. Initial tokens: ink `#20201D`, paper `#F6F5F1`, white `#FFFFFF`, muted `#676962`, border `#DAD9D3`, and logo-orange `#D7650A`. Use an accessible darker orange/ink combination for text buttons; reserve saturated orange fills for high-contrast actions. No ubiquitous gradient. Confirm final rendered contrast before delivery.

**Layout Paradigm:** Asymmetric editorial split sections rather than repeated centered panels: text and machine imagery alternate by section; category cards form a compact catalogue strip; technical details use aligned label/value rows; wide section spacing is balanced by a bounded reading width. Container max-width 1240px; outer gutters are 24px by default, 20px at widths ≤780px and 18px at ≤520px. The product/category grid uses three columns above 780px, two columns from 520–780px, then compact single-column image/copy cards at ≤520px. Responsive refinements use 1020/780/520px breakpoints; section padding is 100/75/64px.

**Signature Elements:** Orange engineering-rule accents beside section labels; small uppercase application/section metadata; simple line and panel treatments that echo machinery without drawing fake technical diagrams.

**Interaction Philosophy and motion:** Native links/buttons, keyboard-operable navigation and filters, clear focus states, an accessible mobile menu, and native disclosure behavior for FAQs. Interactions should reveal or navigate, not distract. Transitions are short and subtle; disable nonessential motion under `prefers-reduced-motion`. No autoplay, scroll-jacking, parallax or intrusive overlays.

**Typography System:** Use the implemented system sans stack `Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif` without a remote font dependency; use monospace only for numeric labels/metadata. Hero H1 uses `clamp(42px, 5vw, 67px)` on desktop with responsive tablet/phone clamps; section H2 uses `clamp(32px, 3.6vw, 48px)` and 33px on the narrowest screens; page H1 scales to approximately 39px on phones. Body copy is 16px/1.65, hero lead 16–18px on wider screens and 15px on narrow phones; navigation/buttons are 13px, card titles 14–17px, and metadata 10–13px with tracked labels. Primary controls use 44–48px minimum heights; major FAQ disclosures use 60px. Component widths constrain prose for readable line length.

**Brand Essence:** “Robotic automation and engineered equipment for electronics-manufacturing processes,” based on the public site’s stated positioning. Personality: precise, practical, dependable. **Brand voice:** direct, specific and uninflated. Example lines: “Automation for the process your line needs to perform.” “Start with the application, the part and the production constraint.”

**Wordmark and logo:** Preserve the existing Kiran Automation logo asset; do not redraw or replace the wordmark. Use a light header unless an official reversed asset is supplied. **Signature brand color:** the existing logo’s orange, sampled as `#D7650A` and adjusted only if needed for WCAG contrast.

## Technical approach and project structure

Use the initialized React 19, TypeScript, Vite, Wouter and Tailwind project. Avoid new runtime dependencies. Keep the project static because no form service, business API, product CMS or account backend is available. The `web-db-user` starter is provisioned with server/database disabled; use its `pnpm dev:static` and `pnpm build:static` paths. Preserve the starter’s pinned package manager and existing dependency setup.

For search/readability, use the existing Vite/React stack to pre-render the same route components into route-specific static HTML after the Vite build; hydrate those snapshots in production and use the normal browser-render path in development. Generate route-specific title, description, social-card basics and `noindex` metadata. Omit absolute canonical/social URLs until the owner-authorized production origin is known. Keep all pages static; this does not create or mimic the legacy backend.

Proposed source organization:

- `client/src/App.tsx`: route table, shared application shell and not-found behavior.
- `client/src/components/`: header/mobile navigation, footer, breadcrumbs, section headings, category cards, CTA, FAQ disclosures and reusable page layout.
- `client/src/content/`: audited company facts, application labels, category data, contact details and source/verification notes.
- `client/src/pages/`: Home, About/Who We Are, Services/Applications, Products, Category, Contact/Enquiry and Career bridge pages.
- `client/src/lib/`: route-aware title/description updates and reusable legacy-link helpers.
- `client/public/`: `/manus-routes.json`, favicon/brand files where appropriate, and preview-only robots metadata. Do not publish a canonical URL or production sitemap pointing at an unknown domain.
- `scripts/prerender.tsx`: build-time React/Wouter rendering for the same route components and route-specific metadata, generating static route snapshots and `404.html`.
- Managed project storage: the original Kiran logo and selected Kiran-site equipment images, uploaded using the WebDev asset workflow. No third-party search-result image is selected because its usage rights were not established.

The route manifest will enumerate actual implemented routes and include only a dynamic pattern if a genuine detail route is supported. Page titles/descriptions will be route-specific; the preview will be `noindex` until a production-domain migration is explicitly authorized. On production integration, canonical URLs, public `robots.txt`, sitemap, redirects and Search Console readiness depend on the owner’s domain and repository access.

## Dependencies, forms and external systems

No new server, database, API, authentication provider, analytics provider, CMS, e-mail sender or form endpoint is assumed. The source repository and production deployment credentials are absent. Enquiry/career/login/register/forgot-password links will be labeled as links to Kiran’s current live workflow, preserving the backend rather than simulating success. Copy will state that those processes still use the existing site. A future production merge requires the actual repository and its approved deployment process, verification of the form endpoints and authentication behavior, confirmation of business facts, and final content/image approval.

## Delivery boundary

Deliver a tested WebDev preview and an audit/handover report. Record completed, partial, blocked and validation-pending outcomes. The preview is not a replacement production website and will not be published to Kiran’s domain. Deployment and any change to live URLs, forms, accounts, APIs or data require authorized source/backend access and a separate explicit production release decision.
