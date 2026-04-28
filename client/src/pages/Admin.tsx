import { useState } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { trpc } from "@/lib/trpc";
import {
  Loader2,
  Plus,
  Image as ImageIcon,
  Check,
  AlertCircle,
  MapPin,
  FileText,
  Users,
  MessageSquare,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Admin() {
  const [, navigate] = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"destinations" | "blogs" | "inbox">(
    "destinations"
  );

  // --- Destination Form State ---
  const [destName, setDestName] = useState("");
  const [destDetail, setDestDetail] = useState("");
  const [destImage, setDestImage] = useState<string | null>(null);

  // --- Blog Form State ---
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogImage, setBlogImage] = useState<string | null>(null);

  // --- UI States ---
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // --- Mutations ---
  const createDestMutation = trpc.destinations.create.useMutation({
    onSuccess: () => {
      showToast("Destination created successfully!");
      setDestName("");
      setDestDetail("");
      setDestImage(null);
      setIsSubmitting(false);
    },
    onError: err => {
      showToast(err.message, "error");
      setIsSubmitting(false);
    },
  });

  const createBlogMutation = trpc.blogs?.create?.useMutation({
    onSuccess: () => {
      showToast("Blog post published!");
      setBlogTitle("");
      setBlogContent("");
      setBlogImage(null);
      setIsSubmitting(false);
    },
    onError: err => {
      showToast(err.message, "error");
      setIsSubmitting(false);
    },
  });

  if (authLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  if (!user || user.role !== "admin") {
    navigate("/");
    return null;
  }

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "dest" | "blog"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === "dest") setDestImage(reader.result as string);
      else setBlogImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    createDestMutation.mutate({
      destinationName: destName,
      destinationDetail: destDetail,
      coverImageBase64: destImage || undefined,
    });
  };

  const handleSubmitBlog = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (createBlogMutation) {
      createBlogMutation.mutate({
        title: blogTitle,
        content: blogContent,
        coverImageBase64: blogImage || undefined,
      });
    } else {
      showToast("Blog backend routes not found!", "error");
      setIsSubmitting(false);
    }
  };

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
              <AlertCircle size={20} />
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-bold mb-4">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your travel stories, destinations, and user interactions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-secondary/30 rounded-2xl mb-10 max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab("destinations")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === "destinations" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MapPin size={18} /> Destinations
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === "blogs" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <FileText size={18} /> Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all ${activeTab === "inbox" ? "bg-card shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            <MessageSquare size={18} /> Inbox & Users
          </button>
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl">
          {activeTab === "destinations" ? (
            <form onSubmit={handleSubmitDest} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">
                Create New Destination
              </h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">
                  Destination Name
                </label>
                <input
                  value={destName}
                  onChange={e => setDestName(e.target.value)}
                  required
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                  placeholder="e.g. Santorini, Greece"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">
                  Description
                </label>
                <textarea
                  value={destDetail}
                  onChange={e => setDestDetail(e.target.value)}
                  required
                  rows={5}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                  placeholder="Tell the story of this place..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">
                  Cover Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-48 bg-secondary/10 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {destImage ? (
                    <img
                      src={destImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon size={32} className="mb-2" />
                      <span>Click to upload cover photo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => handleImageUpload(e, "dest")}
                    accept="image/*"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Plus size={20} /> Create Destination
                  </>
                )}
              </button>
            </form>
          ) : activeTab === "blogs" ? (
            <form onSubmit={handleSubmitBlog} className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">Write New Blog Post</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Blog Title</label>
                <input
                  value={blogTitle}
                  onChange={e => setBlogTitle(e.target.value)}
                  required
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                  placeholder="e.g. 5 Tips for Solo Travelers"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Content</label>
                <textarea
                  value={blogContent}
                  onChange={e => setBlogContent(e.target.value)}
                  required
                  rows={10}
                  className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all"
                  placeholder="Write your heart out..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">
                  Blog Cover Image
                </label>
                <label className="flex flex-col items-center justify-center w-full h-48 bg-secondary/10 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-secondary/20 transition-all overflow-hidden relative">
                  {blogImage ? (
                    <img
                      src={blogImage}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-muted-foreground">
                      <ImageIcon size={32} className="mb-2" />
                      <span>Click to upload blog cover</span>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    onChange={e => handleImageUpload(e, "blog")}
                    accept="image/*"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Check size={20} /> Publish Blog Post
                  </>
                )}
              </button>
            </form>
          ) : (
            <InboxPanel />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InboxPanel() {
  const { data: users, isLoading: usersLoading } = trpc.admin.listUsers.useQuery();
  const { data: messages, isLoading: messagesLoading } = trpc.admin.listMessages.useQuery();

  if (usersLoading || messagesLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Users Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <Users size={24} />
          </div>
          <h2 className="text-2xl font-bold">Signed In Users</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {users?.map((u: any) => (
            <div key={u.openId} className="p-4 bg-secondary/10 border border-border rounded-2xl flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                {u.name?.[0] || u.email?.[0] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate">{u.name || "Anonymous"}</p>
                <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Last Seen</p>
                <p className="text-xs font-medium">
                  {u.lastSignedIn ? new Date(u.lastSignedIn).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          ))}
          {(!users || users.length === 0) && (
            <p className="text-muted-foreground italic col-span-full text-center py-8">No users have signed in yet.</p>
          )}
        </div>
      </section>

      <div className="h-px bg-border" />

      {/* Messages Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <MessageSquare size={24} />
          </div>
          <h2 className="text-2xl font-bold">User Messages</h2>
        </div>

        <div className="space-y-4">
          {messages?.map((m: any) => (
            <div key={m.id} className="p-6 bg-secondary/5 border border-border rounded-3xl hover:bg-secondary/10 transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail size={14} /> {m.email}
                    </span>
                    {m.contact && (
                      <span className="text-xs text-muted-foreground">
                        • {m.contact}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium bg-secondary/20 px-3 py-1 rounded-full">
                  <Calendar size={14} />
                  {new Date(m.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-card/50 p-4 rounded-2xl border border-border/50">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {m.message || <span className="italic text-muted-foreground">No message content provided.</span>}
                </p>
              </div>
            </div>
          ))}
          {(!messages || messages.length === 0) && (
            <p className="text-muted-foreground italic text-center py-8">No messages received yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}