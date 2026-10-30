import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import News from "../pages/News";
import Votes from "../pages/Votes";
import Store from "../pages/Store";
import Staff from "../pages/Staff";
import NewsDetails from "../pages/NewsDetails";
import Cart from "../pages/Cart";
import LinkMinecraft from "../pages/LinkMinecraft";
import PortalPage from "../pages/PortalPage";
import Bundles from "../pages/Bundles";
import AdminDashboard from "../pages/AdminDashboard";
import AdminTickets from "../pages/AdminTickets";
import AdminNews from "../pages/AdminNews";
import AdminStore from "../pages/AdminStore";
import Lifesteal from "../pages/Lifesteal";

export const router = createBrowserRouter([
 { path: "/", element: <RootLayout />, children: [
  { index: true, element: <Home /> },
  { path: "news", element: <News /> }, { path: "news/:slug", element: <NewsDetails /> },
  { path: "votes", element: <Votes /> }, { path: "store", element: <Store /> }, { path: "bundles", element: <Bundles /> },
  { path: "staff", element: <Staff /> }, { path: "cart", element: <Cart /> },
  { path: "login", element: <Navigate to="/" replace /> },
  { path: "lifesteal", element: <Lifesteal /> },
  { path: "link-minecraft", element: <LinkMinecraft /> },
  { path: "profiles", element: <Navigate to="/" replace /> },
  { path: "leaderboard", element: <PortalPage /> },
  { path: "community", element: <PortalPage /> }, { path: "support", element: <PortalPage /> },
 ]},
 { path: "/admin", element: <AdminDashboard /> },
 { path: "/admin/tickets", element: <AdminTickets /> },
 { path: "/admin/news", element: <AdminNews /> },
 { path: "/admin/store", element: <AdminStore /> },
]);
