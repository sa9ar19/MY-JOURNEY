import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, Maximize2, X } from "lucide-react";

export default function Gallery() {
  // State for Lightbox
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // Fetch ALL photos from the database
  // Note: You'll need a 'listAllPhotos' route in your trpc router (see below)
  const {
    data: photos,
    isLoading,
    error,
  } = trpc.destinations.listAllPhotos.useQuery();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[95%] mx-auto w-full px-6 py-20">
        {/* Centered Header */}
        <div className="text-center mb-20">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
            Gallery
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full" />
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            A visual collection of moments, landscapes, and stories captured
            across my travels. Every photo tells a story of a place discovered.
          </p>
        </div>

        {/* Loading & Error States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-muted-foreground font-medium">
              Curating your memories...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-32">
            <p className="text-destructive text-lg">
              Failed to load gallery. Please try again later.
            </p>
          </div>
        ) : !photos || photos.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-border rounded-3xl">
            <p className="text-muted-foreground text-lg">
              No photos found in the gallery yet.
            </p>
          </div>
        ) : (
          /* Masonry Grid - True Format Display */
          // {/* Updated Masonry Grid - Larger Containers on Desktop */
          <div className="columns-1 md:columns-2 lg:columns-3 gap-2 space-y-2">
            {photos.map((photo: any) => (
              <div
                key={photo.id}
                className="break-inside-avoid group relative bg-card border border-border rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.description || "Gallery image"}
                    className="w-full h-auto block transition-transform duration-1000 group-hover:scale-110"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => setSelectedImg(photo.imageUrl)}
                      className="p-5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all transform scale-90 group-hover:scale-100 duration-300"
                    >
                      <Maximize2 size={28} />
                    </button>
                  </div>
                </div>

                {/* Description Area */}
                {photo.description && (
                  <div className="p-8 bg-card border-t border-border">
                    <p className="text-lg text-muted-foreground/90 italic leading-relaxed font-medium" />
                    {photo.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <button
            onClick={() => setSelectedImg(null)}
            className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          <img
            src={selectedImg}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
            alt="Full size view"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
