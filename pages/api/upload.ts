import type { NextApiRequest, NextApiResponse } from "next";
import cloudinary from "../../utils/cloudinary";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false, // Required for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Error parsing form data:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    if (!files.image || !Array.isArray(files.image) || files.image.length === 0) {
      return res.status(400).json({ message: "No image provided" });
    }

    try {
      const file = files.image[0]; // Get first file

      // ✅ Upload to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(file.filepath, {
        folder: "nextjs_uploads",
      });

      console.log("✅ Image uploaded:", uploadedImage.secure_url);

      return res.status(200).json({
        message: "Upload successful",
        imageUrl: uploadedImage.secure_url,
      });
    } catch (error) {
      console.error("❌ Cloudinary Upload Error:", error);
      return res.status(500).json({ message: "Upload failed", error: error.message });
    }
  });
}
