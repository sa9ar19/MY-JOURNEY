import { Github, Linkedin, Twitter, ArrowDown } from "lucide-react";

const SOCIAL_LINKS = [
  { icon: Github,   href: "https://github.com",   label: "GitHub" },
  { icon: Linkedin, href: "https://linkedin.com",  label: "LinkedIn" },
  { icon: Twitter,  href: "https://twitter.com",   label: "Twitter" },
];

export default function HeroSection() {
  const scrollToAbout = () => {
    document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-gold/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.95 0.005 260) 1px, transparent 0)`,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="container relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="order-2 lg:order-1">
            <p className="animate-fade-up text-primary font-sans text-sm font-medium tracking-widest uppercase mb-4">
              Welcome to my portfolio
            </p>

            <h1 className="animate-fade-up delay-100 font-serif text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] mb-6">
              Hi, I'm{" "}
              <span className="text-gradient block sm:inline">Alex Morgan</span>
            </h1>

            <p className="animate-fade-up delay-200 text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              A full-stack developer passionate about crafting elegant, performant
              web experiences. I specialise in React, Node.js, and cloud
              architecture — turning complex problems into clean, intuitive
              solutions.
            </p>

            {/* Social links */}
            <div className="animate-fade-up delay-300 flex items-center gap-4 mb-10">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex items-center justify-center w-11 h-11 rounded-xl border border-border bg-card hover:border-primary/50 hover:bg-primary/10 transition-all duration-200"
                >
                  <Icon
                    size={18}
                    className="text-muted-foreground group-hover:text-primary transition-colors"
                  />
                </a>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="animate-fade-up delay-400 flex flex-wrap gap-4">
              <button
                onClick={() =>
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity glow-primary"
              >
                View My Work
              </button>
              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-6 py-3 border border-border bg-card text-foreground font-medium rounded-xl hover:border-primary/50 hover:bg-secondary transition-all duration-200"
              >
                Get In Touch
              </button>
            </div>
          </div>

          {/* Photo placeholder */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="animate-fade-in delay-200 relative">
              {/* Outer ring */}
              <div className="absolute -inset-4 rounded-full border border-primary/20 animate-float" />
              <div className="absolute -inset-8 rounded-full border border-primary/10" />

              {/* Photo frame */}
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-primary/30 glow-primary">
                {/* Placeholder gradient avatar */}
                <div className="w-full h-full bg-gradient-to-br from-primary/30 via-card to-gold/20 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mx-auto mb-3">
                      <span className="font-serif text-3xl font-bold text-primary">AM</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">Photo Placeholder</p>
                  </div>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 glass rounded-2xl px-4 py-2.5 border border-border/60">
                <p className="text-xs text-muted-foreground font-sans">Available for</p>
                <p className="text-sm font-semibold text-primary font-sans">Freelance Work</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
          <button
            onClick={scrollToAbout}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            aria-label="Scroll down"
          >
            <span className="text-xs font-sans tracking-widest uppercase">Scroll</span>
            <ArrowDown size={16} className="animate-bounce group-hover:text-primary" />
          </button>
        </div>
      </div>
    </section>
  );
}
