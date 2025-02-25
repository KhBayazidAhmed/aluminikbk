

/* eslint-disable */


import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";
import Member from "../../models/member";
import { IncomingForm, Files } from "formidable"; // Ensure correct typing
import fs from "fs";

export const config = {
    api: {
        bodyParser: false, // Disable automatic body parsing to handle file uploads
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    console.log("📩 Incoming request...");

    const form = new IncomingForm({ multiples: true });

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
            // Convert fields from arrays to strings (in case they are arrays)
            const data = Object.fromEntries(
                Object.entries(fields).map(([key, value]) => [key, value[0]])
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
                return res.status(400).json({ message: "Email is already registered." });
            }

            // Handle image upload (optional)
            let imagePath = "";
            if (files.image && Array.isArray(files.image)) {
                const file = files.image[0]; // Assuming it's an array (since `multiples: true`)
                try {
                    const data = await fs.promises.readFile(file.filepath);
                    imagePath = `data:${file.mimetype};base64,${data.toString("base64")}`;
                } catch (fileError) {
                    console.error("❌ Error reading image file:", fileError);
                    return res.status(500).json({ message: "Error processing image." });
                }
            }

            // Create and save the new member to the database
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
                image: imagePath, // Store image in base64 format
            });

            await newMember.save();

            console.log("✅ Member saved successfully!");
            return res.status(201).json({ message: "Member registered successfully!" });
        } catch (error:any) {
            console.error("❌ Registration error:", error);
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    });
}

