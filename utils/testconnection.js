import mongoose from 'mongoose';

async function testConnection() {
  try {
    await mongoose.connect(process.env.local.MONGODB_URI);
    console.log("Successfully connected to MongoDB!");
  } catch (err) {
    console.log("MongoDB connection failed: ", err.message);
  }
}

testConnection();
