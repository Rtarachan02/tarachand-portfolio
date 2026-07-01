import { NavLink } from "react-router-dom";
import { useThemeStore } from "@/store/themeStore";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/embedded", label: "Embedded" },
  { to: "/ai", label: "AI / ML" },
  { to: "/backend", label: "Backend" },
  { to: "/experience", label: "Experience" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="font-mono text-sm font-semibold tracking-tight">
          tarachand<span className="text-primary">.dev</span>
        </NavLink>

        <ul className="hidden gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `text-sm transition-colors hover:text-primary ${
                    isActive ? "text-primary" : "text-muted"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className="rounded-full border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-primary hover:text-primary"
        >
          {theme === "dark" ? "Light" : "Dark"}
        </button>
      </nav>
    </header>
  );
}
