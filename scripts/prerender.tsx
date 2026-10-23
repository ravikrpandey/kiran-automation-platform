import fs from "node:fs/promises";
import path from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { createServer } from "vite";

const root = process.cwd();
const publicDirectory = path.join(root, "dist", "public");
const templatePath = path.join(publicDirectory, "index.html");
const template = await fs.readFile(templatePath, "utf8");
const vite = await createServer({
  configFile: path.join(root, "vite.config.ts"),
  server: { middlewareMode: true },
  appType: "custom",
});

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

try {
  const [{ default: App }, { previewRoutes, products }, { getPageMetadata, previewRobots, siteName }] = await Promise.all([
    vite.ssrLoadModule("/src/App.tsx"),
    vite.ssrLoadModule("/src/content/siteData.ts"),
    vite.ssrLoadModule("/src/lib/metadata.ts"),
  ]);
  const routes = [...new Set([...previewRoutes, "/404"])];

  for (const route of routes) {
    const metadata = route === "/404"
      ? { title: "Page not found | Kiran Automation", description: "This address is not part of the Kiran Automation preview." }
      : getPageMetadata(route);
    const markup = renderToString(createElement(Router, { ssrPath: route, children: createElement(App) }));
    let html = template
      .replace('<div id="root"></div>', `<div id="root">${markup}</div>`)
      .replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(metadata.title)}</title>`)
      .replace(/<meta\s+name="description"[^>]*>/i, `<meta name="description" content="${escapeHtml(metadata.description)}" />`)
      .replace(/<meta\s+name="robots"[^>]*>/i, `<meta name="robots" content="${previewRobots}" />`)
      .replace(/<meta\s+property="og:type"[^>]*>/i, `<meta property="og:type" content="${route.startsWith("/product_details/") ? "product" : "website"}" />`)
      .replace(/<meta\s+property="og:title"[^>]*>/i, `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`)
      .replace(/<meta\s+property="og:description"[^>]*>/i, `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`)
      .replace(/<meta\s+property="og:site_name"[^>]*>/i, `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`)
      .replace(/<meta\s+name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`)
      .replace(/<meta\s+name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`);

    const relative = route === "/404" ? "404.html" : route === "/" ? "index.html" : `${route.replace(/^\//, "")}/index.html`;
    const output = path.join(publicDirectory, relative);
    await fs.mkdir(path.dirname(output), { recursive: true });
    await fs.writeFile(output, html);
  }

  console.log(`Prerendered ${routes.length - 1} preview page routes and 404.html.`);
  console.log(`Catalog detail snapshots generated: ${products.length}.`);
} finally {
  await vite.close();
}
