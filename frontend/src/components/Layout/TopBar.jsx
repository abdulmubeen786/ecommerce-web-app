import React from "react";
import { SiMeta } from "react-icons/si";
import { GrInstagram } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";

const TopBar = () => {
  return (
    <div className="relative w-full bg-black text-white">
      {/* subtle gradient divider — matches Footer's fade line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
        {/* Social Icons */}
        <div className="flex items-center gap-2.5">
          <a
            href="#"
            aria-label="Facebook"
            className="w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
          >
            <SiMeta size={13} />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
          >
            <GrInstagram size={13} />
          </a>

          <a
            href="#"
            aria-label="Twitter / X"
            className="w-7 h-7 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/10 text-white/70 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
          >
            <RiTwitterXLine size={13} />
          </a>
        </div>

        {/* Shipping Text */}
        <div className="text-center">
          <span className="tracking-wide text-gray-400">
            We ship worldwide — fast and reliable shipping
          </span>
        </div>

        {/* Contact */}
        <div>
          <span className="font-medium tracking-wide text-gray-300">
            +92-098373654
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
