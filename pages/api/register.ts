import type { NextApiRequest, NextApiResponse } from "next";
import mongoose from "mongoose";
import User from "../../models/User";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const registerUser = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    try {
      await connectDB();

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = new User({ username, email, password });
      await newUser.save();

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
};

export default registerUser;
