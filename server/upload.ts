import { Express } from "express";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function registerUploadRoutes(app: Express) {
  // POST /api/upload
  // Body: { data: "data:image/jpeg;base64,..." }
  // Returns: { url: "https://res.cloudinary.com/..." }
  app.post("/api/upload", async (req, res) => {
    try {
      const { data } = req.body;

      if (!data || typeof data !== "string") {
        return res.status(400).json({ error: "No image data provided" });
      }

      const result = await cloudinary.uploader.upload(data, {
        folder: "travel-blog",
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" }, // auto optimise
          { width: 2000, crop: "limit" },             // cap max width
        ],
      });

      return res.json({ url: result.secure_url });
    } catch (err: any) {
      console.error("[Cloudinary Upload Error]", err);
      return res.status(500).json({ error: err.message || "Upload failed" });
    }
  });
}