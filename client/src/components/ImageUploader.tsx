import { useRef, useState, DragEvent, ChangeEvent } from "react";
import { Loader2, ImagePlus, X } from "lucide-react";
import { useUpload } from "@/hooks/useUpload";

type Props = {
  value: string;           // current image URL
  onChange: (url: string) => void;
  label?: string;
  aspectClass?: string;    // e.g. "aspect-[4/3]" or "aspect-square"
};

/**
 * ImageUploader — drag-and-drop or click-to-upload component.
 * Uploads to /api/upload (Cloudinary) and calls onChange with the returned URL.
 */
export default function ImageUploader({
  value,
  onChange,
  label = "Image",
  aspectClass = "aspect-[4/3]",
}: Props) {
  const { upload, uploading, error } = useUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = await upload(file);
    if (url) onChange(url);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // reset so same file can be re-selected
    e.target.value = "";
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">{label}</label>
      )}

      {value ? (
        /* Preview with remove button */
        <div className={`relative rounded-lg overflow-hidden border border-border ${aspectClass}`}>
          <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`
            ${aspectClass} rounded-lg border-2 border-dashed cursor-pointer
            flex flex-col items-center justify-center gap-2
            transition-colors duration-200
            ${dragging
              ? "border-primary bg-primary/5"
              : "border-border bg-muted/30 hover:bg-muted/50"}
          `}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Uploading...</p>
            </>
          ) : (
            <>
              <ImagePlus size={24} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center px-4">
                Drag & drop or <span className="text-foreground underline underline-offset-2">click to upload</span>
              </p>
              <p className="text-xs text-muted-foreground">JPG, PNG, WebP — max 10MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
    </div>
  );
}