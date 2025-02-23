import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../utils/dbConnect";
import Member from "../../models/member";
import { IncomingForm } from "formidable";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false, // Disable Next.js automatic body parser
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const form = new IncomingForm({ multiples: true });

        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error parsing form data:", err);
                return res.status(500).json({ message: "Error parsing form data." });
            }

            await dbConnect();

            try {
                // Extract form fields
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
                } = fields;

                // Check if email is already registered
                const existingMember = await Member.findOne({ email });
                if (existingMember) {
                    return res.status(400).json({ message: "Email is already registered." });
                }

                // Handle image file (optional)
                let imagePath = "";
                if (files.image) {
                    const file = files.image[0];
                    const data = fs.readFileSync(file.filepath);
                    imagePath = `data:${file.mimetype};base64,${data.toString("base64")}`;
                }

                // Create a new member
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
                    image: imagePath, // Store base64 image
                });

                await newMember.save();

                return res.status(201).json({ message: "Member registered successfully!" });
            } catch (error) {
                console.error("Registration error:", error);
                return res.status(500).json({ message: "Error registering member.", error: error.message });
            }
        });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ message: "Method Not Allowed" });
    }
}
