import { ArrowDownRight, ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { applications, categories, featuredProducts, legacyEnquiryUrl } from "@/content/siteData";
import { CategoryCard, ProductCard, SectionLabel } from "@/components/SiteShell";

const faqs = [
  {
    question: "Can I discuss a specific manufacturing application?",
    answer: "The current Kiran Automation website lists applications including PCB handling and testing, SMT-machine loading, robotic soldering, inspection and material handling. Use the live enquiry form to describe your operation and ask the team to confirm fit.",
  },
  {
    question: "Are product specifications available in this preview?",
    answer: "No. This preview shows names and images from the public catalog but does not invent dimensions, capacities, cycle times or compatibility. Please confirm current technical information directly with Kiran Automation.",
  },
  {
    question: "How do I request a quotation?",
    answer: "Continue to the existing enquiry form on Kiran Automation’s website. This preview does not collect or submit enquiry data.",
  },
];

export default function Home() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <SectionLabel>Robotic solutions · Electronics manufacturing</SectionLabel>
            <h1>Automation built around the work your line needs to do.</h1>
            <p className="hero-lede">Kiran Automation’s existing website describes turnkey robotic solutions for electronics manufacturing. Explore the applications and equipment currently listed, then discuss your process with the team.</p>
            <div className="hero-actions">
              <Link className="button button-red" to="/enquiry">Discuss your requirement <ArrowUpRight size={16} aria-hidden="true" /></Link>
              <Link className="text-link" to="/products">Explore products <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
            <p className="hero-note">Preview based on Kiran Automation’s current public information</p>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <img src="/manus-storage/hero-workcell_fedf49f0.jpg" alt="Robotic automation equipment rendering published on Kiran Automation’s existing website" width="1600" height="770" fetchPriority="high" />
            </div>
            <div className="hero-caption"><span className="caption-dot" />Industrial automation equipment</div>
            <div className="hero-side-note" aria-hidden="true">DESIGN · INTEGRATION · AUTOMATION</div>
          </div>
        </div>
        <a className="scroll-cue" href="#applications"><span>Explore applications</span><ArrowDownRight size={17} aria-hidden="true" /></a>
      </section>

      <section className="section section-applications" id="applications">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <SectionLabel>Published application areas</SectionLabel>
              <h2>Manufacturing processes,<br className="desktop-break" /> made easier to explore.</h2>
            </div>
            <p className="section-aside">These application areas appear on the current Kiran Automation website. Project outcomes and customer references are not presented as independently verified here.</p>
          </div>
          <div className="application-list" role="list">
            {applications.map((application, index) => (
              <Link key={application} to="/services" className="application-item" role="listitem">
                <span className="application-number">{String(index + 1).padStart(2, "0")}</span>
                <span>{application}</span>
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="application-foot"><span>Explore the applications and services</span><Link to="/services" className="text-link">View all applications <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="section section-categories">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <SectionLabel>Product catalogue</SectionLabel>
              <h2>Browse by the equipment<br className="desktop-break" /> you’re looking for.</h2>
            </div>
            <Link to="/products" className="text-link">View all listed products <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => <CategoryCard key={category.slug} category={category} />)}
          </div>
          <p className="content-caveat">Categories and counts reflect listings found on Kiran Automation’s current public website; confirm current availability and details with the company.</p>
        </div>
      </section>

      <section className="section section-featured">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <SectionLabel>From the public catalogue</SectionLabel>
              <h2>A closer look at listed equipment.</h2>
            </div>
            <p className="section-aside">Names and images below are taken from the existing public product listings. Technical details are intentionally not inferred.</p>
          </div>
          <div className="product-grid product-grid-featured">
            {featuredProducts.map((product) => <ProductCard key={product.slug} product={product} />)}
          </div>
          <div className="featured-link-row"><Link to="/products" className="text-link">Browse the full catalog <ArrowRight size={15} aria-hidden="true" /></Link></div>
        </div>
      </section>

      <section className="section section-approach">
        <div className="container approach-grid">
          <div className="approach-image">
            <img src="/manus-storage/robot-cell-installation_b8c550a8.jpg" alt="Robot and control equipment photographed in an industrial setting, from Kiran Automation’s existing site" width="670" height="500" loading="lazy" decoding="async" />
            <span className="image-index">KIRAN AUTOMATION · EQUIPMENT IMAGE</span>
          </div>
          <div className="approach-copy">
            <SectionLabel>A useful place to begin</SectionLabel>
            <h2>Start with the process. Then confirm the fit.</h2>
            <p>The current site covers a range of automation applications and equipment. A productive first conversation can start with the operation, part, test or handling requirement you need to address.</p>
            <div className="approach-steps">
              <div><span>01</span><p>Describe the operation and the part involved.</p></div>
              <div><span>02</span><p>Explore the catalog and related application areas.</p></div>
              <div><span>03</span><p>Ask Kiran to confirm technical fit and specifications.</p></div>
            </div>
            <p className="content-caveat">This is a suggested enquiry path for the preview, not a verified Kiran project methodology.</p>
            <Link to="/enquiry" className="text-link">Continue to enquiry information <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <section className="section section-faq">
        <div className="container faq-grid">
          <div className="faq-heading">
            <SectionLabel>Good to know</SectionLabel>
            <h2>Before you enquire.</h2>
            <p>For current product, project and account information, continue to Kiran Automation’s existing website.</p>
            <a className="text-link" href={legacyEnquiryUrl} target="_blank" rel="noreferrer">Open current enquiry form <ArrowUpRight size={15} aria-hidden="true" /></a>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details key={faq.question} className="faq-item">
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container final-cta-inner">
          <div>
            <SectionLabel>Have an application in mind?</SectionLabel>
            <h2>Bring the process into focus.</h2>
            <p>Share an equipment requirement or manufacturing application through Kiran Automation’s existing enquiry workflow.</p>
          </div>
          <Link to="/enquiry" className="button button-light">Discuss your requirement <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </section>
    </>
  );
}
