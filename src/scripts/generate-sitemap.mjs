import { writeFileSync, mkdirSync } from "node:fs";

const SITE_URL = (process.env.SITE_URL || "https://veldoramc.vercel.app").replace(/\/$/, "");
const LAST_MOD = new Date().toISOString().slice(0, 10);

// Only include canonical, public pages that currently exist in the router.
// Account, cart, admin, and redirect-only routes are intentionally excluded.
const publicRoutes = [
  // Keep the sitemap focused on the primary, fully public storefront.
  // Account, support, cart, admin, and placeholder routes are excluded.
  { path: "/", priority: "1.0", changefreq: "weekly" },
];

const urls = publicRoutes.map(({ path, priority, changefreq }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log("sitemap.xml written for VeldoraMC");
