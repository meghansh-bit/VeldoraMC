import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Headset } from "lucide-react";

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-(--color-bg) flex flex-col isolate">
      <Header />
      <main className="flex-1 pt-16.5">
        <Outlet />
      </main>
      <Footer />
      <a className="veldora-support-float" href="https://discord.gg/NruxFSnrUe" target="_blank" rel="noreferrer" aria-label="Get VeldoraMC support on Discord"><span className="veldora-support-icon"><Headset size={20} strokeWidth={2.5} /></span><span>Support</span></a>
    </div>
  );
}