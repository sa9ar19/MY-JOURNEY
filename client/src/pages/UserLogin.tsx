import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, Mail, ArrowLeft, Check, AlertTriangle } from "lucide-react";

export default function UserLogin() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const loginMutation = trpc.auth.loginWithEmail.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          // Redirect to home or previous page
          navigate("/");
          window.location.reload(); // Refresh to update auth state
        }, 1500);
      }
    },
    onError: (error) => {
      showToast(error.message || "Login failed", "error");
      setIsLoading(false);
    },
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      showToast("Please enter your email", "error");
      return;
    }

    setIsLoading(true);
    loginMutation.mutate({ email: email.trim() });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-[200] animate-in slide-in-from-right-full duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm mb-8"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>

          <div className="bg-card border border-border rounded-[2rem] shadow-2xl p-8 md:p-10">
            <div className="mb-8">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                <Mail size={32} />
              </div>
              <h1 className="text-3xl font-serif font-bold mb-2">
                Sign In
              </h1>
              <p className="text-muted-foreground">
                Enter your email to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary/10 border border-border rounded-xl px-4 py-3.5 outline-none focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold uppercase tracking-widest py-4 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing In...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Don't have an account?
              </p>
              <button
                onClick={() => navigate("/")}
                className="text-primary hover:underline font-semibold text-sm"
              >
                Sign up for updates
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/20 rounded-2xl border border-border">
            <p className="text-xs text-muted-foreground text-center">
              🔒 We'll check if your email is registered. No password needed!
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}