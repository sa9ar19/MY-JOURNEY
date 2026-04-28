import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, ArrowRight, FileText } from "lucide-react";

export default function Blogs() {
  const [, navigate] = useLocation();

  // This line connects directly to your PostgreSQL database via tRPC
  const { data: blogs, isLoading, error } = trpc.blogs.list.useQuery();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEO 
        title="Stories & Adventures" 
        description="Deep dives into the places I've visited, the people I've met, and the lessons I've learned on the road."
        keywords="travel blog, travel stories, adventure blog, travel writing"
      />
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-20">
        {/* Header Section */}
        <div className="mb-20">
          <h1 className="font-serif text-6xl md:text-7xl font-bold mb-6 tracking-tight">
            Stories &<span className="text-primary"> Adventures</span>
          </h1>
          <div className="w-24 h-1.5 bg-primary mb-8 rounded-full" />
          <p className="text-muted-foreground text-xl max-w-2xl leading-relaxed font-medium">
            Deep dives into the places I've visited, the people I've met, and
            the lessons I've learned on the road.
          </p>
        </div>

        {/* Blog List from Database */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground font-medium">
              Fetching your stories from the database...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-32 bg-destructive/5 rounded-3xl border border-destructive/10">
            <p className="text-destructive text-lg font-semibold">
              Error connecting to database: {error.message}
            </p>
          </div>
        ) : !blogs || blogs.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-xl">
              No stories found in the database yet. Go to Admin to publish one!
            </p>
          </div>
        ) : (
          <div className="space-y-32">
            {blogs.map((blog: any) => (
              <article
                key={blog.id}
                className="group cursor-pointer"
                onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
                  {/* Blog Image (Cover URL from Cloudinary) */}
                  <div className="md:col-span-5 overflow-hidden rounded-[2.5rem] aspect-[4/5] bg-secondary/20 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                    {blog.coverUrl ? (
                      <img
                        src={blog.coverUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/20">
                        <FileText size={80} />
                      </div>
                    )}
                  </div>

                  {/* Blog Content Preview */}
                  <div className="md:col-span-7 space-y-8">
                    <div className="flex items-center gap-8 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">
                      <span className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        {blog.author || "sa9ar"}
                      </span>
                      <span className="flex items-center gap-2.5">
                        <Calendar size={14} className="text-primary" />
                        {new Date(blog.publishedAt).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric", year: "numeric" }
                        )}
                      </span>
                    </div>

                    <h2 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] group-hover:text-primary transition-colors duration-500">
                      {blog.title}
                    </h2>

                    {/* Large, Bold Description Preview */}
                    <p className="text-2xl text-muted-foreground/80 leading-relaxed line-clamp-3 font-medium italic">
                      "{blog.content}"
                    </p>

                    <div className="pt-6 flex items-center gap-4 text-primary font-black text-xl group-hover:gap-8 transition-all duration-500 uppercase tracking-widest">
                      Read Story <ArrowRight size={24} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <div className="max-w-5xl mx-auto w-full px-6 py-8">
        <AdUnit slot="6177519437" format="autorelaxed" />
      </div>


      <Footer />
    </div>
  );
}