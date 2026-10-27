import { useEffect } from "react";
import { Route, Switch, useLocation } from "wouter";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import { SiteShell } from "./components/SiteShell";
import { StructuredData } from "./components/StructuredData";
import { ThemeProvider } from "./contexts/ThemeContext";
import { previewRobots, getPageMetadata, siteName } from "./lib/metadata";
import { company, getCategoryBySlug, getProductBySlug, legacyBase } from "./content/siteData";
import Home from "./pages/Home";
import {
  AdminDashboardPage,
  AdminLoginPage,
  ForgotCompatibilityPage,
  LoginCompatibilityPage,
  PrivacyPage,
  RegisterCompatibilityPage,
} from "./pages/IntakeAdminPages";
import {
  AboutPage,
  CareerPage,
  CategoryPage,
  ContactPage,
  EnquiryPage,
  NotFoundPage,
  ProductDetailPage,
  ProductIndexPage,
  ServicesPage,
} from "./pages/SitePages";

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

function MetadataManager() {
  const [path] = useLocation();
  useEffect(() => {
    const metadata = getPageMetadata(path);
    document.title = metadata.title;
    setMeta("name", "description", metadata.description);
    setMeta("name", "robots", metadata.robots ?? previewRobots);
    setMeta("property", "og:type", metadata.type);
    setMeta("property", "og:title", metadata.title);
    setMeta("property", "og:description", metadata.description);
    setMeta("property", "og:site_name", siteName);
    setMeta("name", "twitter:card", "summary");
    setMeta("name", "twitter:title", metadata.title);
    setMeta("name", "twitter:description", metadata.description);
  }, [path]);
  return null;
}

function PageRoutes() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about-us" component={AboutPage} />
      <Route path="/who-we-are" component={AboutPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/products" component={ProductIndexPage} />
      <Route path="/products/:slug">{({ slug }) => {
        const category = getCategoryBySlug(slug ?? "");
        return category ? <CategoryPage category={category} /> : <NotFoundPage />;
      }}</Route>
      <Route path="/product_details/:slug">{({ slug }) => {
        const product = getProductBySlug(slug ?? "");
        return product ? <ProductDetailPage product={product} /> : <NotFoundPage />;
      }}</Route>
      <Route path="/enquiry" component={EnquiryPage} />
      <Route path="/contact-us" component={ContactPage} />
      <Route path="/career" component={CareerPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboardPage} />
      <Route path="/login" component={LoginCompatibilityPage} />
      <Route path="/register" component={RegisterCompatibilityPage} />
      <Route path="/forgot" component={ForgotCompatibilityPage} />
      <Route><NotFoundPage /></Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <StructuredData data={{ "@context": "https://schema.org", "@type": "Organization", name: company.name, url: legacyBase, email: company.email }} />
          <MetadataManager />
          <SiteShell><PageRoutes /></SiteShell>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
