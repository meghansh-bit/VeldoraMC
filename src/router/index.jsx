import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Store from "../pages/Store";

const StoreAccount = lazy(() => import("../pages/StoreAccount"));
const Cart = lazy(() => import("../pages/Cart"));
const Bundles = lazy(() => import("../pages/Bundles"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminTickets = lazy(() => import("../pages/AdminTickets"));
const AdminNews = lazy(() => import("../pages/AdminNews"));
const AdminStore = lazy(() => import("../pages/AdminStore"));
const LinkMinecraft = lazy(() => import("../pages/LinkMinecraft"));
const PortalPage = lazy(() => import("../pages/PortalPage"));

function RouteLoader() {
  return <div role="status" aria-live="polite" style={{ minHeight: "45vh", display: "grid", placeItems: "center", color: "#d9b83e", background: "#09090d", font: "600 13px system-ui, sans-serif" }}>Loading VeldoraMC…</div>;
}

function load(element) {
  return <Suspense fallback={<RouteLoader />}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Store /> },
      { path: "store", element: <Navigate to="/" replace /> },
      { path: "store/account", element: load(<StoreAccount />) },
      { path: "bundles", element: load(<Bundles />) },
      { path: "cart", element: load(<Cart />) },
      { path: "login", element: <Navigate to="/store/account" replace /> },
      { path: "link-minecraft", element: load(<LinkMinecraft />) },
      { path: "community", element: load(<PortalPage />) },
      { path: "support", element: load(<PortalPage />) },
      { path: "news", element: <Navigate to="/" replace /> },
      { path: "news/:slug", element: <Navigate to="/" replace /> },
      { path: "votes", element: <Navigate to="/" replace /> },
      { path: "staff", element: <Navigate to="/" replace /> },
      { path: "gamemodes", element: <Navigate to="/" replace /> },
      { path: "lifesteal", element: <Navigate to="/" replace /> },
      { path: "profiles", element: <Navigate to="/" replace /> },
      { path: "leaderboard", element: <Navigate to="/" replace /> },
    ],
  },
  { path: "/admin", element: load(<AdminDashboard />) },
  { path: "/admin/tickets", element: load(<AdminTickets />) },
  { path: "/admin/news", element: load(<AdminNews />) },
  { path: "/admin/store", element: load(<AdminStore />) },
]);
