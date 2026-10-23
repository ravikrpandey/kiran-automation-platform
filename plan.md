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

**Design Movement:** Contemporary enterprise digital editorial, adapting the current Publicis Sapient site’s clear black/white contrast, expressive Lexend Deca headlines, Roboto body type, whitespace and red accents to Kiran Automation’s industrial catalog. Re-style every preview route consistently without copying Publicis Sapient’s brand name, logo, copy, assets or exact proprietary layout.

**Core Principles:** (1) Use a bright white canvas, confident black type and precise red accents. (2) Keep Kiran’s exact supplied wordmark, verified copy, products, routes and functionality intact. (3) Use the reference’s type hierarchy and clean page rhythm across homepage and internal templates. (4) Keep interaction, accessibility and industrial-product clarity ahead of decoration.

**Color Philosophy:** The supplied logo retains its original black and red pixels. Publicis Sapient’s live public stylesheet identifies its primary red as `#E90130`; the Kiran logo red samples near `#EB0F16`. Use reference red `#E90130` for interface accents/primary actions and Kiran red as the authentic wordmark color. Pair with black/charcoal `#1C1C1E`, white `#FFFFFF`, light neutral `#F6F6F6`, readable neutral gray `#666666` and clean dividers `#DDDDDD`. Use a darker Kiran-compatible red `#B4081C` for small links/text on white when contrast requires it. Keep green/warning/error colors semantic, not decorative. No warm orange theme or pervasive gradient.

**Layout Paradigm:** Preserve Kiran’s existing route information and content hierarchy, then re-skin all pages with generous enterprise whitespace, broad white sections, selective #F6F6F6 bands, crisp product cards and high-contrast black/red conversion areas. Keep the existing 1240px content width, asymmetric image/copy storytelling, three/two/one-column responsive product discovery and 1020/780/520px breakpoints. Use straighter, restrained panels and clear section transitions rather than recreating a reference page composition.

**Signature Elements:** A slim Kiran-red top information strip; precise red section rules and action cues; authentic industrial imagery presented on clean white/light-gray surfaces.

**Interaction Philosophy and motion:** Native links/buttons, keyboard-operable navigation and filters, clear focus states, an accessible mobile menu, and native disclosure behavior for FAQs. Interactions should reveal or navigate, not distract. Transitions are short and subtle; disable nonessential motion under `prefers-reduced-motion`. No autoplay, scroll-jacking, parallax or intrusive overlays.

**Typography System:** Match the live reference’s measured families: self-hosted, locally served variable Lexend Deca (`300–700`) for headings and Roboto (`300–700`) for body, navigation, labels and controls, both with `font-display: swap` and Open Font License notices. Use Lexend Deca H1 at roughly 64–72px desktop / 38–48px mobile, weight 400; section H2 up to 50px, weight 300–400; product H3 around 24px, weight 400. Use Roboto body at 16px/1.6, lead 18–20px, nav/buttons 14–16px and metadata 12–14px. Favor normal or lightly tracked letter spacing over the previous tightly condensed headline style. Keep accessible control sizes and readable prose widths.

**Brand Essence:** “Robotic automation and engineered equipment for electronics-manufacturing processes,” based on the public site’s stated positioning. Personality: precise, practical, dependable. **Brand voice:** direct, specific and uninflated. Example lines: “Automation for the process your line needs to perform.” “Start with the application, the part and the production constraint.”

**Wordmark and logo:** Use the exact Kiran Automation wordmark image supplied by the user in this request (optimized `1849 × 366` crop, managed path `/manus-storage/kiran-automation-logo_d1894f6b.png`) throughout the site header and footer and as the project’s WebDev platform logo. The crop removes only empty outer canvas; the artwork and colors are unchanged. Do not redraw, recolor or distort it. Its white field sits on a white header and in a white footer panel. **Signature brand color:** retain Kiran logo red sampled near `#EB0F16`, with the very similar reference-interface accent `#E90130` used for site controls and highlights.

## Technical approach and project structure

Use the initialized React 19, TypeScript, Vite, Wouter and Tailwind project. Avoid new runtime dependencies. Keep the project static because no form service, business API, product CMS or account backend is available. The `web-db-user` starter is provisioned with server/database disabled; use its `pnpm dev:static` and `pnpm build:static` paths. Preserve the starter’s pinned package manager and existing dependency setup.

For search/readability, use the existing Vite/React stack to pre-render the same route components into route-specific static HTML after the Vite build; hydrate those snapshots in production and use the normal browser-render path in development. Generate route-specific title, description, social-card basics and `noindex` metadata. Omit absolute canonical/social URLs until the owner-authorized production origin is known. Keep all pages static; this does not create or mimic the legacy backend.

Proposed source organization:

- `client/src/App.tsx`: route table, shared application shell and not-found behavior.
- `client/src/components/`: header/mobile navigation, footer, breadcrumbs, section headings, category cards, CTA, FAQ disclosures and reusable page layout.
- `client/src/content/`: audited company facts, application labels, category data, contact details and source/verification notes.
- `client/src/pages/`: Home, About/Who We Are, Services/Applications, Products, Category, Contact/Enquiry and Career bridge pages.
- `client/src/lib/`: route-aware title/description updates and reusable legacy-link helpers.
- `client/public/`: `/manus-routes.json`, self-hosted Lexend Deca/Roboto font files, favicon/brand files where appropriate, and preview-only robots metadata. Do not publish a canonical URL or production sitemap pointing at an unknown domain.
- `scripts/prerender.tsx`: build-time React/Wouter rendering for the same route components and route-specific metadata, generating static route snapshots and `404.html`.
- Managed project storage: the supplied Kiran wordmark and selected Kiran-site equipment images, uploaded using the WebDev asset workflow. No third-party search-result image is selected because its usage rights were not established. Reference-matched Google Fonts are distributed as local WOFF2 files with their SIL Open Font License notices.

The route manifest will enumerate actual implemented routes and include only a dynamic pattern if a genuine detail route is supported. Page titles/descriptions will be route-specific; the preview will be `noindex` until a production-domain migration is explicitly authorized. On production integration, canonical URLs, public `robots.txt`, sitemap, redirects and Search Console readiness depend on the owner’s domain and repository access.

## Dependencies, forms and external systems

No new server, database, API, authentication provider, analytics provider, CMS, e-mail sender or form endpoint is assumed. The source repository and production deployment credentials are absent. Enquiry/career/login/register/forgot-password links will be labeled as links to Kiran’s current live workflow, preserving the backend rather than simulating success. Copy will state that those processes still use the existing site. A future production merge requires the actual repository and its approved deployment process, verification of the form endpoints and authentication behavior, confirmation of business facts, and final content/image approval.

## Delivery boundary

Deliver a tested WebDev preview and an audit/handover report. Record completed, partial, blocked and validation-pending outcomes. The preview is not a replacement production website and will not be published to Kiran’s domain. Deployment and any change to live URLs, forms, accounts, APIs or data require authorized source/backend access and a separate explicit production release decision.


## Follow-up refinement request (23 October 2026)

The homepage catalogue section should replace “Browse by the equipment you’re looking for.” with a clearer, buyer-oriented line: **“Explore equipment by category.”** Supporting copy may summarize the six categories and 20 audited listings as a snapshot of the current public catalogue, while reminding buyers to confirm technical fit and availability with Kiran.

Polish the overall visual feel consistently across the homepage and internal page templates: strengthen heading hierarchy, create more intentional catalogue imagery and card surfaces, refine the full-catalogue path/filter controls, and give repeated content sections a clearer rhythm. Preserve the supplied Kiran wordmark, established reference-aligned red/black/white palette and Lexend Deca/Roboto families, real first-party product imagery, verified content and existing routes/account/enquiry handoffs. Keep the work responsive, accessible, restrained, and preview-only; do not add invented product claims, substitute assets, new form behavior, or publish to production.
