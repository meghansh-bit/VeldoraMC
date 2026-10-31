/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Use a dedicated extension so Next does not mistake the legacy Vite
  // src/pages directory for the Next.js Pages Router.
  pageExtensions: ["next.jsx", "next.js"],
  // Keep existing Vercel VITE_* Supabase variables working during migration.
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL || "",
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY || "",
  },
};

export default nextConfig;
