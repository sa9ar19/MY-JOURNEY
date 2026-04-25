import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import { trpc } from "@/lib/trpc";
import { Loader2, Pencil, Trash2, Check, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Destinations() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // UI States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [targetId, setTargetId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const {
    data: destinations,
    isLoading,
    error,
    refetch,
  } = trpc.destinations.list.useQuery();

  const deleteMutation = trpc.destinations.delete.useMutation({
    onSuccess: () => {
      showToast("Destination deleted successfully!");
      refetch();
      closeDeleteModal();
    },
    onError: err => {
      showToast("Error deleting: " + err.message, "error");
      setDeleting(false);
    },
  });

  function openDeleteModal(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setTargetId(id);
    setDeleteModalOpen(true);
  }

  function closeDeleteModal() {
    setDeleteModalOpen(false);
    setTargetId(null);
    setDeleting(false);
  }

  async function confirmDelete() {
    if (targetId === null) return;
    setDeleting(true);
    deleteMutation.mutate({ id: targetId });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Navbar />

      {/* Toast Notification UI */}
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

      <main className="flex-1">
        {/* Centered Heading and Description */}
        <section className="px-6 md:px-12 pt-20 pb-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
              Destinations
            </h1>
            <div className="text-muted-foreground text-base md:text-lg leading-relaxed">
              A curated collection of my journeys across the globe. From hidden
              gems to iconic landmarks, explore the stories behind every
              horizon.
            </div>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-24">
          <div className="max-w-[80%] mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2
                  className="animate-spin text-muted-foreground"
                  size={32}
                />
              </div>
            ) : error ? (
              <div className="text-center py-32">
                <p className="text-destructive mb-3 text-lg">
                  Error loading destinations
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Try again
                </button>
              </div>
            ) : !destinations || destinations.length === 0 ? (
              <div className="text-center py-32 border-2 border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground text-lg">
                  No destinations found.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map(dest => (
                  <DestCard
                    key={dest.id}
                    dest={dest}
                    isAdmin={isAdmin}
                    onNavigate={() => navigate(`/destinations/${dest.id}`)}
                    onEdit={() => navigate(`/destinations/edit/${dest.id}`)}
                    onDelete={e => openDeleteModal(e, dest.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
            <div className="flex justify-center mb-4 text-destructive">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Confirm Deletion
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure you want to delete this destination? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {deleting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

function DestCard({
  dest,
  isAdmin,
  onNavigate,
  onEdit,
  onDelete,
}: {
  dest: any;
  isAdmin: boolean;
  onNavigate: () => void;
  onEdit: () => void; // Add this
  onDelete: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 bg-black"
      onClick={onNavigate}
    >
      {/* Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {dest.coverUrl ? (
          <img
            src={dest.coverUrl}
            alt={dest.destinationName}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:blur-sm group-hover:opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-muted to-secondary" />
        )}
      </div>

      {/* Centered Name - Only on Hover */}
      <div className="absolute inset-0 flex items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
        <h3 className="font-serif text-3xl md:text-4xl font-black text-white text-center drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-widest uppercase pointer-events-none">
          {dest.destinationName}
        </h3>
      </div>

      {/* Admin Controls - Only on Hover & Only for Admin */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
          <button
            onClick={e => {
              e.stopPropagation();
              onEdit(); // Use the passed function
            }}
            className="p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white/40 transition-all"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 rounded-full bg-destructive/20 backdrop-blur-md text-destructive-foreground border border-destructive/30 hover:bg-destructive/40 transition-all"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full px-6 py-8">
        <AdUnit slot="6177519437" format="autorelaxed" />
      </div>

      <Footer />
    </div>
  );
}
