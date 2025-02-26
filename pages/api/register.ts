import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";
import Member from "../../models/member";
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary"; // Import Cloudinary

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable automatic body parsing for file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  console.log("📩 Incoming request...");

  const form = new IncomingForm({ multiples: false }); // Assuming one image per user

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ Error parsing form data:", err);
      return res.status(500).json({ message: "Error parsing form data." });
    }

    console.log("✅ Form parsed successfully.");
    console.log("Fields:", fields);
    console.log("Files:", files);

    await dbConnect();

    try {
      // Convert fields to proper format
      const data = Object.fromEntries(
        Object.entries(fields).map(([key, value]) => [
          key,
          Array.isArray(value) ? value[0] : value,
        ])
      );

      const {
        name_bengali,
        name_english,
        ssc_batch,
        address_present,
        address_permanent,
        phone,
        email,
        occupation,
        marital_status,
        membership_category,
      } = data;

      // Validation: Check if email is provided
      if (!email) {
        return res.status(400).json({ message: "Email is required!" });
      }

      // Check if the email is already registered
      const existingMember = await Member.findOne({ email });
      if (existingMember) {
        return res
          .status(400)
          .json({ message: "Email is already registered." });
      }

      // Handle Cloudinary image upload
      let imageUrl = "";
      if (files.image) {
        const file = Array.isArray(files.image) ? files.image[0] : files.image;

        try {
          const uploadedImage = await cloudinary.uploader.upload(
            file.filepath,
            {
              folder: "nextjs_uploads",
            }
          );
          imageUrl = uploadedImage.secure_url;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (uploadError: any) {
          console.error("❌ Error uploading image:", uploadError);
          return res.status(500).json({ message: "Error uploading image." });
        }
      }

      // Create and save the new member
      const newMember = new Member({
        name_bengali,
        name_english,
        ssc_batch,
        address_present,
        address_permanent,
        phone,
        email,
        occupation,
        marital_status,
        membership_category,
        image: imageUrl, // Store Cloudinary URL instead of base64
      });

      await newMember.save();

      console.log("✅ Member saved successfully!");
      return res
        .status(201)
        .json({ message: "Member registered successfully!" });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  });
}
