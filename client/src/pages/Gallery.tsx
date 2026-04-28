import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import ShareButton from "@/components/ShareButton";
import SEO from "@/components/SEO";
import {
  Loader2,
  Maximize2,
  X,
  Heart,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<{
    url: string;
    id: number;
    description?: string;
  } | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const {
    data: photos,
    isLoading,
    error,
  } = trpc.destinations.listAllPhotos.useQuery();

  useEffect(() => {
    if (photos && photos.length > 0) {
      if (imagesLoaded >= photos.length) {
        const timer = setTimeout(() => setAllImagesLoaded(true), 500);
        return () => clearTimeout(timer);
      }
    } else if (photos && photos.length === 0) {
      setAllImagesLoaded(true);
    }
  }, [imagesLoaded, photos]);

  const handleImageLoad = () => {
    setImagesLoaded((prev) => prev + 1);
  };

  const showLoadingScreen = isLoading || !allImagesLoaded;

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SEO 
        title="Photo Gallery" 
        description="Explore a visual collection of moments, landscapes, and stories captured across my travels."
        keywords="travel photography, landscape photos, travel gallery, adventure photography"
      />
      <Navbar />

      {/* Full Screen Loading UI */}
      {showLoadingScreen && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/80 backdrop-blur-xl transition-all duration-500">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
            <Loader2 className="animate-spin text-primary relative z-10" size={64} />
          </div>
          <h2 className="mt-8 text-2xl font-serif font-bold tracking-tight">Developing Your Memories</h2>
          <p className="mt-2 text-muted-foreground font-medium">
            {photos ? `Loading ${imagesLoaded} of ${photos.length} photos...` : "Connecting to gallery..."}
          </p>
          <div className="mt-6 w-48 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-out"
              style={{ width: photos ? `${(imagesLoaded / photos.length) * 100}%` : "10%" }}
            />
          </div>
        </div>
      )}

      <main className={`flex-1 max-w-[95%] mx-auto w-full px-6 py-20 transition-all duration-700 ${showLoadingScreen ? "blur-md scale-95 opacity-50" : "blur-0 scale-100 opacity-100"}`}>
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

        {error ? (
          <div className="text-center py-32">
            <p className="text-destructive text-lg">
              Failed to load gallery. Please try again later.
            </p>
          </div>
        ) : !photos || photos.length === 0 ? (
          !isLoading && (
            <div className="text-center py-32 border-2 border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground text-lg">
                No photos found in the gallery yet.
              </p>
            </div>
          )
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-2 space-y-2">
            {photos.map((photo: any) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onLoad={handleImageLoad}
                onView={() =>
                  setSelectedImg({ url: photo.imageUrl, id: photo.id, description: photo.description })
                }
                user={user}
                onLogin={() => navigate("/user/login")}
              />
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal */}
      {selectedImg && (
        <PhotoLightbox
          photoUrl={selectedImg.url}
          photoId={selectedImg.id}
          description={selectedImg.description}
          onClose={() => setSelectedImg(null)}
          user={user}
          onLogin={() => navigate("/user/login")}
        />
      )}

      <Footer />
    </div>
  );
}

function PhotoCard({ photo, onView, user, onLogin, onLoad }: any) {
  const utils = trpc.useUtils();
  const { data: likeInfo } = trpc.photos.getLikeInfo.useQuery({
    photoId: photo.id,
  });

  const likeMutation = trpc.photos.toggleLike.useMutation({
    onSuccess: () => {
      utils.photos.getLikeInfo.invalidate({ photoId: photo.id });
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      onLogin();
      return;
    }
    likeMutation.mutate({ photoId: photo.id });
  };

  return (
    <div className="break-inside-avoid group relative bg-card border border-border rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
      <div className="relative overflow-hidden cursor-pointer" onClick={onView}>
        <img
          src={photo.imageUrl}
          alt={photo.description || "Gallery image"}
          onLoad={onLoad}
          className="w-full h-auto block transition-transform duration-1000 group-hover:scale-110"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button className="p-5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all transform scale-90 group-hover:scale-100 duration-300">
            <Maximize2 size={28} />
          </button>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className="p-4 bg-card border-t border-border flex items-center gap-4">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 transition-colors ${
            likeInfo?.hasLiked
              ? "text-red-500"
              : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart
            size={20}
            fill={likeInfo?.hasLiked ? "currentColor" : "none"}
          />
          <span className="text-sm font-semibold">{likeInfo?.count || 0}</span>
        </button>

        <ShareButton
          url={`/gallery/${photo.id}`}
          title={photo.description || "Beautiful Travel Photo"}
          type="photo"
        />
      </div>

      {photo.description && (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground/90 italic">
            {photo.description}
          </p>
        </div>
      )}
    </div>
  );
}

function PhotoLightbox({ photoUrl, description, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[250] bg-black/95 flex animate-in fade-in duration-300 backdrop-blur-sm">
      <SEO 
        title={description || "Gallery Photo"} 
        description={description || "View this beautiful photo from my journey."}
        image={photoUrl}
      />
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10 p-2 bg-white/10 rounded-full"
      >
        <X size={32} />
      </button>

      <div className="flex-1 flex items-center justify-center p-4 md:p-12">
        <img
          src={photoUrl}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-500"
          alt={description || "Full size view"}
        />
      </div>
    </div>
  );
}