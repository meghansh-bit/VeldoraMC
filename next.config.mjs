/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep existing Vercel VITE_* Supabase variables working during migration.
  env: {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
};

export default nextConfig;
