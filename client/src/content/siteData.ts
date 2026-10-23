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
export const legacyEnquiryUrl = `${legacyBase}/enquiry`;
export const legacyCareerUrl = `${legacyBase}/career`;
export const legacyLoginUrl = `${legacyBase}/login`;
export const legacyRegisterUrl = `${legacyBase}/register`;
export const legacyForgotUrl = `${legacyBase}/forgot`;

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
    image: "/manus-storage/standard-mobile-workstation-5-ft-wide_ac2de42b.jpg",
    alt: "Standard mobile workstation listed in the Industrial Furniture category",
    summary: "Workstations and related equipment listed in the current public catalog.",
  },
  {
    slug: "material-handling",
    name: "Material Handling",
    path: "/products/material-handling",
    count: 3,
    image: "/manus-storage/mobile-conveyor-station_cedcb7da.jpg",
    alt: "Mobile conveyor station listed in the Material Handling category",
    summary: "Material-handling equipment listed in the current public catalog.",
  },
  {
    slug: "robotics-",
    name: "Robotics",
    path: "/products/robotics-",
    count: 3,
    image: "/manus-storage/dual-robot-workstation_749eb3a5.jpg",
    alt: "Dual robot workstation listed in the Robotics category",
    summary: "Robotics equipment listed in the current public catalog.",
  },
  {
    slug: "inspection-and-testing",
    name: "Inspection & Testing",
    path: "/products/inspection-and-testing",
    count: 3,
    image: "/manus-storage/small-electromechanical-testing-machine_0e7919f3.jpg",
    alt: "Small electromechanical testing machine listed in Inspection & Testing",
    summary: "Inspection and test equipment listed in the current public catalog.",
  },
  {
    slug: "material-processing",
    name: "Material Processing",
    path: "/products/material-processing",
    count: 3,
    image: "/manus-storage/3-axis-milling-machine-top-router-configuration_6110de56.jpg",
    alt: "Three-axis milling machine listed in the Material Processing category",
    summary: "Material-processing equipment listed in the current public catalog.",
  },
  {
    slug: "other-equipment",
    name: "Other Equipment",
    path: "/products/other-equipment",
    count: 5,
    image: "/manus-storage/large-fenced-safety-perimeter-with-wire-mesh-pan_6a7842cc.jpg",
    alt: "Fenced safety perimeter listed in the Other Equipment category",
    summary: "Additional equipment listings currently shown in the public catalog.",
  },
];

export const products: Product[] = [
  { slug: "standard-mobile-workstation---5-ft-wide", name: "Standard Mobile Workstation – 5 ft Wide", category: "Industrial Furniture", image: "/manus-storage/standard-mobile-workstation-5-ft-wide_ac2de42b.jpg" },
  { slug: "large-corner-workstation", name: "Large Corner Workstation", category: "Industrial Furniture", image: "/manus-storage/large-corner-workstation_48def420.jpg" },
  { slug: "lab-workstation---2-m-x-1.2-m", name: "Lab Workstation – 2 m × 1.2 m", category: "Industrial Furniture", image: "/manus-storage/lab-workstation-2-m-x-1-2-m_e961ce76.jpg" },
  { slug: "mobile-conveyor-station", name: "Mobile Conveyor Station", category: "Material Handling", image: "/manus-storage/mobile-conveyor-station_cedcb7da.jpg" },
  { slug: "industrial-cart-with-flow-rails", name: "Industrial Cart with Flow Rails", category: "Material Handling", image: "/manus-storage/industrial-cart-with-flow-rails_15bccd81.jpg" },
  { slug: "utility-cart-with-stainless-steel-top", name: "Utility Cart with Stainless Steel Top", category: "Material Handling", image: "/manus-storage/utility-cart-with-stainless-steel-top_96020c3b.jpg" },
  { slug: "mobile-heavy-duty-robot-stand--height-of-800mm-", name: "Mobile Heavy-Duty Robot Stand (height of 800 mm)", category: "Robotics", image: "/manus-storage/mobile-heavy-duty-robot-stand-height-of-800mm_453ac615.jpg" },
  { slug: "5.2m-medium-cobot-range-extender", name: "5.2 m Medium Cobot Range Extender", category: "Robotics", image: "/manus-storage/5-2m-medium-cobot-range-extender_c6446dd1.jpg" },
  { slug: "dual-robot-workstation", name: "Dual Robot Workstation", category: "Robotics", image: "/manus-storage/dual-robot-workstation_749eb3a5.jpg" },
  { slug: "epson-3rd-gen-lab-station-with-7th-axis---including-robot-arm", name: "EPSON 3rd Gen Lab Station with 7th Axis – Including Robot Arm", category: "Inspection & Testing", image: "/manus-storage/epson-3rd-gen-lab-station-with-7th-axis-includin_9fd387e6.jpg", reviewNote: "The public page title and image filename use different robot-brand wording. Confirm the model, supplier and configuration before publishing technical details." },
  { slug: "epson-3rd-gen-lab-station---including-robot-arm", name: "EPSON 3rd Gen Lab Station – Including Robot Arm", category: "Inspection & Testing", image: "/manus-storage/epson-3rd-gen-lab-station-including-robot-arm_d6fc9b1d.jpg", reviewNote: "The public page title and image filename use different robot-brand wording. Confirm the model, supplier and configuration before publishing technical details." },
  { slug: "small-electromechanical-testing-machine", name: "Small Electromechanical Testing Machine", category: "Inspection & Testing", image: "/manus-storage/small-electromechanical-testing-machine_0e7919f3.jpg" },
  { slug: "3-axis-milling-machine---top-router-configuration", name: "3-Axis Milling Machine – Top Router Configuration", category: "Material Processing", image: "/manus-storage/3-axis-milling-machine-top-router-configuration_6110de56.jpg" },
  { slug: "assembly-jig-table-with-lockable-angles", name: "Assembly Jig Table with Lockable Angles", category: "Material Processing", image: "/manus-storage/assembly-jig-table-with-lockable-angles_7f80c0c5.jpg" },
  { slug: "assembly-jig---tilting-table-1.5m-x-1m", name: "Assembly Jig – Tilting Table 1.5 m × 1 m", category: "Material Processing", image: "/manus-storage/assembly-jig-tilting-table-1-5m-x-1m_2621e1f8.jpg" },
  { slug: "large-fenced-safety-perimeter-with-wire-mesh-panels", name: "Large Fenced Safety Perimeter with Wire Mesh Panels", category: "Other Equipment", image: "/manus-storage/large-fenced-safety-perimeter-with-wire-mesh-pan_6a7842cc.jpg" },
  { slug: "small-fenced-safety-perimeter-with-wire-mesh-panels", name: "Small Fenced Safety Perimeter with Wire Mesh Panels", category: "Other Equipment", image: "/manus-storage/small-fenced-safety-perimeter-with-wire-mesh-pan_f80d4460.jpg" },
  { slug: "heavy-duty-compact-turntable", name: "Heavy-Duty Compact Turntable", category: "Other Equipment", image: "/manus-storage/heavy-duty-compact-turntable_86261c96.jpg", reviewNote: "A document linked from the current listing appears unrelated to this product. The preview omits downloadable documents pending owner verification." },
  { slug: "electrical-panel", name: "Electrical Panel", category: "Other Equipment", image: "/manus-storage/electrical-panel_1904bfbc.jpg", reviewNote: "The existing detail page includes residential-style copy. Confirm the intended industrial application before publishing a description." },
  { slug: "robotic-electrical-panel", name: "Robotic Electrical Panel", category: "Other Equipment", image: "/manus-storage/robotic-electrical-panel_3b30b0b7.jpg" },
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
];
