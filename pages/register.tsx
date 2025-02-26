
"use client"; // Ensure this directive is at the top

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import cloudinary from "../utils/cloudinary";

const Form = () => {
    const [membershipCategory, setMembershipCategory] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        name_bengali: "",
        name_english: "",
        ssc_batch: "",
        address_present: "",
        address_permanent: "",
        phone: "",
        email: "",
        occupation: "",
        marital_status: "",
        membership_category: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImage = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleMembershipChange = (value) => {
        setMembershipCategory(value);
        setFormData((prev) => ({ ...prev, membership_category: value }));
    };

    const fee = membershipCategory === "Life Member" ? 1000 :
                membershipCategory === "Executive Member" ? 500 :
                membershipCategory === "General Member" ? 200 : 0;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        const { name_bengali, name_english, phone, email, membership_category } = formData;
        if (!name_bengali || !name_english || !phone || !email || !membership_category) {
            setError("Please fill in all required fields.");
            setLoading(false);
            return;
        }

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        if (image) formDataToSend.append("image", image);

        try {
            const { data } = await axios.post("/api/register", formDataToSend, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setMessage(data.message);
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred while submitting the form.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center my-2">
                <h1 className="inline-block mx-auto text-2xl text-[#FF7F00] border-dotted border-b-4">
                    Register as a New Member
                </h1>
            </div>
            <div className="w-full">
                <div>
                    {preview && (
                        <Image className="border-amber-300 mb-2 border-2 mx-auto w-60 h-60 rounded-full" src={preview} alt="Uploaded Preview" width={240} height={240} priority />
                    )}
                    <input className="border-2 text-amber-300 p-2 bg-[#163D66]" accept="image/*" type="file" onChange={handleImage} />
                </div>
                {[
                    { label: "Name (বাংলা)", name: "name_bengali", type: "text" },
                    { label: "Name (English)", name: "name_english", type: "text" },
                    { label: "SSC Batch", name: "ssc_batch", type: "text" },
                    { label: "Address (Present)", name: "address_present", type: "text" },
                    { label: "Address (Permanent)", name: "address_permanent", type: "text" },
                    { label: "Phone", name: "phone", type: "tel" },
                    { label: "E-mail", name: "email", type: "email" },
                    { label: "Occupation (পেশা)", name: "occupation", type: "text" },
                ].map(({ label, name, type }, index) => (
                    <div key={index} className="text-xl block m-1">
                        {label}:
                        <input type={type} name={name} value={formData[name]} onChange={handleChange} className="border-2 border-amber-400 rounded-2xl p-2 w-full" />
                    </div>
                ))}
                <div className="text-xl block m-1">
                    Marital Status:
                    {['Married', 'Unmarried'].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                            <input type="radio" name="marital_status" value={status.toLowerCase()} onChange={handleChange} checked={formData.marital_status === status.toLowerCase()} className="accent-blue-500" />
                            <span>{status}</span>
                        </label>
                    ))}
                </div>
                <div className="flex flex-col space-y-2">
                    <span className="text-xl">Category of Membership:</span>
                    {["Life Member", "Executive Member", "General Member"].map((value) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input type="radio" name="membership_category" value={value} checked={membershipCategory === value} onChange={() => handleMembershipChange(value)} className="accent-blue-500" />
                            <span>{value}</span>
                        </label>
                    ))}
                </div>
                <div className="bg-emerald-600 p-2 mt-2 text-white">
                    <p className="capitalize">Registration Fee: {fee} Tk</p>
                </div>
                <div className="my-4">
                    <button type="submit" className="w-20 h-10 bg-orange-500 text-white rounded" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className="text-green-500">{message}</p>}
            </div>
        </form>
    );
};

export default Form;













































// "use client"; // Ensure this directive is at the top

// import React, { useState } from "react";
// import Image from "next/image";
// import axios from "axios";

// const Form = () => {
//     const [membershipCategory, setMembershipCategory] = useState<string>("");
//     const [image, setImage] = useState<File | null>(null);
//     const [preview, setPreview] = useState<string | null>(null);
//     const [formData, setFormData] = useState({
//         name_bengali: "",
//         name_english: "",
//         ssc_batch: "",
//         address_present: "",
//         address_permanent: "",
//         phone: "",
//         email: "",
//         occupation: "",
//         marital_status: "",
//         membership_category: "",
//     });
//     const [error, setError] = useState<string>("");
//     const [message, setMessage] = useState<string>("");

//     // Handle text input changes
//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Handle file input change
//     const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (file) {
//             setImage(file);
//             const reader = new FileReader();
//             reader.onload = () => {
//                 setPreview(reader.result as string);
//             };
//             reader.readAsDataURL(file);
//         }
//     };

//     // Handle membership category selection
//     const handleMembershipChange = (value: string) => {
//         setMembershipCategory(value);
//         setFormData((prev) => ({
//             ...prev,
//             membership_category: value,
//         }));
//     };

//     // Calculate Registration Fee
//     const fee = membershipCategory === "Life Member" ? 1000
//         : membershipCategory === "Executive Member" ? 500
//         : membershipCategory === "General Member" ? 200
//         : 0;

//     // Handle form submission
  
// const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const { name_bengali, name_english, phone, email, membership_category } = formData;

//     // Form validation
//     if (!name_bengali || !name_english || !phone || !email || !membership_category) {
//         setError("Please fill in all the required fields.");
//         return;
//     }

//     // Prepare FormData for submission
//     const formDataToSend = new FormData();
//     Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined) {
//             formDataToSend.append(key, String(value)); // Ensure all values are strings
//         }
//     });

//     if (image instanceof File) {
//         formDataToSend.append("image", image);
//     }

//     try {
//         const { data } = await axios.post("/api/register", formDataToSend, {
//             headers: {
//                 "Content-Type": "multipart/form-data", // Important for FormData
//             },
//         });

//         setMessage(data.message);
//         setError("");
//     } catch (error) {
//         console.error("Axios error:", error);

//         if (axios.isAxiosError(error) && error.response) {
//             setError(error.response.data?.message || "An error occurred while submitting the form.");
//         } else {
//             setError("An unexpected error occurred. Please try again.");
//         }
//     }
// };
    

// const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;
  
//     const formData = new FormData();
//     formData.append("image", file);
  
//     const res = await fetch("/api/upload", {
//       method: "POST",
//       body: formData,
//     });
  
//     const data = await res.json();
//     console.log("Uploaded Image URL:", data.imageUrl);
//   };

  

//     return (
//         <form onSubmit={handleSubmit} className="w-full">
//             {/* Heading */}
//             <div className="flex items-center my-2">
//                 <h1 className="inline-block mx-auto text-2xl text-[#FF7F00] border-dotted border-b-4">
//                     Register as a New Member
//                 </h1>
//             </div>

//             {/* Form */}
//             <div className="w-full">
//                 {/* Image Input */}
//                 <div>
//                     {preview && (
//                         <Image
//                             className="border-amber-300 mb-2 border-2 mx-auto w-60 h-60 rounded-full"
//                             src={preview}
//                             alt="Uploaded Preview"
//                             width={240}
//                             height={240}
//                             priority
//                         />
//                     )}
//                     <input
//                         className="border-2 text-amber-300 p-2 bg-[#163D66]"
//                         accept="image/*"
//                         type="file"
//                         onChange={handleImage}
//                     />
//                 </div>

//                 {/* Text Inputs */}
//                 <div>
//                     {[
//                         { label: "Name (বাংলা)", name: "name_bengali", type: "text" },
//                         { label: "Name (English)", name: "name_english", type: "text" },
//                         { label: "SSC Batch", name: "ssc_batch", type: "text" },
//                         { label: "Address (Present)", name: "address_present", type: "text" },
//                         { label: "Address (Permanent)", name: "address_permanent", type: "text" },
//                         { label: "Phone", name: "phone", type: "tel", placeholder: "Enter your phone number" },
//                         { label: "E-mail", name: "email", type: "email", placeholder: "Enter your email" },
//                         { label: "Occupation (পেশা)", name: "occupation", type: "text", placeholder: "Enter your occupation" },
//                     ].map(({ label, name, type, placeholder }, index) => (
//                         <div key={index} className="text-xl block m-1">
//                             {label}:
//                             <input
//                                 type={type}
//                                 name={name}
//                                 value={formData[name]}
//                                 placeholder={placeholder || ""}
//                                 onChange={handleChange}
//                                 className="uppercase border-2 focus-visible:outline-hidden border-amber-400 rounded-2xl p-2 w-full"
//                             />
//                         </div>
//                     ))}
//                 </div>

//                 {/* Marital Status */}
//                 <div className="text-xl block m-1">
//                     Marital Status:
//                     {["Married", "Unmarried"].map((status) => (
//                         <label key={status} className="flex items-center space-x-2">
//                             <input
//                                 type="radio"
//                                 name="marital_status"
//                                 value={status.toLowerCase()}
//                                 onChange={handleChange}
//                                 checked={formData.marital_status === status.toLowerCase()}
//                                 className="accent-blue-500"
//                             />
//                             <span>{status}</span>
//                         </label>
//                     ))}
//                 </div>

//                 {/* Membership Category */}
//                 <div className="flex flex-col space-y-2">
//                     <span className="text-xl">Category of Membership:</span>
//                     {[
//                         { label: "Life Member (জীবন সদস্য)", value: "Life Member" },
//                         { label: "Executive Member (কার্যকরী সদস্য)", value: "Executive Member" },
//                         { label: "General Member (সাধারণ সদস্য)", value: "General Member" },
//                     ].map(({ label, value }) => (
//                         <label key={value} className="flex items-center space-x-2">
//                             <input
//                                 type="radio"
//                                 name="membership_category"
//                                 value={value}
//                                 checked={membershipCategory === value}
//                                 onChange={() => handleMembershipChange(value)}
//                                 className="accent-blue-500"
//                             />
//                             <span>{label}</span>
//                         </label>
//                     ))}
//                 </div>

//                 {/* Registration Fee */}
//                 <div className="bg-emerald-600 p-2 mt-2 text-white">
//                     <p className="capitalize">Registration Fee: {fee} Tk</p>
//                 </div>

//                 {/* Submit Button */}
//                 <div className="my-4">
//                     <button type="submit" className="w-20 h-10 bg-orange-500 text-white rounded">
//                         Submit
//                     </button>
//                 </div>

//                 {/* Error/Message Display */}
//                 {error && <p style={{ color: "red" }}>{error}</p>}
//                 {message && <p style={{ color: "green" }}>{message}</p>}
//             </div>
//         </form>
//     );
// };

// export default Form;






