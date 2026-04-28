import { useState } from "react";
import { useParams, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import SEO from "@/components/SEO";
import { trpc } from "@/lib/trpc";
import ShareButton from "@/components/ShareButton";
import {
  Loader2,
  Calendar,
  User,
  ArrowLeft,
  Pencil,
  Check,
  X,
  Trash2,
  AlertTriangle,
  Heart,
  MessageCircle,
  Send,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function ViewBlog() {
  const { id } = useParams();
  const blogId = parseInt(id || "0");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  // --- UI States ---
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // --- Queries & Mutations ---
  const {
    data: blog,
    isLoading,
    error,
    refetch,
  } = trpc.blogs.getById.useQuery({ id: blogId });

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const updateMutation = trpc.blogs.update?.useMutation({
    onSuccess: () => {
      showToast("Blog updated successfully!");
      setIsEditing(false);
      refetch();
    },
    onError: err => showToast(err.message, "error"),
  });

  const deleteMutation = trpc.blogs.delete.useMutation({
    onSuccess: () => {
      navigate("/blogs");
    },
  });

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  if (error || !blog)
    return (
      <div className="text-center py-32">
        <p className="text-destructive text-xl">Blog post not found.</p>
      </div>
    );

  const handleSave = () => {
    if (updateMutation) {
      updateMutation.mutate({
        id: blogId,
        title: editTitle,
        content: editContent,
      });
    } else {
      showToast("Backend update route needed!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <SEO 
        title={blog.title} 
        description={blog.content.slice(0, 160)}
        image={blog.coverUrl}
        type="article"
      />
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

      <main className="flex-1">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto px-6 pt-12">
          <button
            onClick={() => navigate("/blogs")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-sm"
          >
            <ArrowLeft size={18} /> Back to Stories
          </button>
        </div>

        <article className="max-w-4xl mx-auto px-6 py-12">
          {/* Header Section */}
          <header className="mb-16 text-center">
            {!isEditing ? (
              <>
                <div className="flex items-center justify-center gap-8 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8">
                  <span className="flex items-center gap-2.5">
                    <User size={14} className="text-primary" />{" "}
                    {blog.author || "sa9ar"}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <Calendar size={14} className="text-primary" />{" "}
                    {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight mb-10 tracking-tight">
                  {blog.title}
                </h1>
                {isAdmin && (
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        setEditTitle(blog.title);
                        setEditContent(blog.content);
                        setIsEditing(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 hover:bg-secondary text-sm font-bold transition-all"
                    >
                      <Pencil size={14} /> Edit Story
                    </button>
                    <button
                      onClick={() => setDeleteModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-bold transition-all"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
                <div className="flex justify-center mt-4">
                  <ShareButton
                    url={`/blogs/${blogId}`}
                    title={blog.title}
                    description={blog.content.slice(0, 150) + "..."}
                    type="blog"
                  />
                </div>
              </>
            ) : (
              <div className="space-y-6 max-w-2xl mx-auto">
                <input
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-4xl font-serif font-bold text-center bg-transparent border-b-2 border-primary outline-none py-2"
                />
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-full border border-border font-bold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 rounded-full bg-primary text-white font-bold text-sm flex items-center gap-2"
                  >
                    <Check size={14} /> Save Changes
                  </button>
                </div>
              </div>
            )}
          </header>

          {/* Cover Image */}
          {blog.coverUrl && (
            <div className="mb-20 max-w-5xl mx-auto px-6">
              <div className="rounded-[2.5rem] overflow-hidden shadow-2xl bg-secondary/10">
                <img
                  src={blog.coverUrl}
                  alt={blog.title}
                  className="w-full h-auto block"
                />
              </div>
            </div>
          )}

          {/* Content Section */}
          <div className="max-w-2xl mx-auto">
            {!isEditing ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-xl md:text-2xl leading-[1.8] text-foreground/90 font-medium whitespace-pre-wrap first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-primary">
                  {blog.content}
                </p>
              </div>
            ) : (
              <textarea
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                rows={20}
                className="w-full text-xl leading-relaxed bg-secondary/20 border border-border rounded-3xl p-8 outline-none focus:border-primary transition-all"
              />
            )}
          </div>

          {/* Likes & Comments Section */}
          <div className="max-w-2xl mx-auto mt-16 border-t border-border pt-16">
            <BlogInteractions blogId={blogId} user={user} />
          </div>
        </article>
      </main>

      {/* Delete Confirmation Dialog */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDeleteModalOpen(false)}
          />
          <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10 text-center">
            <div className="flex justify-center mb-4 text-destructive">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">
              Delete Story?
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure you want to remove this blog post? This cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-border font-semibold hover:bg-secondary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate({ id: blogId })}
                className="flex-1 px-4 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-bold hover:opacity-90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto w-full px-6 py-8">
        <AdUnit slot="6177519437" format="autorelaxed" />
      </div>

      <Footer />
    </div>
  );
}

function BlogInteractions({ blogId, user }: { blogId: number; user: any }) {
  const [commentText, setCommentText] = useState("");
  const utils = trpc.useUtils();

  const { data: likeInfo } = trpc.blogs.getLikeInfo.useQuery({ blogId });
  const { data: comments } = trpc.blogs.getComments.useQuery({ blogId });

  const likeMutation = trpc.blogs.toggleLike.useMutation({
    onSuccess: () => utils.blogs.getLikeInfo.invalidate({ blogId }),
  });

  const commentMutation = trpc.blogs.addComment.useMutation({
    onSuccess: () => {
      setCommentText("");
      utils.blogs.getComments.invalidate({ blogId });
    },
  });

  const deleteCommentMutation = trpc.blogs.deleteComment.useMutation({
    onSuccess: () => utils.blogs.getComments.invalidate({ blogId }),
  });

  const handleLike = () => {
    if (!user) return;
    likeMutation.mutate({ blogId });
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    commentMutation.mutate({ blogId, comment: commentText });
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center justify-between">
        <button
          onClick={handleLike}
          className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all font-bold ${
            likeInfo?.hasLiked
              ? "bg-red-500/10 border-red-500/20 text-red-500"
              : "border-border hover:border-red-500/50 text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart fill={likeInfo?.hasLiked ? "currentColor" : "none"} size={24} />
          <span>{likeInfo?.count || 0} Likes</span>
        </button>

        <div className="flex items-center gap-2 text-muted-foreground font-bold">
          <MessageCircle size={24} />
          <span>{comments?.length || 0} Comments</span>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold">Comments</h3>
        
        {user ? (
          <form onSubmit={handleComment} className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full bg-secondary/10 border border-border rounded-3xl p-6 pr-16 outline-none focus:border-primary transition-all min-h-[120px]"
            />
            <button
              type="submit"
              disabled={!commentText.trim() || commentMutation.isPending}
              className="absolute bottom-6 right-6 p-3 bg-primary text-white rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all"
            >
              <Send size={20} />
            </button>
          </form>
        ) : (
          <div className="p-8 bg-secondary/10 border border-dashed border-border rounded-3xl text-center">
            <p className="text-muted-foreground font-medium">Please sign in to leave a comment.</p>
          </div>
        )}

        <div className="space-y-6">
          {comments?.map((c: any) => (
            <div key={c.id} className="group p-6 bg-secondary/5 border border-border rounded-3xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {c.userName[0]}
                  </div>
                  <div>
                    <p className="font-bold">{c.userName}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {(user?.role === "admin" || user?.openId === c.userId) && (
                  <button
                    onClick={() => deleteCommentMutation.mutate({ commentId: c.id })}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              <p className="text-muted-foreground leading-relaxed">{c.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


