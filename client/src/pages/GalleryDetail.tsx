import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Loader2, ChevronLeft } from "lucide-react";

export default function GalleryDetail() {
  const [location, navigate] = useLocation();
  const destId = parseInt(location.split("/").pop() || "0");
  
  const { data: destination } = trpc.destinations.getById.useQuery({ id: destId });
  const { data: photos, isLoading, error } = trpc.gallery.getByDestination.useQuery({ destinationId: destId });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <button
              onClick={() => navigate("/gallery")}
              className="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity mb-6"
            >
              <ChevronLeft size={18} /> Back to Destinations
            </button>
            <h1 className="font-serif text-5xl font-semibold mb-3 text-foreground">
              {destination?.name || "Loading..."}
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              {destination?.description || ""}
            </p>
          </div>
        </section>

        {/* Photos Grid */}
        <section className="section-padding">
          <div className="container">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-muted-foreground" size={32} />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive mb-4">Error loading photos</p>
                <button onClick={() => window.location.reload()} className="text-primary hover:opacity-70">
                  Try again
                </button>
              </div>
            ) : !photos || photos.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-4">No photos in this destination yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {photos.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="group rounded-lg overflow-hidden border border-border bg-card card-hover"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Photo placeholder */}
                    <div className="h-64 bg-gradient-to-br from-muted to-secondary flex items-center justify-center group-hover:from-muted/80 transition-colors">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Photo</p>
                      </div>
                    </div>
                    
                    {/* Photo info */}
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {photo.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {photo.description || "No description"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
