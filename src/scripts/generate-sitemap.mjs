import { writeFileSync, mkdirSync } from "node:fs";

const SITE_URL = process.env.SITE_URL || "https://veldoramc.vercel.app";
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  '  <url>\n    <loc>' + SITE_URL + '/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n' +
  '</urlset>\n';
mkdirSync("public", { recursive: true });
writeFileSync("public/sitemap.xml", xml, "utf-8");
console.log("sitemap.xml written for VeldoraMC");
