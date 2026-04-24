import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import {
  Loader2,
  ArrowLeft,
  Save,
  Upload,
  X,
  AlertTriangle,
  Check,
} from "lucide-react";

export default function EditDestination() {
  const { id } = useParams();
  const destinationId = parseInt(id || "0");
  const [, navigate] = useLocation();
  const { user } = useAuth();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [user, navigate]);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // UI State
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Fetch destination data
  const {
    data: destination,
    isLoading,
    error,
  } = trpc.destinations.getById.useQuery({ id: destinationId });

  // Load data into form
  useEffect(() => {
    if (destination) {
      setTitle(destination.destinationName);
      setDescription(destination.destinationDetail);
      setCoverImage(destination.coverUrl);
      setPreviewUrl(destination.coverUrl);
    }
  }, [destination]);

  const updateMutation = trpc.destinations.update.useMutation({
    onSuccess: () => {
      showToast("Destination updated successfully!");
      setSaving(false);
      setTimeout(() => navigate("/destinations"), 1500);
    },
    onError: (err) => {
      showToast("Failed to update: " + err.message, "error");
      setSaving(false);
    },
  });

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image file", "error");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be less than 5MB", "error");
      return;
    }

    setNewCoverFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (!description.trim()) {
      showToast("Description is required", "error");
      return;
    }

    setSaving(true);

    try {
      // If new cover image, convert to base64
      let coverImageBase64 = undefined;
      if (newCoverFile) {
        coverImageBase64 = await fileToBase64(newCoverFile);
      }

      // Update destination
      await updateMutation.mutateAsync({
        id: destinationId,
        destinationName: title,
        destinationDetail: description,
        coverImageBase64,
      });
    } catch (err) {
      console.error("Save error:", err);
      setSaving(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-xl mb-4">Destination not found</p>
            <button
              onClick={() => navigate("/destinations")}
              className="px-6 py-2 bg-primary text-white rounded-full"
            >
              Back to Destinations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <Navbar />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-24 right-6 z-[200] animate-in slide-in-from-right-full duration-300">
          <div
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            }`}
          >
            {toast.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertTriangle size={20} />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-20">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/destinations")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm mb-6"
          >
            <ArrowLeft size={18} /> Back to Destinations
          </button>

          <h1 className="font-serif text-4xl md:text-5xl font-bold">
            Edit Destination
          </h1>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Destination Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Himalayas, Paris, Tokyo"
              className="w-full px-6 py-4 bg-secondary/20 border border-border rounded-2xl outline-none focus:border-primary transition-all text-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your journey, experiences, and highlights..."
              rows={8}
              className="w-full px-6 py-4 bg-secondary/20 border border-border rounded-2xl outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-bold mb-3">
              Cover Image *
            </label>

            {/* Image Preview */}
            {previewUrl && (
              <div className="mb-4 relative group">
                <img
                  src={previewUrl}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-2xl border border-border"
                />
                <button
                  onClick={() => {
                    setPreviewUrl(null);
                    setNewCoverFile(null);
                    setCoverImage(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={20} />
                </button>
              </div>
            )}

            {/* Upload Button */}
            <label className="flex items-center justify-center gap-3 w-full px-6 py-4 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
              <Upload size={20} />
              <span className="font-semibold">
                {previewUrl ? "Change Cover Image" : "Upload Cover Image"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Recommended: High-quality landscape image (max 5MB)
            </p>
          </div>

          {/* Save Button */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={() => navigate("/destinations")}
              className="flex-1 px-6 py-4 border border-border rounded-2xl font-bold hover:bg-secondary transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !title.trim() || !description.trim()}
              className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {saving ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </main>
<script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1718972165989515"
                crossOrigin="anonymous"
              ></script>
              <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-1718972165989515"
                data-ad-slot="5074002930"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
      <Footer />
    </div>
  );
}