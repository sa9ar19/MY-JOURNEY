import { useState } from "react";
import { Menu, X, Check, Loader2, Send, Bell } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blogs" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // Signup Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Note: You'll need to add this 'newsletter.signup' route to your trpc router
  const signupMutation = trpc.newsletter?.signup?.useMutation({
    onSuccess: () => {
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setSignupOpen(false);
        setIsSuccess(false);
        setFormData({ name: "", email: "", contact: "", message: "" });
      }, 2000);
    },
  });

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (signupMutation) {
      signupMutation.mutate(formData);
    } else {
      // Fallback for demo if backend isn't ready
      setTimeout(() => {
        setIsSuccess(true);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="/"
            className="font-serif text-3xl font-bold text-foreground hover:text-primary transition-all tracking-tight"
          >
            My<span className="text-primary">Journey</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-widest transition-all hover:text-primary ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </a>
            ))}

            {user ? (
              // Show user info if logged in
              <div className="flex items-center gap-4">
                {isAdmin ? (
                  <a
                    href="/admin"
                    className="text-xs font-black uppercase tracking-widest px-5 py-2.5 rounded-full bg-primary text-white hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                  >
                    Admin Panel
                  </a>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-secondary/50 border border-border">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase() ||
                        user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold">
                      {user.name || user.email}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setSignupOpen(true)}
                className="text-xs font-black uppercase tracking-widest px-6 py-3 rounded-full bg-foreground text-background hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                Signup for Updates
              </button>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-3 text-foreground hover:bg-secondary rounded-full transition-colors"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-card animate-in slide-in-from-top duration-300">
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-6">
              {NAV_LINKS.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-lg font-bold uppercase tracking-widest ${
                    location === link.href
                      ? "text-primary pl-4 border-l-4 border-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </a>
              ))}
              {isAdmin ? (
                <a
                  href="/admin"
                  className="py-4 rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-center"
                >
                  Admin Panel
                </a>
              ) : (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setSignupOpen(true);
                  }}
                  className="py-4 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-center"
                >
                  Signup for Updates
                </button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Signup Modal */}
      {/* Signup Modal - Centered and Compact */}
      {signupOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop with blur */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSignupOpen(false)}
          />

          {/* Modal Content - Centered and Smaller */}
          <div className="relative bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-md p-8 sm:p-10 z-10 overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {isSuccess ? (
              <div className="text-center py-10">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={40} strokeWidth={3} />
                </div>
                <h2 className="text-3xl font-serif font-bold mb-2">
                  You're on the list!
                </h2>
                <p className="text-muted-foreground">
                  Thanks for joining the journey.
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setSignupOpen(false)}
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>

                <div className="mb-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                    <Bell size={24} />
                  </div>
                  <h2 className="text-2xl font-serif font-bold mb-2">
                    Stay Updated
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Get notified whenever I post a new story or gallery.
                  </p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <input
                    required
                    placeholder="Your Name"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                    value={formData.email}
                    onChange={e =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  <input
                    placeholder="Contact Number (Optional)"
                    className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all"
                    value={formData.contact}
                    onChange={e =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={2}
                    className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-all resize-none"
                    value={formData.message}
                    onChange={e =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20 mt-2"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        <Send size={16} /> Signup for updates
                      </>
                    )}
                  </button>
                </form>
                <div className="mt-6 pt-6 border-t border-border text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Already signed up?
                  </p>
                  <button
                    onClick={() => {
                      setSignupOpen(false);
                      // Use wouter's navigate
                      window.location.href = "/user/login";
                    }}
                    className="text-primary hover:underline font-semibold"
                  >
                    Login here
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
