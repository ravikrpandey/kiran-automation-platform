import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import {
  applications,
  categories,
  company,
  getCategoryBySlug,
  legacyBase,
  publicAsset,
  products,
  type Category,
  type Product,
} from "@/content/siteData";
import {
  Breadcrumbs,
  CategoryCard,
  PageIntro,
  ProductCard,
  SectionLabel,
} from "@/components/SiteShell";
import { StructuredData } from "@/components/StructuredData";
import { CareerForm, EnquiryForm } from "./IntakeAdminPages";

export function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "About Kiran" }]} />
      <PageIntro eyebrow="About Kiran Automation" title="Industrial automation, grounded in the process." description={company.publicDescription} />
      <section className="section section-about-body">
        <div className="container about-grid">
          <div className="about-panel">
            <SectionLabel>What the current site says</SectionLabel>
            <h2>Robotic solutions for electronics manufacturing.</h2>
            <p>Kiran Automation’s website describes turnkey robotic solutions for electronics manufacturing and lists work across electronics production processes. This preview keeps that public positioning and avoids claiming unverified project outcomes, customer results or certifications.</p>
            <p>Applications shown in the existing public copy include PCB handling and testing, SMT-machine loading, automated screwing, robotic soldering, dispensing, part feeding, vision inspection, label pasting and end-of-line processes.</p>
            <Link to="/services" className="text-link">See listed application areas <ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
          <figure className="about-image">
            <img src={publicAsset("/assets/company/04.jpg")} alt="Kiran Automation company machine" width="723" height="823" loading="lazy" decoding="async" />
            <figcaption>Equipment image published on Kiran Automation’s current website.</figcaption>
          </figure>
        </div>
      </section>
      <section className="section section-about-facts">
        <div className="container fact-strip">
          <div><span className="fact-label">Publicly stated focus</span><strong>Robotic automation</strong><p>As described on the current company website.</p></div>
          <div><span className="fact-label">Published location</span><strong>New Delhi, India</strong><p>Address details require owner confirmation before release.</p></div>
          <div><span className="fact-label">Next step</span><strong>Confirm technical fit</strong><p>Product specifications and project scope should be discussed with Kiran.</p></div>
        </div>
      </section>
      <section className="section section-categories">
        <div className="container">
          <div className="section-heading-row"><div><SectionLabel>Explore the catalog</SectionLabel><h2>Equipment currently listed.</h2></div></div>
          <div className="category-grid">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div>
        </div>
      </section>
    </>
  );
}

export function ServicesPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Applications" }]} />
      <PageIntro eyebrow="Applications & services" title="Explore the processes listed by Kiran Automation." description="The current public website names these areas of application. The preview does not imply that a specific project, performance result or customer outcome has been independently verified." />
      <section className="section section-service-list">
        <div className="container service-list-grid">
          {applications.map((application, index) => (
            <article className="service-list-item" key={application}>
              <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
              <div><h2>{application}</h2><p>Listed as an application area on Kiran Automation’s existing public website. Discuss the part, operation and technical requirements directly with the company.</p></div>
              <Link to="/enquiry" aria-label={`Ask Kiran about ${application}`} className="service-arrow"><ArrowRight size={19} aria-hidden="true" /></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-categories service-categories">
        <div className="container"><div className="section-heading-row"><div><SectionLabel>Equipment discovery</SectionLabel><h2>Browse the product categories.</h2></div></div><div className="category-grid">{categories.map((category) => <CategoryCard key={category.slug} category={category} />)}</div></div>
      </section>
      <section className="final-cta"><div className="container final-cta-inner"><div><SectionLabel>Ask about an application</SectionLabel><h2>Make the requirement specific.</h2><p>Use the enquiry form to share the process you’re looking to automate.</p></div><Link className="button button-light" to="/enquiry">Submit an enquiry <ArrowRight size={16} aria-hidden="true" /></Link></div></section>
    </>
  );
}

function ProductGrid({ items }: { items: Product[] }) {
  if (!items.length) return <p className="empty-state">No catalog listings match that search. Try another product name or browse a category.</p>;
  return <div className="product-grid">{items.map((product) => <ProductCard key={product.slug} product={product} />)}</div>;
}

function CatalogFilters({ search, onSearch, activeCategory }: { search: string; onSearch: (value: string) => void; activeCategory?: string }) {
  return (
    <div className="catalog-tools">
      <div className="search-control"><Search size={18} aria-hidden="true" /><label className="sr-only" htmlFor="catalog-search">Search products</label><input id="catalog-search" type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search products" autoComplete="off" /></div>
      <nav className="category-pills" aria-label="Filter products by category">
        <Link to="/products" aria-current={!activeCategory ? "page" : undefined} className={!activeCategory ? "is-active" : ""}>All products</Link>
        {categories.map((category) => <Link key={category.slug} to={category.path} aria-current={activeCategory === category.slug ? "page" : undefined} className={activeCategory === category.slug ? "is-active" : ""}>{category.name}</Link>)}
      </nav>
    </div>
  );
}

export function ProductIndexPage() {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(search.trim().toLowerCase())), [search]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Products" }]} />
      <PageIntro eyebrow="Product catalogue" title="Equipment listed by Kiran Automation." description="Browse the six categories and product names visible in the existing public catalog. Confirm current technical details, configuration and availability with Kiran before making a purchasing decision." />
      <section className="section catalog-section"><div className="container"><CatalogFilters search={search} onSearch={setSearch} /><div className="catalog-results-head"><p>{filtered.length} {filtered.length === 1 ? "listing" : "listings"}</p><span>Catalog snapshot from Kiran Automation’s existing website</span></div><ProductGrid items={filtered} /></div></section>
    </>
  );
}

export function CategoryPage({ category }: { category: Category }) {
  const [search, setSearch] = useState("");
  const items = useMemo(() => products.filter((product) => product.category === category.name && product.name.toLowerCase().includes(search.trim().toLowerCase())), [category.name, search]);
  return (
    <>
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: category.name }]} />
      <PageIntro eyebrow="Product category" title={category.name} description={`${category.summary} Names and images below follow the current public listings; technical fit and availability should be confirmed with Kiran.`} />
      <section className="section catalog-section"><div className="container"><CatalogFilters search={search} onSearch={setSearch} activeCategory={category.slug} /><div className="catalog-results-head"><p>{items.length} {items.length === 1 ? "listing" : "listings"}</p><span>Listed in {category.name}</span></div><ProductGrid items={items} /></div></section>
      <section className="final-cta"><div className="container final-cta-inner"><div><SectionLabel>Confirm the details</SectionLabel><h2>Need a specific configuration?</h2><p>Ask Kiran Automation to confirm technical fit and current specifications.</p></div><Link className="button button-light" to="/enquiry">Enquiry information <ArrowRight size={16} aria-hidden="true" /></Link></div></section>
    </>
  );
}

export function ProductDetailPage({ product }: { product: Product }) {
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 2);
  const category = categories.find((item) => item.name === product.category);
  return (
    <>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        category: product.category,
        url: `${legacyBase}/product_details/${product.slug}`,
      }} />
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, ...(category ? [{ label: category.name, href: category.path }] : []), { label: product.name }]} />
      <section className="product-detail container">
        <div className="product-detail-image"><img src={product.image} alt={`Product image listed as ${product.name}`} width="553" height="553" fetchPriority="high" /></div>
        <div className="product-detail-copy">
          <SectionLabel>{product.category} · Existing catalog listing</SectionLabel>
          <h1>{product.name}</h1>
          <p className="detail-intro">This preview carries over the product name and image currently published in Kiran Automation’s catalog. It does not infer specifications, configurations, capacity, performance or compatibility.</p>
          {product.reviewNote ? <div className="review-note"><strong>Owner review needed</strong><p>{product.reviewNote}</p></div> : null}
          <div className="spec-placeholder"><span>Technical information</span><p>Confirm the intended application, technical specification and current availability with Kiran Automation.</p></div>
          <Link to={`/enquiry?productSlug=${encodeURIComponent(product.slug)}`} className="button button-orange">Ask about this listing <ArrowRight size={16} aria-hidden="true" /></Link>
          <p className="detail-back"><Link to={category?.path ?? "/products"}><ArrowLeft size={15} aria-hidden="true" /> Back to {category?.name ?? "products"}</Link></p>
        </div>
      </section>
      {related.length > 0 && <section className="section related-products"><div className="container"><div className="section-heading-row"><div><SectionLabel>Related listings</SectionLabel><h2>More in {product.category}.</h2></div><Link className="text-link" to={category?.path ?? "/products"}>View category <ArrowRight size={15} aria-hidden="true" /></Link></div><ProductGrid items={related} /></div></section>}
    </>
  );
}

export function ContactPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <PageIntro eyebrow="Contact" title="Start a conversation with Kiran Automation." description="Use the current contact details listed on Kiran Automation’s website or submit a fresh business enquiry here." />
      <section className="section contact-section">
        <div className="container contact-grid">
          <div className="contact-panel"><MapPin size={22} aria-hidden="true" /><span className="fact-label">Address listed on the existing website</span><h2>{company.address}</h2><p>{company.contactNote}</p></div>
          <div className="contact-panel"><span className="contact-icon" aria-hidden="true">@</span><span className="fact-label">Email listed on the existing website</span><h2><a href={`mailto:${company.email}`}>{company.email}</a></h2><p>Use email for direct contact. Phone destinations found on the current site require confirmation before they can safely be linked from this redesign.</p></div>
          <div className="contact-form-card"><SectionLabel>Business enquiry</SectionLabel><h2>Send a new enquiry.</h2><p>Provide the required details using the form below. Submissions are stored; email acknowledgement is not configured.</p><EnquiryForm /></div>
        </div>
      </section>
    </>
  );
}

export function EnquiryPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Enquiry" }]} />
      <PageIntro eyebrow="Business enquiry" title="Tell Kiran what the process needs to do." description={import.meta.env.VITE_STATIC_PAGES_DEMO === "true" ? "The static GitHub Pages preview cannot accept enquiries. Contact Kiran Automation directly using the published company details." : "For a useful first conversation, be ready to describe the operation, part, current process and the equipment or application you would like to discuss."} />
      <section className="section bridge-section"><div className="container bridge-container"><div className="intake-panel"><EnquiryForm /></div><p className="bridge-footnote">{import.meta.env.VITE_STATIC_PAGES_DEMO === "true" ? "No information is collected or stored by this static preview." : "Your details are stored for review. Email acknowledgement is not configured."}</p></div></section>
      <section className="section enquiry-context"><div className="container"><SectionLabel>Helpful context</SectionLabel><h2>Make the requirement specific.</h2><div className="context-grid"><article><span>01</span><h3>The operation</h3><p>Describe the task, current process and where it happens in the line.</p></article><article><span>02</span><h3>The part or product</h3><p>Identify the part being handled, tested, assembled or processed.</p></article><article><span>03</span><h3>The requirement</h3><p>Share constraints or information that may help Kiran assess the request.</p></article></div><p className="content-caveat">These are suggestions for an enquiry, not a promise of project scope or response time.</p></div></section>
    </>
  );
}

export function CareerPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Careers" }]} />
      <PageIntro eyebrow="Careers" title="Apply to Kiran Automation." description={import.meta.env.VITE_STATIC_PAGES_DEMO === "true" ? "Career applications and resume uploads are disabled on this static preview." : "Submit a fresh application with your area of experience and resume. Applications are stored for review; email acknowledgement is not configured."} />
      <section className="section bridge-section"><div className="container bridge-container"><div className="intake-panel"><CareerForm /></div></div></section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="section not-found container">
      <SectionLabel>Page not found</SectionLabel>
      <h1>This page isn’t in the preview.</h1>
      <p>The address may be outdated, or the corresponding product information may not have been included.</p>
      <Link to="/" className="button button-dark">Return to home <ArrowRight size={16} aria-hidden="true" /></Link>
      <a className="not-found-live" href={legacyBase} target="_blank" rel="noreferrer">Visit Kiran Automation’s current site <ArrowUpRight size={14} aria-hidden="true" /></a>
    </section>
  );
}
