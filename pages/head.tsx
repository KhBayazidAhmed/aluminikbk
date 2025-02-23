import React from "react";
import Image from "next/image"; // ✅ Import Image properly
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const Head = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-3 border-b-4 border-[#FF7F00] border-double">
      {/* Logo Section */}
      <div className="w-4/12 md:w-2/12 flex justify-center md:justify-start">
        <Image src="/Copy of Kuralia B.K High School.png" alt="School Logo" width={200} height={200} />
      </div>

      {/* Title & Location Section */}
      <div className="w-10/12 md:w-7/12 text-center md:text-center -mt-4 md:-mt-12">
        <h1 className="capitalize text-2xl md:text-5xl text-[#FF7F00]">
          Kuralia B.K Alumni Association
        </h1>
        <p className="text-xl md:text-3xl text-[#173E66]">
          কুরালিয়া বি.কে. অ্যালুমনি অ্যাসোসিয়েশন
        </p>
        <p className="text-lg md:text-2xl text-[#173E66]">
          কুরালিয়া, মধুপুর, টাঙ্গাইল
        </p>
        <p className="text-lg md:text-2xl text-[#173E66]">স্থাপিত: ২০২৫</p>
      </div>

      {/* Contact Section */}
      <div className="w-full md:w-3/12 text-center md:text-left mt-3 md:mt-0">
        <span className="flex justify-center md:justify-start items-center gap-1 text-sm md:text-base font-semibold text-[#163C66]">
          <MdEmail className="text-xl md:text-2xl text-[#FF7F00]" />
          kuraliabkalumni@gmail.com {/* ✅ Make sure this is the correct email */}
        </span>
        <span className="flex justify-center md:justify-start items-center gap-1 text-sm md:text-base font-semibold text-[#163C66] mt-1">
          <FaPhone className="text-xl md:text-2xl text-[#FF7F00]" />
          +880170-3748537
        </span>
      </div>
    </div>
  );
};

export default Head;
