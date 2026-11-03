import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Store from "../pages/Store";
import StoreAccount from "../pages/StoreAccount";
import Cart from "../pages/Cart";
import Bundles from "../pages/Bundles";
import AdminDashboard from "../pages/AdminDashboard";
import AdminTickets from "../pages/AdminTickets";
import AdminNews from "../pages/AdminNews";
import AdminStore from "../pages/AdminStore";
import LinkMinecraft from "../pages/LinkMinecraft";
import PortalPage from "../pages/PortalPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Store /> },
      // Keep the old store URL working for existing links and search results.
      { path: "store", element: <Navigate to="/" replace /> },
      { path: "store/account", element: <StoreAccount /> },
      { path: "bundles", element: <Bundles /> },
      { path: "cart", element: <Cart /> },
      { path: "login", element: <Navigate to="/store/account" replace /> },
      // Legacy community routes remain available while the storefront is being migrated.
      { path: "link-minecraft", element: <LinkMinecraft /> },
      { path: "community", element: <PortalPage /> },
      { path: "support", element: <PortalPage /> },
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
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/tickets", element: <AdminTickets /> },
  { path: "/admin/news", element: <AdminNews /> },
  { path: "/admin/store", element: <AdminStore /> },
]);