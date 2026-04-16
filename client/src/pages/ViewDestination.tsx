import { useState, useEffect } from "react";
import { useParams } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { Loader2, Pencil, Plus, X, Maximize2, Check, Trash2, AlertTriangle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ViewDestination() {
  const { id } = useParams();
  const destId = parseInt(id || "0");
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // UI States
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDetail, setEditDetail] = useState("");
  
  // Toast Notification State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  
  // Upload & Delete States
  const [isUploading, setIsUploading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<number | null>(null);

  // Queries & Mutations
  const { data: dest, isLoading: loadingDest, refetch: refetchDest } = trpc.destinations.getById.useQuery({ id: destId });
  const { data: photos, isLoading: loadingPhotos, refetch: refetchPhotos } = trpc.destinations.getPhotos.useQuery({ destinationId: destId });
  
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateDestMutation = trpc.destinations.update.useMutation({ 
    onSuccess: () => { refetchDest(); setIsEditingInfo(false); showToast("Destination updated!"); } 
  });

  const addPhotoMutation = trpc.destinations.addPhoto.useMutation({ 
    onSuccess: () => {
      refetchPhotos();
      setIsUploading(false);
      showToast("Image added successfully!");
    },
    onError: () => {
      setIsUploading(false);
      showToast("Failed to upload image", "error");
    }
  });

  const deletePhotoMutation = trpc.destinations.deletePhoto.useMutation({
    onSuccess: () => {
      refetchPhotos();
      setDeleteModalOpen(false);
      setPhotoToDelete(null);
      showToast("Image deleted successfully!");
    }
  });

  if (loadingDest) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (!dest) return <div className="text-center py-20">Destination not found.</div>;

  const handleSaveInfo = () => {
    updateDestMutation.mutate({ id: destId, destinationName: editName, destinationDetail: editDetail });
  };

  const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      addPhotoMutation.mutate({ destinationId: destId, imageBase64: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />
      
      {/* Toast Notification UI */}
      {toast && (
        <div className="fixed top-24 right-6 z-[200] animate-in slide-in-from-right-full duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
            toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-destructive/10 border-destructive/20 text-destructive'
          }`}>
            {toast.type === 'success' ? <Check size={20} /> : <AlertTriangle size={20} />}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Global Upload Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[110] bg-background/60 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="bg-card p-8 rounded-3xl shadow-2xl border border-border flex flex-col items-center">
            <Loader2 className="animate-spin text-primary mb-4" size={48} />
            <p className="text-lg font-medium">Uploading to the Server....</p>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          {!isEditingInfo ? (
            <>
              <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">{dest.destinationName}</h1>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed mb-4">
                {dest.destinationDetail}
              </p>
              {isAdmin && (
                <button 
                  onClick={() => { setEditName(dest.destinationName); setEditDetail(dest.destinationDetail); setIsEditingInfo(true); }}
                  className="flex items-center gap-2 mx-auto text-sm font-medium text-primary hover:opacity-70"
                >
                  <Pencil size={14} /> Edit Details
                </button>
              )}
            </>
          ) : (
            <div className="max-w-2xl mx-auto space-y-4">
              <input 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)}
                className="w-full text-4xl font-serif font-bold text-center bg-transparent border-b border-primary outline-none"
              />
              <textarea 
                value={editDetail} 
                onChange={(e) => setEditDetail(e.target.value)}
                rows={4}
                className="w-full text-center bg-transparent border border-border rounded-lg p-3 outline-none"
              />
              <div className="flex justify-center gap-3">
                <button onClick={() => setIsEditingInfo(false)} className="px-4 py-2 text-sm border rounded-lg">Cancel</button>
                <button onClick={handleSaveInfo} className="px-4 py-2 text-sm bg-primary text-white rounded-lg flex items-center gap-2">
                  <Check size={14} /> Update
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="border-t border-border pt-12">
          <h2 className="font-serif text-3xl font-bold mb-10">Images</h2>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos?.map((photo) => (
              <PhotoCard 
                key={photo.id} 
                photo={photo} 
                isAdmin={isAdmin} 
                onView={() => setSelectedImg(photo.imageUrl)}
                onDelete={() => { setPhotoToDelete(photo.id); setDeleteModalOpen(true); }}
                onUpdate={() => refetchPhotos()}
                showToast={showToast}
              />
            ))}

            {/* Add Photo Card (Admin Only) */}
            {isAdmin && (
              <label className="break-inside-avoid flex flex-col items-center justify-center aspect-square border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/30 transition-colors group">
                <input type="file" className="hidden" onChange={handleAddPhoto} accept="image/*" />
                <div className="p-4 bg-primary/10 rounded-full text-primary mb-3 group-hover:scale-110 transition-transform">
                  <Plus size={24} />
                </div>
                <span className="text-sm font-medium">Add Photo</span>
              </label>
            )}
          </div>
        </div>
      </main>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4">
          <button onClick={() => setSelectedImg(null)} className="absolute top-6 right-6 text-white hover:text-primary transition-colors">
            <X size={32} />
          </button>
          <img src={selectedImg} className="max-w-full max-h-full object-contain shadow-2xl" alt="Full size" />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteModalOpen(false)} />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
            <div className="flex justify-center mb-4 text-destructive">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">Delete Photo?</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure you want to remove this image from the gallery? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold hover:bg-secondary transition-all">Cancel</button>
              <button onClick={() => { if (photoToDelete) deletePhotoMutation.mutate({ id: photoToDelete }); }} className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold hover:opacity-90 transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function PhotoCard({ photo, isAdmin, onView, onDelete, onUpdate, showToast }: any) {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(photo.description || "");
  
  // We'll need to add an updatePhoto mutation to the backend for this to persist
  // For now, this UI allows editing. You should add the 'updatePhoto' route to your trpc router.
  const updatePhotoMutation = trpc.destinations.updatePhoto?.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      onUpdate();
      showToast("Description updated!");
    }
  });

  const handleSave = () => {
    if (updatePhotoMutation) {
      updatePhotoMutation.mutate({ id: photo.id, description: desc });
    } else {
      // Fallback if mutation isn't ready yet
      setIsEditing(false);
      showToast("Backend updatePhoto route needed!", "error");
    }
  };

  return (
    <div className="break-inside-avoid group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img src={photo.imageUrl} alt="" className="w-full h-auto block transition-transform duration-500 group-hover:scale-105" />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button onClick={onView} className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all"><Maximize2 size={20} /></button>
          {isAdmin && <button onClick={onDelete} className="p-3 bg-destructive/20 backdrop-blur-md rounded-full text-white hover:bg-destructive/60 transition-all"><Trash2 size={20} /></button>}
        </div>
      </div>
      
      <div className="p-4">
        {!isEditing ? (
          <div className="flex justify-between items-start gap-2">
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              {photo.description || "No description added."}
            </p>
            {isAdmin && (
              <button onClick={() => setIsEditing(true)} className="p-1 text-muted-foreground hover:text-primary transition-colors">
                <Pencil size={14} />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <textarea 
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
              className="w-full text-sm bg-secondary/30 border border-border rounded-lg p-2 outline-none focus:border-primary"
              placeholder="Add a story for this photo..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-xs border rounded-md">Cancel</button>
              <button onClick={handleSave} className="px-3 py-1 text-xs bg-primary text-white rounded-md flex items-center gap-1">
                <Check size={12} /> Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
