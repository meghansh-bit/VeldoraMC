// Generates public/sitemap.xml from the app's known routes.
// Plain Node (fs only, no npm packages), fully self-contained — it does
// NOT import anything from src/, so this is the only file that needs to
// exist for `npm run sitemap` to work.
import { writeFileSync, mkdirSync } from "node:fs";

// TODO: replace with your real production domain.
const SITE_URL = process.env.SITE_URL || "https://veldoramc.example";

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/profiles", changefreq: "weekly", priority: "0.7" },
  { path: "/leaderboard", changefreq: "daily", priority: "0.7" },
  { path: "/community", changefreq: "weekly", priority: "0.7" },
  { path: "/support", changefreq: "monthly", priority: "0.5" },
  { path: "/store", changefreq: "weekly", priority: "0.7" },
  { path: "/bundles", changefreq: "weekly", priority: "0.7" },
  { path: "/staff", changefreq: "monthly", priority: "0.5" },
];

// Keep this list in sync with the slugs in src/data/news.js.
const newsRoutes = [];

const urls = [...staticRoutes, ...newsRoutes];

const body = urls
  .map((route) => {
    const lastmodTag = route.lastmod
      ? `\n    <lastmod>${route.lastmod}</lastmod>`
      : "";
    return `  <url>
    <loc>${SITE_URL}${route.path}</loc>${lastmodTag}
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log(`sitemap.xml written with ${urls.length} URLs -> public/sitemap.xml`);
