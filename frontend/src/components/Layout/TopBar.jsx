import React from "react";
import { SiMeta } from "react-icons/si";
import { GrInstagram } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className="w-full bg-black text-white border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gray-300 transition duration-300">
            <SiMeta size={18} />
          </a>

          <a href="#" className="hover:text-gray-300 transition duration-300">
            <GrInstagram size={18} />
          </a>

          <a href="#" className="hover:text-gray-300 transition duration-300">
            <RiTwitterXLine size={18} />
          </a>
        </div>

        {/* Shipping Text */}
        <div className="text-center">
          <span className="tracking-wide text-gray-300">
            We ship worldwide - fast and reliable shipping
          </span>
        </div>

        {/* Contact */}
        <div>
          <span className="font-medium tracking-wide text-gray-200">
            +92-098373654
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
