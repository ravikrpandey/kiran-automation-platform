export type Category = {
  slug: string;
  name: string;
  path: string;
  count: number;
  image: string;
  alt: string;
  summary: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  image: string;
  reviewNote?: string;
};

export const legacyBase = "https://www.kiranautomation.com";

export const company = {
  name: "Kiran Automation",
  email: "info@kiranautomation.com",
  address: "WZ 405 Hari Nagar, New Delhi",
  publicDescription:
    "The existing Kiran Automation website describes the company as a Delhi-based system integrator specializing in turnkey robotic solutions for electronics manufacturing.",
  contactNote:
    "Address and email are shown as currently listed on Kiran Automation’s existing website; please confirm them before a production release.",
};

export const categories: Category[] = [
  {
    slug: "industrial-furniture",
    name: "Industrial Furniture",
    path: "/products/industrial-furniture",
    count: 3,
    image: "/assets/products/standard-mobile-workstation-5-ft-wide.jpg",
    alt: "Standard mobile workstation listed in the Industrial Furniture category",
    summary: "Workstations and related equipment listed in the current public catalog.",
  },
  {
    slug: "material-handling",
    name: "Material Handling",
    path: "/products/material-handling",
    count: 3,
    image: "/assets/products/mobile-conveyor-station.jpg",
    alt: "Mobile conveyor station listed in the Material Handling category",
    summary: "Material-handling equipment listed in the current public catalog.",
  },
  {
    slug: "robotics-",
    name: "Robotics",
    path: "/products/robotics-",
    count: 3,
    image: "/assets/products/dual-robot-workstation.jpg",
    alt: "Dual robot workstation listed in the Robotics category",
    summary: "Robotics equipment listed in the current public catalog.",
  },
  {
    slug: "inspection-and-testing",
    name: "Inspection & Testing",
    path: "/products/inspection-and-testing",
    count: 3,
    image: "/assets/products/small-electromechanical-testing-machine.jpg",
    alt: "Small electromechanical testing machine listed in Inspection & Testing",
    summary: "Inspection and test equipment listed in the current public catalog.",
  },
  {
    slug: "material-processing",
    name: "Material Processing",
    path: "/products/material-processing",
    count: 3,
    image: "/assets/products/3-axis-milling-machine-top-router-configuration.jpg",
    alt: "Three-axis milling machine listed in the Material Processing category",
    summary: "Material-processing equipment listed in the current public catalog.",
  },
  {
    slug: "other-equipment",
    name: "Other Equipment",
    path: "/products/other-equipment",
    count: 5,
    image: "/assets/products/large-fenced-safety-perimeter-with-wire-mesh-panels.jpg",
    alt: "Fenced safety perimeter listed in the Other Equipment category",
    summary: "Additional equipment listings currently shown in the public catalog.",
  },
];

export const products: Product[] = [
  { slug: "standard-mobile-workstation---5-ft-wide", name: "Standard Mobile Workstation – 5 ft Wide", category: "Industrial Furniture", image: "/assets/products/standard-mobile-workstation-5-ft-wide.jpg" },
  { slug: "large-corner-workstation", name: "Large Corner Workstation", category: "Industrial Furniture", image: "/assets/products/large-corner-workstation.jpg" },
  { slug: "lab-workstation---2-m-x-1.2-m", name: "Lab Workstation – 2 m × 1.2 m", category: "Industrial Furniture", image: "/assets/products/lab-workstation-2-m-x-1-2-m.jpg" },
  { slug: "mobile-conveyor-station", name: "Mobile Conveyor Station", category: "Material Handling", image: "/assets/products/mobile-conveyor-station.jpg" },
  { slug: "industrial-cart-with-flow-rails", name: "Industrial Cart with Flow Rails", category: "Material Handling", image: "/assets/products/industrial-cart-with-flow-rails.jpg" },
  { slug: "utility-cart-with-stainless-steel-top", name: "Utility Cart with Stainless Steel Top", category: "Material Handling", image: "/assets/products/utility-cart-with-stainless-steel-top.jpg" },
  { slug: "mobile-heavy-duty-robot-stand--height-of-800mm-", name: "Mobile Heavy-Duty Robot Stand (height of 800 mm)", category: "Robotics", image: "/assets/products/mobile-heavy-duty-robot-stand-height-of-800mm.jpg" },
  { slug: "5.2m-medium-cobot-range-extender", name: "5.2 m Medium Cobot Range Extender", category: "Robotics", image: "/assets/products/5-2m-medium-cobot-range-extender.jpg" },
  { slug: "dual-robot-workstation", name: "Dual Robot Workstation", category: "Robotics", image: "/assets/products/dual-robot-workstation.jpg" },
  { slug: "epson-3rd-gen-lab-station-with-7th-axis---including-robot-arm", name: "EPSON 3rd Gen Lab Station with 7th Axis – Including Robot Arm", category: "Inspection & Testing", image: "/assets/products/epson-3rd-gen-lab-station-with-7th-axis-including-robot-arm.jpg", reviewNote: "The public page title and image filename use different robot-brand wording. Confirm the model, supplier and configuration before publishing technical details." },
  { slug: "epson-3rd-gen-lab-station---including-robot-arm", name: "EPSON 3rd Gen Lab Station – Including Robot Arm", category: "Inspection & Testing", image: "/assets/products/epson-3rd-gen-lab-station-including-robot-arm.jpg", reviewNote: "The public page title and image filename use different robot-brand wording. Confirm the model, supplier and configuration before publishing technical details." },
  { slug: "small-electromechanical-testing-machine", name: "Small Electromechanical Testing Machine", category: "Inspection & Testing", image: "/assets/products/small-electromechanical-testing-machine.jpg" },
  { slug: "3-axis-milling-machine---top-router-configuration", name: "3-Axis Milling Machine – Top Router Configuration", category: "Material Processing", image: "/assets/products/3-axis-milling-machine-top-router-configuration.jpg" },
  { slug: "assembly-jig-table-with-lockable-angles", name: "Assembly Jig Table with Lockable Angles", category: "Material Processing", image: "/assets/products/assembly-jig-table-with-lockable-angles.jpg" },
  { slug: "assembly-jig---tilting-table-1.5m-x-1m", name: "Assembly Jig – Tilting Table 1.5 m × 1 m", category: "Material Processing", image: "/assets/products/assembly-jig-tilting-table-1-5m-x-1m.jpg" },
  { slug: "large-fenced-safety-perimeter-with-wire-mesh-panels", name: "Large Fenced Safety Perimeter with Wire Mesh Panels", category: "Other Equipment", image: "/assets/products/large-fenced-safety-perimeter-with-wire-mesh-panels.jpg" },
  { slug: "small-fenced-safety-perimeter-with-wire-mesh-panels", name: "Small Fenced Safety Perimeter with Wire Mesh Panels", category: "Other Equipment", image: "/assets/products/small-fenced-safety-perimeter-with-wire-mesh-panels.jpg" },
  { slug: "heavy-duty-compact-turntable", name: "Heavy-Duty Compact Turntable", category: "Other Equipment", image: "/assets/products/heavy-duty-compact-turntable.jpg", reviewNote: "A document linked from the current listing appears unrelated to this product. The preview omits downloadable documents pending owner verification." },
  { slug: "electrical-panel", name: "Electrical Panel", category: "Other Equipment", image: "/assets/products/electrical-panel.jpg", reviewNote: "The existing detail page includes residential-style copy. Confirm the intended industrial application before publishing a description." },
  { slug: "robotic-electrical-panel", name: "Robotic Electrical Panel", category: "Other Equipment", image: "/assets/products/robotic-electrical-panel.jpg" },
];

export const applications = [
  "PCB handling and testing",
  "SMT-machine loading",
  "Automated screwing",
  "Robotic soldering",
  "Gluing and dispensing",
  "Small-part feeding",
  "Vision inspection",
  "Label pasting",
  "Material handling",
  "End-of-line processes and palletizing",
];

export const featuredProducts = [
  products[8],
  products[3],
  products[11],
];

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export const previewRoutes = [
  "/",
  "/about-us",
  "/who-we-are",
  "/services",
  "/products",
  ...categories.map((category) => category.path),
  ...products.map((product) => `/product_details/${product.slug}`),
  "/enquiry",
  "/contact-us",
  "/career",
  "/privacy",
  "/admin/login",
  "/admin",
  "/login",
  "/register",
  "/forgot",
];
