import { useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "wouter";
import { categories, company, legacyBase, publicAsset } from "@/content/siteData";
import { StructuredData } from "./StructuredData";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="utility-bar">
        <div className="container utility-inner">
          <a href={`mailto:${company.email}`} aria-label={`Email ${company.email}`}>
            {company.email}
          </a>
          <span className="utility-account">Kiran Automation · Delhi</span>
        </div>
      </div>
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand-link" aria-label="Kiran Automation home" onClick={closeMenu}>
            <img
              className="brand-logo"
              src={publicAsset("/assets/brand/kiran-automation-logo.png")}
              alt="Kiran Automation — Wings of Innovation"
              width="1849"
              height="366"
            />
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="primary-navigation" className={`site-nav${menuOpen ? " is-open" : ""}`} aria-label="Primary navigation">
            <Link to="/services" onClick={closeMenu}>Applications</Link>
            <details className="nav-products">
              <summary>Products <ChevronDown size={14} aria-hidden="true" /></summary>
              <div className="product-menu">
                <Link to="/products" onClick={closeMenu} className="product-menu-all">Explore all products <ArrowRight size={14} aria-hidden="true" /></Link>
                {categories.map((category) => (
                  <Link key={category.slug} to={category.path} onClick={closeMenu}>{category.name}</Link>
                ))}
              </div>
            </details>
            <Link to="/about-us" onClick={closeMenu}>About</Link>
            <Link to="/contact-us" onClick={closeMenu}>Contact</Link>
            <Link to="/enquiry" className="nav-cta" onClick={closeMenu}>Discuss a project <ArrowRight size={15} aria-hidden="true" /></Link>
            <Link to="/register" onClick={closeMenu} className="mobile-account">Customer registration unavailable</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand-block">
          <Link to="/" className="footer-logo-link" aria-label="Kiran Automation home">
            <img src={publicAsset("/assets/brand/kiran-automation-logo.png")} alt="Kiran Automation — Wings of Innovation" width="1849" height="366" loading="lazy" />
          </Link>
          <p>Robotic automation and engineered equipment, as described in Kiran Automation’s current public catalog.</p>
          <a className="footer-email" href={`mailto:${company.email}`}>{company.email} <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/services">Applications</Link>
          <Link to="/products">All products</Link>
          <Link to="/about-us">About Kiran</Link>
          <Link to="/contact-us">Contact</Link>
        </div>
        <div className="footer-column footer-categories">
          <h2>Product categories</h2>
          {categories.map((category) => <Link key={category.slug} to={category.path}>{category.name}</Link>)}
        </div>
        <div className="footer-column">
          <h2>Get in touch</h2>
          <Link to="/career">Career enquiries</Link>
          <Link to="/enquiry">Business enquiries</Link>
          <Link to="/privacy">Privacy notice</Link>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>Preview content is based on listings published on Kiran Automation’s existing website and requires owner verification before release.</p>
        <span>© {new Date().getFullYear()} Kiran Automation · <Link to="/admin/login" className="staff-signin-link">Staff sign-in</Link></span>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-frame">
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="section-label"><span aria-hidden="true" />{children}</p>;
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const [pathname] = useLocation();
  const schemaItems = [
    { label: "Home", href: "/" },
    ...items.map((item, index) => ({
      label: item.label,
      href: item.href && index < items.length - 1 ? item.href : pathname,
    })),
  ];
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          {items.map((item, index) => (
            <li key={`${item.label}-${index}`} aria-current={index === items.length - 1 ? "page" : undefined}>
              {item.href && index !== items.length - 1 ? <Link to={item.href}>{item.label}</Link> : <span>{item.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <StructuredData data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: schemaItems.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.label,
          item: `${legacyBase}${item.href}`,
        })),
      }} />
    </>
  );
}

export function CategoryCard({ category }: { category: (typeof categories)[number] }) {
  return (
    <Link to={category.path} className="category-card">
      <span className="category-image-wrap"><img src={category.image} alt={category.alt} width="553" height="553" loading="lazy" decoding="async" /></span>
      <span className="category-card-copy">
        <span className="card-kicker">{String(category.count).padStart(2, "0")} listings</span>
        <span className="category-title">{category.name}</span>
        <span className="card-arrow" aria-hidden="true"><ArrowRight size={18} /></span>
      </span>
    </Link>
  );
}

export function ProductCard({ product }: { product: import("@/content/siteData").Product }) {
  return (
    <Link to={`/product_details/${product.slug}`} className="product-card">
      <span className="product-image-wrap">
        <img src={product.image} alt={`Product listing image: ${product.name}`} width="553" height="553" loading="lazy" decoding="async" />
        {product.reviewNote && <span className="review-badge">Listing to confirm</span>}
      </span>
      <span className="product-card-copy">
        <span className="card-kicker">{product.category}</span>
        <span className="product-title">{product.name}</span>
        <span className="product-action">View listing <ArrowRight size={15} aria-hidden="true" /></span>
      </span>
    </Link>
  );
}

export function PageIntro({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children?: React.ReactNode }) {
  return (
    <section className="page-intro container">
      <SectionLabel>{eyebrow}</SectionLabel>
      <h1>{title}</h1>
      <p className="page-intro-copy">{description}</p>
      {children}
    </section>
  );
}
