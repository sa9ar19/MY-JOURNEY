import { useEffect, useRef, useState } from "react";

const SKILL_BARS = [
  { name: "React / Next.js",  level: 92, color: "oklch(0.72 0.14 200)" },
  { name: "Node.js / Express", level: 88, color: "oklch(0.72 0.14 200)" },
  { name: "TypeScript",        level: 85, color: "oklch(0.78 0.13 85)" },
  { name: "MongoDB / SQL",     level: 80, color: "oklch(0.78 0.13 85)" },
  { name: "AWS / Cloud",       level: 74, color: "oklch(0.72 0.14 200)" },
  { name: "UI/UX Design",      level: 70, color: "oklch(0.78 0.13 85)" },
];

const SKILL_TAGS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Express",
  "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST APIs", "tRPC",
  "Docker", "AWS", "Git", "CI/CD", "Tailwind CSS", "Figma",
  "Jest", "Vitest", "Python", "Linux",
];

function ProgressBar({ name, level, color, animate }: {
  name: string; level: number; color: string; animate: boolean;
}) {
  return (
    <div className="group">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground font-sans">{name}</span>
        <span className="text-xs font-mono text-muted-foreground">{level}%</span>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: animate ? `${level}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}99)`,
            transition: animate ? "width 1.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
          }}
        />
      </div>
    </div>
  );
}

export default function SkillsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="section-padding">
      <div className="divider-line mb-20" />
      <div className="container" ref={ref}>
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-sans text-sm font-medium tracking-widest uppercase mb-3">
            What I Know
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Skills &amp; Expertise
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            A curated set of technologies I've honed through years of building
            production-grade applications.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Progress bars */}
          <div
            className={`space-y-6 transition-all duration-700 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="font-serif text-xl font-semibold mb-6 text-foreground">
              Core Proficiencies
            </h3>
            {SKILL_BARS.map((skill, i) => (
              <div
                key={skill.name}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <ProgressBar {...skill} animate={visible} />
              </div>
            ))}
          </div>

          {/* Tag cloud */}
          <div
            className={`transition-all duration-700 delay-300 ${
              visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h3 className="font-serif text-xl font-semibold mb-6 text-foreground">
              Technologies &amp; Tools
            </h3>
            <div className="flex flex-wrap gap-2.5">
              {SKILL_TAGS.map((tag, i) => (
                <span
                  key={tag}
                  className="px-3.5 py-1.5 text-sm font-sans font-medium rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-default"
                  style={{
                    transitionDelay: visible ? `${i * 30}ms` : "0ms",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "scale(1)" : "scale(0.9)",
                    transition: `opacity 0.4s ease ${i * 30}ms, transform 0.4s ease ${i * 30}ms, border-color 0.2s, color 0.2s, background-color 0.2s`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { value: "5+",  label: "Years Exp." },
                { value: "40+", label: "Projects" },
                { value: "15+", label: "Clients" },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl border border-border bg-card"
                >
                  <p className="font-serif text-3xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-muted-foreground font-sans mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
