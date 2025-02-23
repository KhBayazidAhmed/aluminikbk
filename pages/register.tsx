"use client"; // Add this directive at the top

import React, { useState } from "react";

const Form = () => {
    const [membershipCategory, setMembershipCategory] = useState("");
    const [image, setImage] = useState(null);
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
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle file input change
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            const imgData = new FileReader();
            imgData.onload = () => {
                if (imgData.readyState === 2) {
                    setImage(imgData.result as string);
                }
            };
            imgData.readAsDataURL(file);
        }
    };

    // Calculate Registration Fee
    let fee = 0;
    if (membershipCategory === "Life Member") fee = 1000;
    if (membershipCategory === "Executive Member") fee = 500;
    if (membershipCategory === "General Member") fee = 200;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { name_bengali, name_english, ssc_batch, address_present, address_permanent, phone, email, occupation, marital_status } = formData;

        if (!name_bengali || !name_english || !phone || !email || !membershipCategory) {
            setError("Please fill in all the required fields.");
            return;
        }

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name_bengali,
                    name_english,
                    ssc_batch,
                    address_present,
                    address_permanent,
                    phone,
                    email,
                    occupation,
                    marital_status,
                    membership_category: membershipCategory,
                    image, // You can upload the image later to a cloud storage or directly to the backend
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage(data.message);
                setError("");
            } else {
                setError(data.message);
                setMessage("");
            }
        } catch (error) {
            setError("An error occurred while submitting the form.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            {/* Heading */}
            <div className="flex items-center my-2">
                <h1 className="inline-block mx-auto text-2xl text-[#FF7F00] border-dotted border-b-4">
                    Register as a New Member
                </h1>
            </div>

            {/* Form */}
            <div className="w-full">
                {/* Image Input */}
                <div>
                    {image && (
                        <img
                            className="border-amber-300 mb-2 border-2 mx-auto w-60 h-60 rounded-full"
                            src={image}
                            alt="Uploaded Preview"
                        />
                    )}
                    <input
                        className="border-2 text-amber-300 p-2 bg-[#163D66]"
                        accept="image/*"
                        type="file"
                        onChange={handleImage}
                    />
                </div>

                {/* Text Inputs */}
                <div>
                    {[
                        { label: "Name (বাংলা)", name: "name_bengali", type: "text" },
                        { label: "Name (English)", name: "name_english", type: "text" },
                        { label: "SSC Batch", name: "ssc_batch", type: "text" },
                        { label: "Address (Present)", name: "address_present", type: "text" },
                        { label: "Address (Permanent)", name: "address_permanent", type: "text" },
                        { label: "Phone", name: "phone", type: "tel", placeholder: "Enter your phone number" },
                        { label: "E-mail", name: "email", type: "email", placeholder: "Enter your email" },
                        { label: "Occupation (পেশা)", name: "occupation", type: "text", placeholder: "Enter your occupation" },
                    ].map(({ label, name, type, placeholder }, index) => (
                        <div key={index} className="text-xl block m-1">
                            {label}:
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                placeholder={placeholder || ""}
                                onChange={handleChange}
                                className="uppercase border-2 focus-visible:outline-hidden border-amber-400 rounded-2xl p-2 w-full"
                            />
                        </div>
                    ))}
                </div>

                {/* Marital Status */}
                <div className="text-xl block m-1">
                    Marital Status:
                    {["Married", "Unmarried"].map((status) => (
                        <label key={status} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="marital_status"
                                value={status.toLowerCase()}
                                onChange={handleChange}
                                checked={formData.marital_status === status.toLowerCase()}
                                className="accent-blue-500"
                            />
                            <span>{status}</span>
                        </label>
                    ))}
                </div>

                {/* Membership Category */}
                <div className="flex flex-col space-y-2">
                    <span className="text-xl">Category of Membership:</span>
                    {[
                        { label: "Life Member (জীবন সদস্য)", value: "Life Member" },
                        { label: "Executive Member (কার্যকরী সদস্য)", value: "Executive Member" },
                        { label: "General Member (সাধারণ সদস্য)", value: "General Member" },
                    ].map(({ label, value }) => (
                        <label key={value} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="membership_category"
                                value={value}
                                checked={membershipCategory === value}
                                onChange={() => setMembershipCategory(value)}
                                className="accent-blue-500"
                            />
                            <span>{label}</span>
                        </label>
                    ))}
                </div>

                {/* Registration Fee */}
                <div className="bg-emerald-600 p-2 mt-2 text-white">
                    <p className="capitalize">Registration Fee: {fee} Tk</p>
                </div>

                {/* Submit Button */}
                <div className="my-4">
                    <button type="submit" className="w-20 h-10 bg-orange-500 text-white rounded">
                        Submit
                    </button>
                </div>

                {/* Error/Message Display */}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {message && <p style={{ color: "green" }}>{message}</p>}
            </div>
        </form>
    );
};

export default Form;
