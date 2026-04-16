import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";

const PROJECTS = [
  {
    title: "Lumina Dashboard",
    description:
      "A real-time analytics platform for SaaS businesses, featuring interactive charts, user segmentation, and automated reporting. Built for scale with WebSocket-driven live updates.",
    tech: ["React", "Node.js", "MongoDB", "Socket.io", "Recharts"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    gradient: "from-primary/20 to-card",
  },
  {
    title: "Nexus API Gateway",
    description:
      "A high-performance API gateway with rate limiting, JWT authentication, request caching, and a developer portal for API key management.",
    tech: ["Node.js", "Express", "Redis", "PostgreSQL", "Docker"],
    github: "https://github.com",
    live: "https://example.com",
    featured: true,
    gradient: "from-gold/15 to-card",
  },
  {
    title: "Orbit CMS",
    description:
      "A headless content management system with a drag-and-drop editor, multi-language support, and a GraphQL API for flexible content delivery.",
    tech: ["Next.js", "TypeScript", "GraphQL", "PostgreSQL", "AWS S3"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    gradient: "from-primary/15 to-card",
  },
  {
    title: "Pulse Mobile",
    description:
      "A cross-platform fitness tracking app with workout planning, progress analytics, and social challenges. Integrated with wearable device APIs.",
    tech: ["React Native", "Expo", "Node.js", "MongoDB", "HealthKit"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    gradient: "from-gold/10 to-card",
  },
  {
    title: "Clarity Finance",
    description:
      "Personal finance management tool with expense categorisation, budget tracking, and AI-powered spending insights using natural language processing.",
    tech: ["React", "Python", "FastAPI", "PostgreSQL", "OpenAI"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    gradient: "from-primary/10 to-card",
  },
  {
    title: "Beacon Notifications",
    description:
      "A multi-channel notification service supporting email, SMS, push, and in-app alerts with templating, scheduling, and delivery analytics.",
    tech: ["Node.js", "TypeScript", "Redis", "AWS SES", "Twilio"],
    github: "https://github.com",
    live: "https://example.com",
    featured: false,
    gradient: "from-gold/8 to-card",
  },
];

function ProjectCard({
  project,
  index,
  visible,
}: {
  project: (typeof PROJECTS)[0];
  index: number;
  visible: boolean;
}) {
  return (
    <div
      className={`group relative flex flex-col rounded-2xl border border-border bg-card card-hover overflow-hidden transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Top gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${project.gradient.replace("to-card", "to-transparent")} from-primary/60`} />

      {/* Card header gradient */}
      <div className={`h-32 bg-gradient-to-br ${project.gradient} flex items-end p-5`}>
        {project.featured && (
          <span className="px-2.5 py-1 text-xs font-medium font-sans bg-primary/20 text-primary border border-primary/30 rounded-full">
            Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground font-sans leading-relaxed flex-1 mb-5">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map(t => (
            <span
              key={t}
              className="px-2.5 py-0.5 text-xs font-sans font-medium rounded-md bg-secondary text-secondary-foreground border border-border/50"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium font-sans text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github size={14} />
            Source Code
          </a>
          <a
            href={project.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium font-sans text-primary hover:opacity-80 transition-opacity ml-auto"
          >
            Live Demo
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="projects" className="section-padding">
      <div className="divider-line mb-20" />
      <div className="container" ref={ref}>
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary font-sans text-sm font-medium tracking-widest uppercase mb-3">
            My Work
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto font-sans">
            A selection of projects I've built — from real-time platforms to
            developer tooling and consumer applications.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} visible={visible} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="text-center mt-12">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-border bg-card text-foreground font-medium font-sans rounded-xl hover:border-primary/50 hover:bg-secondary transition-all duration-200"
          >
            <Github size={16} />
            View All on GitHub
            <ExternalLink size={14} className="text-muted-foreground" />
          </a>
        </div>
      </div>
    </section>
  );
}
