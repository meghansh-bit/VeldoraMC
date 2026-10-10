import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import News from "../pages/News";
import Votes from "../pages/Votes";
import Store from "../pages/Store";
import Staff from "../pages/Staff";
import NewsDetails from "../pages/NewsDetails";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import LinkMinecraft from "../pages/LinkMinecraft";
import PortalPage from "../pages/PortalPage";
import PlayerProfiles from "../pages/PlayerProfiles";
import Bundles from "../pages/Bundles";
import AdminDashboard from "../pages/AdminDashboard";

export const router = createBrowserRouter([
 { path: "/", element: <RootLayout />, children: [
  { index: true, element: <Home /> },
  { path: "news", element: <News /> }, { path: "news/:slug", element: <NewsDetails /> },
  { path: "votes", element: <Votes /> }, { path: "store", element: <Store /> }, { path: "bundles", element: <Bundles /> },
  { path: "staff", element: <Staff /> }, { path: "cart", element: <Cart /> },
  { path: "login", element: <Login /> },
  { path: "link-minecraft", element: <LinkMinecraft /> },
  { path: "profiles", element: <PlayerProfiles /> }, { path: "leaderboard", element: <PortalPage /> },
  { path: "community", element: <PortalPage /> }, { path: "support", element: <PortalPage /> },
 ]},
 { path: "/admin", element: <AdminDashboard /> },
]);
