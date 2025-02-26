"use client";

import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";

const Form: React.FC = () => {
  const [membershipCategory, setMembershipCategory] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleMembershipChange = (value: string) => {
    setMembershipCategory(value);
    setFormData((prev) => ({ ...prev, membership_category: value }));
  };

  const fee =
    membershipCategory === "Life Member"
      ? 1000
      : membershipCategory === "Executive Member"
      ? 500
      : membershipCategory === "General Member"
      ? 200
      : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const { name_bengali, name_english, phone, email, membership_category } =
      formData;
    if (
      !name_bengali ||
      !name_english ||
      !phone ||
      !email ||
      !membership_category
    ) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "An error occurred while submitting the form."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center my-2">
        <h1 className="mx-auto text-2xl text-orange-600 border-b-4 border-dotted">
          Register as a New Member
        </h1>
      </div>
      <div className="w-full">
        {preview && (
          <Image
            className="border-amber-300 mb-2 border-2 mx-auto w-60 h-60 rounded-full"
            src={preview}
            alt="Uploaded Preview"
            width={240}
            height={240}
            priority
          />
        )}
        <input
          className="border-2 text-amber-300 p-2 bg-gray-700"
          accept="image/*"
          type="file"
          onChange={handleImage}
        />
        {[
          { label: "Name (বাংলা)", name: "name_bengali", type: "text" },
          { label: "Name (English)", name: "name_english", type: "text" },
          { label: "SSC Batch", name: "ssc_batch", type: "text" },
          { label: "Address (Present)", name: "address_present", type: "text" },
          {
            label: "Address (Permanent)",
            name: "address_permanent",
            type: "text",
          },
          { label: "Phone", name: "phone", type: "tel" },
          { label: "E-mail", name: "email", type: "email" },
          { label: "Occupation (পেশা)", name: "occupation", type: "text" },
        ].map(({ label, name, type }, index) => (
          <div key={index} className="text-xl block m-1">
            {label}:
            <input
              type={type}
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleChange}
              className="border-2 border-amber-400 rounded-2xl p-2 w-full text-black"
            />
          </div>
        ))}
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
        <div className="flex flex-col space-y-2">
          <span className="text-xl">Category of Membership:</span>
          {["Life Member", "Executive Member", "General Member"].map(
            (value) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="membership_category"
                  value={value}
                  checked={membershipCategory === value}
                  onChange={() => handleMembershipChange(value)}
                  className="accent-blue-500"
                />
                <span>{value}</span>
              </label>
            )
          )}
        </div>
        <div className="bg-emerald-600 p-2 mt-2 text-white">
          <p className="capitalize">Registration Fee: {fee} Tk</p>
        </div>
        <div className="my-4">
          <button
            type="submit"
            className="w-20 h-10 bg-orange-500 text-white rounded"
            disabled={loading}
          >
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
