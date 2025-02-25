import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGO_URI environment variable");
}

let cached = global.mongoose || { conn: null, promise: null };

const dbConnect = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("MongoDB connected successfully!");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
};

export default dbConnect;
