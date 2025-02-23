

import React from "react";
import logo from "../public/Copy of Kuralia B.K High School.png";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

const Head = () => {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 py-3 border-b-4 border-[#FF7F00] border-double">
      {/* Logo Section */}
      <div className="w-4/12 md:w-2/12 flex justify-center md:justify-start">
        <img className="w-28 md:w-full" src={logo} alt="KBKHS Logo" />
      </div>

      {/* Title & Location Section */}
      <div className="w-10/12 md:w-7/12 text-center md:text-center -mt-4 md:-mt-12">
        <h1 className="capitalize text-2xl md:text-5xl text-[#FF7F00]">
          Kuralia B.K Alimini Association
        </h1>
        <p className="text-xl md:text-3xl text-[#173E66]">
          কুরালিয়া বি.কে. অ্যালুমিনি অ্যাসোসিয়েশন
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
          kuraliabkalution@gmail.com
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