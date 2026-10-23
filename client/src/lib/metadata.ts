import { categories, company, getProductBySlug } from "@/content/siteData";

export type PageMetadata = { title: string; description: string; type: "website" | "product" };

const pageMetadata: Record<string, PageMetadata> = {
  "/": {
    title: "Kiran Automation | Robotic Solutions for Manufacturing",
    description: "Explore Kiran Automation’s publicly listed robotic solutions, manufacturing applications and equipment categories.",
    type: "website",
  },
  "/about-us": {
    title: "About Kiran Automation | Company Overview",
    description: "Read the company description and contact details currently published by Kiran Automation.",
    type: "website",
  },
  "/who-we-are": {
    title: "Who We Are | Kiran Automation",
    description: "Learn how Kiran Automation describes its industrial automation focus on its existing public website.",
    type: "website",
  },
  "/services": {
    title: "Applications & Services | Kiran Automation",
    description: "Browse manufacturing applications listed on Kiran Automation’s current website.",
    type: "website",
  },
  "/products": {
    title: "Industrial Automation Products | Kiran Automation",
    description: "Search and browse products listed in Kiran Automation’s six public catalog categories.",
    type: "website",
  },
  "/enquiry": {
    title: "Business Enquiry | Kiran Automation",
    description: "Continue to Kiran Automation’s existing enquiry workflow; this preview does not submit enquiries.",
    type: "website",
  },
  "/contact-us": {
    title: "Contact Kiran Automation | New Delhi",
    description: "View contact details currently listed by Kiran Automation and continue to the existing enquiry process.",
    type: "website",
  },
  "/career": {
    title: "Careers | Kiran Automation",
    description: "Continue to Kiran Automation’s existing careers page to review current application options.",
    type: "website",
  },
  "/404": {
    title: "Page not found | Kiran Automation",
    description: "This address is not part of the Kiran Automation preview.",
    type: "website",
  },
};

export function getPageMetadata(path: string): PageMetadata {
  const cleanPath = path.replace(/\/$/, "") || "/";
  const basic = pageMetadata[cleanPath] ?? pageMetadata["/"];
  if (cleanPath.startsWith("/products/")) {
    const slug = cleanPath.slice("/products/".length);
    const category = categories.find((item) => item.slug === slug);
    if (category) return {
      title: `${category.name} | Kiran Automation Products`,
      description: `${category.summary} Browse ${category.count} listings from the current public catalog.`,
      type: "website",
    };
  }
  if (cleanPath.startsWith("/product_details/")) {
    const slug = cleanPath.slice("/product_details/".length);
    const product = getProductBySlug(slug);
    if (product) return {
      title: `${product.name} | Kiran Automation`,
      description: `${product.name}, listed in ${product.category} on Kiran Automation’s public catalog. Confirm specifications and fit with the company.`,
      type: "product",
    };
  }
  return basic;
}

export const previewRobots = "noindex, nofollow";
export const siteName = company.name;
