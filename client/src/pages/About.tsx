import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container text-center">
            <h1 className="font-serif text-5xl font-semibold mb-4 text-foreground">
              About Me
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get to know the person behind the lens and stories
            </p>
          </div>
        </section>

        {/* About Content */}
        <section className="section-padding">
          <div className="container max-w-3xl">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              {/* Image */}
              <div className="h-96 bg-gradient-to-br from-muted to-secondary rounded-lg flex items-center justify-center">
                <img
                  src="/images/profile.jpg"
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Bio */}
              <div>
                <h2 className="font-serif text-3xl font-semibold mb-4 text-foreground">
                  Hello, I'm Sagar Khadka
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm a masters in IT(Cyber Security) student at Charles Darwin
                  University, Sydney. Also a passionate traveler and
                  photographer who believes that every journey tells a story.
                  For the past several years, I've been exploring the world,
                  capturing moments, and sharing experiences through my lens.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My journey started with a simple curiosity about different
                  cultures, landscapes, and people. What began as a hobby has
                  evolved into a passion that drives me to seek new adventures,
                  challenge myself, and document the beauty of our world.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Through this website, I share not just photographs, but the
                  stories, emotions, and lessons learned from each destination.
                  I hope my experiences inspire you to explore, discover, and
                  create your own adventures.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-line my-16" />

            {/* Education & Certifications */}
            <div className="mb-16">
              <h2 className="font-serif text-3xl font-semibold mb-10 text-foreground text-center">
                Education & Certifications
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {/* Education */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                    <span className="inline-block w-6 h-0.5 bg-foreground" />
                    Education
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        degree:
                          "Masters in Information Technology (Cyber Security)",
                        institution: "Charles Darwin University, Sydney",
                        year: "2025 – Present",
                      },
                      {
                        degree: "Bachelor of Science in Computer Science",
                        institution: "Tribhuvan University, Nepal",
                        year: "2019 – 2024",
                      },
                      {
                        degree: "Higher Secondary Education",
                        institution: "Global Collegiate School, Pokhara",
                        year: "2016 – 2019",
                      },
                    ].map((edu, i) => (
                      <div key={i} className="border-l-2 border-border pl-4">
                        <p className="font-medium text-foreground">
                          {edu.degree}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {edu.institution}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {edu.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="font-serif text-xl font-semibold mb-6 text-foreground flex items-center gap-2">
                    <span className="inline-block w-6 h-0.5 bg-foreground" />
                    Certifications
                  </h3>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Travel Photography Masterclass",
                        issuer: "Udemy",
                        year: "2023",
                      },
                      {
                        title: "Wilderness First Aid",
                        issuer: "Nepal Mountaineering Association",
                        year: "2022",
                      },
                      {
                        title: "Google Digital Marketing",
                        issuer: "Google",
                        year: "2021",
                      },
                    ].map((cert, i) => (
                      <div key={i} className="border-l-2 border-border pl-4">
                        <p className="font-medium text-foreground">
                          {cert.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {cert.issuer}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cert.year}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="divider-line my-16" />
            {/* Experience */}
            <div className="mb-16">
              <h2 className="font-serif text-3xl font-semibold mb-10 text-foreground text-center">
                Experience
              </h2>
              <div className="space-y-8">
                {[
                  {
                    role: "IT Support Intern",
                    company: "TechSkills Institute",
                    period: "Feb 2026 – May 2026",
                    description:
                      "Shooting travel and landscape photography across Asia and Europe. Delivering content for travel blogs, tourism campaigns, and editorial publications.",
                  },
                  {
                    role: "Content Creater & Travel Blogger",
                    company: "Personal Brand – sa9ar.com",
                    period: "2020 – Present",
                    description:
                      "Writing long-form travel stories, guides, and photography essays. Growing an audience through storytelling and visual content across social platforms.",
                  },
                ].map((exp, i) => (
                  <div
                    key={i}
                    className="relative pl-6 border-l-2 border-border"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-foreground" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                      <p className="font-medium text-foreground">{exp.role}</p>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.company}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            
            <script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1718972165989515"
              crossOrigin="anonymous"
            ></script>
            <ins
              className="adsbygoogle"
              style={{ display: "block" }}
              data-ad-format="autorelaxed"
              data-ad-client="ca-pub-1718972165989515"
              data-ad-slot="6177519437"
            ></ins>
            <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
            
            {/* Divider */}
            <div className="divider-line my-16" />

            {/* Interests */}
            <div>
              <h2 className="font-serif text-3xl font-semibold mb-8 text-foreground text-center">
                What I Love
              </h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    title: "Trekking",
                    desc: "Exploring mountain trails and remote paths",
                    label: "Explore Destinations",
                    href: "/destinations",
                  },

                  {
                    title: "Photography",
                    desc: "Capturing the beauty of nature and culture",
                    label: "Explore Gallery",
                    href: "/gallery",
                  },
                  {
                    title: "Travelling",
                    desc: "Exploring new places and new experiences",
                    label: "Explore Destinations",
                    href: "/destinations",
                  },
                  {
                    title: "Storytelling",
                    desc: "Sharing experiences and connecting with people",
                    label: "Read Blogs",
                    href: "/blogs",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group relative p-6 border border-border bg-card rounded-lg text-center overflow-hidden cursor-pointer"
                  >
                    {/* Normal content — blurs on hover */}
                    <div className="transition-[filter] duration-300 group-hover:blur-sm">
                      <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>

                    {/* Overlay — fades in on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={item.href}
                        className="px-4 py-2 bg-foreground text-background text-sm font-medium rounded-md hover:opacity-80 transition-opacity"
                      >
                        {item.label}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
