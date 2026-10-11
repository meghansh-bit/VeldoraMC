import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { CartProvider } from "./context/CartProvider";
import { AuthProvider } from "./context/AuthProvider";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("veldora-theme") === "light" ? "light" : "dark"; }
    catch { return "dark"; }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem("veldora-theme", theme); } catch {}
  }, [theme]);

  return (
    <button
      type="button"
      className="veldora-theme-toggle"
      onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ThemeToggle />
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}
