import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation } from "wouter";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Gallery",      href: "/gallery" },
  { label: "Blog",         href: "/blog" },
  { label: "About",        href: "/about" },
];

export default function DestinationDetail() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <a href="/" className="font-serif text-2xl font-semibold text-foreground hover:opacity-70 transition-opacity">
          My Journey
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                location === link.href
                  ? "text-foreground border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-sm font-medium px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Admin
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground hover:bg-secondary rounded transition-colors"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <nav className="container py-4 flex flex-col gap-3">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-2 transition-colors ${
                  location === link.href
                    ? "text-foreground border-l-2 border-primary pl-3"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium px-3 py-2 rounded bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-center"
            >
              Admin
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}