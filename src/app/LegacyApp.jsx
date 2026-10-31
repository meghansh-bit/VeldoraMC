"use client";

import dynamic from "next/dynamic";

const LegacyApplication = dynamic(() => import("../App.jsx"), {
  ssr: false,
  loading: () => (
    <main className="vld-app-loading" aria-label="Loading VeldoraMC">
      <span className="vld-loading-mark">V</span>
      <span>INITIALIZING VELDORAMC</span>
    </main>
  ),
});

export default function LegacyApp() {
  return <LegacyApplication />;
}
