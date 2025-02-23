import mongoose from "mongoose";

const MemberSchema = new mongoose.Schema({
    name_bengali: String,
    name_english: String,
    ssc_batch: String,
    address_present: String,
    address_permanent: String,
    phone: String,
    email: { type: String, unique: true }, // Ensure email is unique
    occupation: String,
    marital_status: String,
    membership_category: String,
    image: String, // Store image as base64 or URL
});

export default mongoose.models.Member || mongoose.model("Member", MemberSchema);
