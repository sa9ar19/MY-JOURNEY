import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import { ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const SLIDES = [
  "/images/slider1.jpg",
  "/images/slider2.jpg",
  "/images/slider3.jpg",
  "/images/slider4.jpg",
  "/images/slider5.jpg",
  "/images/slider6.jpg",
  "/images/slider7.jpg",
  "/images/slider8.jpg",
  "/images/slider9.jpg",
  "/images/slider10.jpg",
  "/images/slider11.jpg",
  "/images/slider12.jpg",
  "/images/slider13.jpg",
  "/images/slider14.jpg",
  "/images/slider15.jpg",
  "/images/slider16.jpg",
  "/images/slider17.jpg",
  "/images/slider18.jpg",
  "/images/slider19.jpg",
  "/images/slider20.jpg",
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const { data: stats, isLoading } = trpc.stats.get.useQuery();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
          {/* Slideshow Background */}
          <HeroSlideshow />

          {/* Dark overlay so text is readable */}
          <div className="absolute inset-0 bg-black/50 z-0" />

          <div className="container text-center relative z-10">
            <h1 className="animate-fade-up font-serif text-6xl sm:text-7xl font-semibold mb-6 text-white leading-tight">
              Welcome to Sa9ar's Journey
            </h1>
            <p className="animate-fade-up delay-100 text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed">
              Explore my travels, treks, and stories through photography and
              writing. Each destination holds a unique tale waiting to be
              discovered.
            </p>
            <div className="animate-fade-up delay-200 flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={() => navigate("/blogs")}
                  className="px-8 py-3 border border-white/50 bg-white/10 text-white font-medium rounded hover:bg-white/20 transition-colors"
                >
                  Read Stories
                </button>
                <button
                  onClick={() => navigate("/about")}
                  className="px-8 py-3 border border-white/50 bg-white/10 text-white font-medium rounded hover:bg-white/20 transition-colors"
                >
                  About Me
                </button>
              </div>
              <button
                onClick={() => navigate("/gallery")}
                className="px-8 py-3 bg-white text-black font-medium rounded hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Explore Gallery <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="divider-line my-16" />

        {/* Featured Section */}
        {/* Featured Section - Container adjusts to Image Size */}
        <section className="py-24 md:py-32 bg-background overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
              {" "}
              {/* items-center ensures text stays centered as image grows */}
              {/* Text Content Column */}
              <div className="space-y-8 py-8">
                <div>
                  <p className="text-xs font-black text-primary uppercase tracking-[0.3em] mb-4">
                    About This Journey
                  </p>
                  <h2 className="font-serif text-5xl lg:text-6xl font-bold leading-tight text-foreground tracking-tight">
                    Capturing Moments,
                    <span className="text-muted-foreground/60 italic">
                      Sharing Stories
                    </span>
                  </h2>
                </div>

                <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                  This is my personal space where I document my adventures
                  through photography and writing. From mountain peaks to hidden
                  valleys, each photo carries a story, and every blog post
                  reflects my experiences and learnings from the road.
                </p>

                <button
                  onClick={() => navigate("/about")}
                  className="group w-fit text-primary font-black uppercase tracking-widest text-sm flex items-center gap-4 hover:gap-6 transition-all duration-300"
                >
                  Learn More About Me
                  <div className="w-10 h-px bg-primary group-hover:w-16 transition-all duration-300" />
                  <ArrowRight size={20} />
                </button>
              </div>
              {/* Image Column - Container follows Image Size */}
              <div className="relative w-full">
                <div className="rounded-[3rem] overflow-hidden shadow-2xl bg-secondary/10 border border-border/50">
                  <img
                    src="/images/aboutMe.jpg"
                    alt="About Me"
                    className="w-full h-auto block transition-transform duration-1000 hover:scale-105"
                    /* h-auto block is the key: the div will now grow/shrink to fit the image exactly */
                  />
                </div>

                {/* Decorative Background Glow */}
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-8">
          <AdUnit slot="6177519437" format="autorelaxed" />
        </div>

        {/* Stats Section */}
        {/* Stats Section */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  number: isLoading ? "..." : `${stats?.destinations || 0}`,
                  label: "Destinations",
                },
                {
                  number: isLoading ? "..." : `${stats?.photos || 0}`,
                  label: "Photos",
                },
                {
                  number: isLoading ? "..." : `${stats?.stories || 0}`,
                  label: "Stories",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="font-serif text-4xl font-semibold text-foreground mb-2">
                    {stat.number}
                  </p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
