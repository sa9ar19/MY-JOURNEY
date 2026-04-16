import { useState } from "react";

type UploadState = {
  uploading: boolean;
  error: string | null;
};

/**
 * useUpload — converts a File to base64 and POSTs it to /api/upload.
 * Returns the Cloudinary URL on success.
 *
 * Usage:
 *   const { upload, uploading, error } = useUpload();
 *   const url = await upload(file);
 */
export function useUpload() {
  const [state, setState] = useState<UploadState>({ uploading: false, error: null });

  async function upload(file: File): Promise<string | null> {
    setState({ uploading: true, error: null });
    try {
      // Convert file → base64 data URL
      const base64 = await fileToBase64(file);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ data: base64 }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Upload failed");
      }

      setState({ uploading: false, error: null });
      return json.url as string;
    } catch (err: any) {
      setState({ uploading: false, error: err.message || "Upload failed" });
      return null;
    }
  }

  return { upload, uploading: state.uploading, error: state.error };
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}