import { trpc } from "@/lib/trpc";
import { Github, Linkedin, Twitter, Mail, Instagram } from "lucide-react";
import {
  FaFacebook,
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

const ICON_MAP: Record<string, React.ReactNode> = {
  email: <Mail size={18} />,
};

export default function Footer() {
  

  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="container py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
          {/* Brand */}
          <div>
            <p className="font-serif text-2xl font-semibold text-foreground mb-1">
              My Journey
            </p>
            <p className="text-sm text-muted-foreground">
              Travels, images, and life experiences
            </p>
          </div>

          {/* Social Links */}
          {/* Social Links */}
          <div className="animate-fade-up delay-300 flex items-center justify-center gap-5 mt-6">
            <a
              href="https://facebook.com/khadka.sagar01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1877F2] hover:scale-125 hover:drop-shadow-[0_0_8px_#1877F2] transform duration-200 transition-all"
            >
              <FaFacebook size={36} />
            </a>
            <a
              href="https://www.youtube.com/@sa9arKhadka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF0000] hover:scale-125 hover:drop-shadow-[0_0_8px_#FF0000] transform duration-200 transition-all"
            >
              <FaYoutube size={36} />
            </a>
            <a
              href="https://instagram.com/sa9ar_19"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E1306C] hover:scale-125 hover:drop-shadow-[0_0_8px_#E1306C] transform duration-200 transition-all"
            >
              <FaInstagram size={36} />
            </a>
            <a
              href="https://linkedin.com/in/sa9ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0A66C2] hover:scale-125 hover:drop-shadow-[0_0_8px_#0A66C2] transform duration-200 transition-all"
            >
              <FaLinkedin size={36} />
            </a>
            <a
              href="https://x.com/sa9ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:scale-125 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] transform duration-200 transition-all"
            >
              <FaXTwitter size={36} />
            </a>
          </div>
        </div>

        <div className="divider-line my-8" />

        <p className="text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} My Journey. All rights reserved sa9ar.com
        </p>
      </div>
    </footer>
  );
}
