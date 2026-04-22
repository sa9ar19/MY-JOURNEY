import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import ShareButton  from "@/components/ShareButton"
import {
  Loader2,
  Maximize2,
  X,
  Heart,
  MessageCircle,
  Send,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<{
    url: string;
    id: number;
  } | null>(null);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const {
    data: photos,
    isLoading,
    error,
  } = trpc.destinations.listAllPhotos.useQuery();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-[95%] mx-auto w-full px-6 py-20">
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
          <div className="columns-1 md:columns-2 lg:columns-3 gap-2 space-y-2">
            {photos.map((photo: any) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onView={() =>
                  setSelectedImg({ url: photo.imageUrl, id: photo.id })
                }
                user={user}
                onLogin={() => navigate("/user/login")}
              />
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Modal with Comments */}
      {selectedImg && (
        <PhotoLightbox
          photoUrl={selectedImg.url}
          photoId={selectedImg.id}
          onClose={() => setSelectedImg(null)}
          user={user}
          onLogin={() => navigate("/user/login")}
        />
      )}

      <Footer />
    </div>
  );
}

function PhotoCard({ photo, onView, user, onLogin }: any) {
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
          className="w-full h-auto block transition-transform duration-1000 group-hover:scale-110"
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

function PhotoLightbox({ photoUrl, photoId, onClose, user, onLogin }: any) {
  const [commentText, setCommentText] = useState("");
  const utils = trpc.useUtils();

  const { data: likeInfo } = trpc.photos.getLikeInfo.useQuery({ photoId });

  const likeMutation = trpc.photos.toggleLike.useMutation({
    onSuccess: () => {
      utils.photos.getLikeInfo.invalidate({ photoId });
    },
  });

  const handleLike = () => {
    if (!user) {
      onLogin();
      return;
    }
    likeMutation.mutate({ photoId });
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 flex animate-in fade-in duration-300">
      <button
        onClick={onClose}
        className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-10"
      >
        <X size={40} />
      </button>

      <div className="flex-1 flex items-center justify-center p-4">
        <img
          src={photoUrl}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
          alt="Full size view"
        />
      </div>

      {/* Comments Sidebar */}
      <div className="w-full md:w-96 bg-background border-l border-border flex flex-col max-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                likeInfo?.hasLiked
                  ? "text-red-500"
                  : "text-muted-foreground hover:text-red-500"
              }`}
            >
              <Heart
                size={24}
                fill={likeInfo?.hasLiked ? "currentColor" : "none"}
              />
              <span className="font-bold">{likeInfo?.count || 0}</span>
            </button>
            
          </div>
        </div>

        

        {/* Comment Input */}
     
      </div>
    </div>
  );
}

// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { trpc } from "@/lib/trpc";
// import { Loader2, Maximize2, X } from "lucide-react";

// export default function Gallery() {
//   // State for Lightbox
//   const [selectedImg, setSelectedImg] = useState<string | null>(null);

//   // Fetch ALL photos from the database
//   // Note: You'll need a 'listAllPhotos' route in your trpc router (see below)
//   const {
//     data: photos,
//     isLoading,
//     error,
//   } = trpc.destinations.listAllPhotos.useQuery();

//   return (
//     <div className="min-h-screen bg-background flex flex-col">
//       <Navbar />

//       <main className="flex-1 max-w-[95%] mx-auto w-full px-6 py-20">
//         {/* Centered Header */}
//         <div className="text-center mb-20">
//           <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
//             Gallery
//           </h1>
//           <div className="w-24 h-1 bg-primary mx-auto mb-8 rounded-full" />
//           <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
//             A visual collection of moments, landscapes, and stories captured
//             across my travels. Every photo tells a story of a place discovered.
//           </p>
//         </div>

//         {/* Loading & Error States */}
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-32">
//             <Loader2 className="animate-spin text-primary mb-4" size={48} />
//             <p className="text-muted-foreground font-medium">
//               Curating your memories...
//             </p>
//           </div>
//         ) : error ? (
//           <div className="text-center py-32">
//             <p className="text-destructive text-lg">
//               Failed to load gallery. Please try again later.
//             </p>
//           </div>
//         ) : !photos || photos.length === 0 ? (
//           <div className="text-center py-32 border-2 border-dashed border-border rounded-3xl">
//             <p className="text-muted-foreground text-lg">
//               No photos found in the gallery yet.
//             </p>
//           </div>
//         ) : (
//           /* Masonry Grid - True Format Display */
//           // {/* Updated Masonry Grid - Larger Containers on Desktop */
//           <div className="columns-1 md:columns-2 lg:columns-3 gap-2 space-y-2">
//             {photos.map((photo: any) => (
//               <div
//                 key={photo.id}
//                 className="break-inside-avoid group relative bg-card border border-border rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
//               >
//                 {/* Image Container */}
//                 <div className="relative overflow-hidden">
//                   <img
//                     src={photo.imageUrl}
//                     alt={photo.description || "Gallery image"}
//                     className="w-full h-auto block transition-transform duration-1000 group-hover:scale-110"
//                   />

//                   {/* Hover Overlay */}
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                     <button
//                       onClick={() => setSelectedImg(photo.imageUrl)}
//                       className="p-5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all transform scale-90 group-hover:scale-100 duration-300"
//                     >
//                       <Maximize2 size={28} />
//                     </button>
//                   </div>
//                 </div>

//                 {/* Description Area */}
//                 {photo.description && (
//                   <div className="p-8 bg-card border-t border-border">
//                     <p className="text-lg text-muted-foreground/90 italic leading-relaxed font-medium" />
//                     {photo.description}
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Lightbox Modal */}
//       {selectedImg && (
//         <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-300">
//           <button
//             onClick={() => setSelectedImg(null)}
//             className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
//           >
//             <X size={40} />
//           </button>
//           <img
//             src={selectedImg}
//             className="max-w-full max-h-full object-contain shadow-2xl rounded-sm"
//             alt="Full size view"
//           />
//         </div>
//       )}

//       <Footer />
//     </div>
//   );
// }
