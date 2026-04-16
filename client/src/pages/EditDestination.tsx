import { useState, useRef } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ChevronLeft, Plus, Trash2, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";

// ── Upload helper ────────────────────────────────────────────────────────────
async function uploadToCloudinary(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: reader.result }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Upload failed");
        resolve(json.url);
      } catch (err: any) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

// ── Image picker ─────────────────────────────────────────────────────────────
function ImagePicker({
  value,
  onChange,
  aspectClass = "aspect-[4/3]",
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  aspectClass?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onChange(url);
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}
      {value ? (
        <div className={`relative rounded-lg overflow-hidden border border-border ${aspectClass}`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors">
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          className={`${aspectClass} rounded-lg border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors`}
        >
          {uploading
            ? <><Loader2 size={22} className="animate-spin text-muted-foreground" /><p className="text-xs text-muted-foreground">Uploading...</p></>
            : <><ImagePlus size={22} className="text-muted-foreground" /><p className="text-sm text-muted-foreground">Click to upload</p><p className="text-xs text-muted-foreground">JPG, PNG, WebP</p></>
          }
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function EditDestination() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [location, navigate] = useLocation();
  const destId = parseInt(location.split("/").pop() || "0");

  // Destination info state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editCoverUrl, setEditCoverUrl] = useState("");
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);

  // New photo modal state
  const [addingPhoto, setAddingPhoto] = useState(false);
  const [photoTitle, setPhotoTitle] = useState("");
  const [photoDesc, setPhotoDesc] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Queries
  const { data: destinations } = trpc.destinations.list.useQuery(undefined, {
    onSuccess: (data: any[]) => {
      if (!infoLoaded) {
        const dest = data.find((d: any) => d.id === destId);
        if (dest) {
          setEditName(dest.name || "");
          setEditDesc(dest.description || "");
          setEditCoverUrl(dest.coverImageUrl || "");
          setInfoLoaded(true);
        }
      }
    },
  });

  const destination = destinations?.find((d) => d.id === destId);

  const { data: photos, isLoading: photosLoading, refetch: refetchPhotos } =
    trpc.gallery.getByDestination.useQuery({ destinationId: destId }, { enabled: !!destId });

  // Mutations — using correct router paths from routers.ts
  const updateDestMutation = trpc.admin.destinations.update.useMutation({
    onSuccess: () => toast.success("Destination updated!"),
    onError: (err: any) => toast.error(err.message),
  });

  const createPhotoMutation = trpc.admin.photos.create.useMutation({
    onSuccess: () => {
      toast.success("Photo added!");
      resetPhotoForm();
      refetchPhotos();
    },
    onError: (err: any) => toast.error(err.message),
  });

  const deletePhotoMutation = trpc.admin.photos.delete.useMutation({
    onSuccess: () => { toast.success("Photo deleted!"); refetchPhotos(); },
    onError: (err: any) => toast.error(err.message),
  });

  function resetPhotoForm() {
    setPhotoTitle("");
    setPhotoDesc("");
    setPhotoUrl("");
    setAddingPhoto(false);
  }

  async function handleSaveInfo() {
    if (!editName.trim()) { toast.error("Name is required"); return; }
    setSavingInfo(true);
    try {
      await updateDestMutation.mutateAsync({
        id: destId,
        name: editName,
        description: editDesc || undefined,
        coverImageUrl: editCoverUrl || undefined,
      });
    } finally {
      setSavingInfo(false);
    }
  }

  function handleAddPhoto() {
    if (!photoUrl) { toast.error("Please upload an image first"); return; }
    if (!photoTitle.trim()) { toast.error("Title is required"); return; }
    createPhotoMutation.mutate({
      destinationId: destId,
      title: photoTitle,
      description: photoDesc || undefined,
      imageUrl: photoUrl,
    });
  }

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" size={32} />
    </div>
  );

  if (!isAuthenticated || user?.role !== "admin") {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="section-padding bg-secondary/30">
          <div className="container">
            <button onClick={() => navigate("/admin")}
              className="flex items-center gap-2 text-primary hover:opacity-70 transition-opacity mb-6">
              <ChevronLeft size={18} /> Back to Admin
            </button>
            <h1 className="font-serif text-4xl font-semibold mb-2 text-foreground">
              {destination?.name || "Edit Destination"}
            </h1>
            <p className="text-muted-foreground">Update destination details and manage its photo gallery</p>
          </div>
        </section>

        <section className="section-padding">
          <div className="container max-w-4xl space-y-10">

            {/* ── Destination Info ── */}
            <div className="p-6 border border-border bg-card rounded-xl">
              <h2 className="font-serif text-xl font-semibold mb-5 text-foreground">Destination Info</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                    placeholder="e.g. Pokhara, Nepal"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                  <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Tell the story of this destination..." rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                </div>

                <ImagePicker label="Cover Image" value={editCoverUrl} onChange={setEditCoverUrl} aspectClass="aspect-[16/6]" />

                <button onClick={handleSaveInfo} disabled={savingInfo || updateDestMutation.isPending}
                  className="px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
                  {(savingInfo || updateDestMutation.isPending) && <Loader2 size={14} className="animate-spin" />}
                  Save Changes
                </button>
              </div>
            </div>

            {/* ── Photos ── */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl font-semibold text-foreground">Photos</h2>
                <button onClick={() => setAddingPhoto(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-foreground text-background text-sm font-medium rounded-lg hover:opacity-80 transition-opacity">
                  <Plus size={15} /> Add Photo
                </button>
              </div>

              {photosLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-muted-foreground" size={28} />
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {photos?.map((photo: any) => (
                    <div key={photo.id} className="group relative rounded-xl overflow-hidden border border-border bg-card">
                      <div className="relative h-48 bg-gradient-to-br from-muted to-secondary overflow-hidden">
                        {photo.imageUrl ? (
                          <img src={photo.imageUrl} alt={photo.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagePlus size={24} className="text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300" />
                        <button
                          onClick={() => { if (confirm("Delete this photo?")) deletePhotoMutation.mutate({ id: photo.id }); }}
                          disabled={deletePhotoMutation.isPending}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-30"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <div className="p-4">
                        <p className="font-medium text-foreground text-sm truncate">{photo.title}</p>
                        {photo.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{photo.description}</p>}
                      </div>
                    </div>
                  ))}

                  {/* Persistent add card */}
                  <button onClick={() => setAddingPhoto(true)}
                    className="rounded-xl border-2 border-dashed border-border bg-card hover:bg-secondary/40 transition-colors flex flex-col items-center justify-center gap-2 min-h-[220px] text-muted-foreground hover:text-foreground">
                    <ImagePlus size={24} />
                    <span className="text-sm font-medium">Add Photo</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── Add Photo Modal ── */}
      {addingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={resetPhotoForm} />
          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 z-10">
            <h2 className="font-serif text-2xl font-semibold text-foreground mb-5">Add Photo</h2>

            <div className="space-y-4">
              {/* File upload — comes first so user picks image before filling in details */}
              <ImagePicker label="Photo *" value={photoUrl} onChange={setPhotoUrl} aspectClass="aspect-[4/3]" />

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Title *</label>
                <input type="text" value={photoTitle} onChange={(e) => setPhotoTitle(e.target.value)}
                  placeholder="e.g. Sunset over Annapurna"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea value={photoDesc} onChange={(e) => setPhotoDesc(e.target.value)}
                  placeholder="A short description of this photo..." rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={resetPhotoForm}
                className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button onClick={handleAddPhoto}
                disabled={createPhotoMutation.isPending || !photoUrl || !photoTitle.trim()}
                className="flex-1 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-80 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {createPhotoMutation.isPending && <Loader2 size={14} className="animate-spin" />}
                Add Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}