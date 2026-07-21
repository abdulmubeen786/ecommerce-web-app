import React from "react";
import HeroImg from "../../assets/black-friday-sales-sign-neon-light.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      {/* Hero Image */}
      <img
        src={HeroImg}
        alt="Rabbit"
        className="w-full h-full object-cover scale-105"
      />

      {/* Gradient Overlay - glossy dark fade */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl text-white flex flex-col items-center">
          {/* Glass badge */}
          <span className="mb-5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase backdrop-blur-md bg-white/10 border border-white/20 shadow-lg">
            New Season Collection
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold uppercase tracking-wide mb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Vacation
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-200/90 leading-7 mb-8 max-w-md">
            Explore our vacation-ready outfits with fast worldwide shipping
          </p>

          <Link
            to={"collections/all"}
            className="group relative inline-flex items-center gap-2 bg-white/90 backdrop-blur-md text-black px-8 py-3.5 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)] border border-white/50 transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">Shop Now</span>
            <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            {/* Shine sweep effect */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent"></span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
