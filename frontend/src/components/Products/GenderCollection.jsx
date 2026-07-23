import React from "react";
import womenCollection from "../../assets/women-ollection.jpg";
import menCollection from "../../assets/mens-collection.jpg";
import { Link } from "react-router-dom";

const GenderCollection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-white">
      {/* Local keyframes — scoped to this section only */}
      <style>{`
        @keyframes gcLineGrow {
          from { width: 0; opacity: 0; }
          to { width: 40px; opacity: 1; }
        }
      `}</style>

      {/* Section header — editorial eyebrow, matches Hero's language */}
      <div className="max-w-7xl mx-auto text-center mb-12 md:mb-16">
        <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-[#8A6A3D]">
          Shop By
        </span>
        <span className="block h-px w-10 bg-gradient-to-r from-transparent via-[#C9A85E] to-transparent mx-auto mt-3"></span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] mt-5 tracking-tight">
          Curated for Everyone
        </h2>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* women collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-shadow duration-500">
          <img
            src={womenCollection}
            alt="womens"
            className="w-full h-[520px] object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />

          {/* filmic grain, subtle, matches Hero texture */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          ></div>

          {/* overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5"></div>

          {/* content */}
          <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-10">
            <div className="flex flex-col items-center mb-3">
              <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-white/70">
                For Her
              </span>
              <span
                className="h-px bg-gradient-to-r from-transparent via-[#C9A85E] to-transparent mt-2.5"
                style={{ animation: "gcLineGrow 0.7s ease-out 0.2s both" }}
              ></span>
            </div>

            <h3 className="font-serif text-white text-3xl md:text-4xl mb-7 tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              Women's Collection
            </h3>

            <Link
              to={"/collections/all?gender=Women"}
              className="group/btn relative inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_35px_rgba(201,168,94,0.4)] border border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 uppercase">Shop Now</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#C9A85E]/25 to-transparent"></span>
            </Link>
          </div>
        </div>

        {/* mens collection */}
        <div className="relative group overflow-hidden rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] transition-shadow duration-500">
          <img
            src={menCollection}
            alt="mens"
            className="w-full h-[520px] object-cover group-hover:scale-[1.06] transition-transform duration-700 ease-out"
          />

          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-10">
            <div className="flex flex-col items-center mb-3">
              <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-white/70">
                For Him
              </span>
              <span
                className="h-px bg-gradient-to-r from-transparent via-[#C9A85E] to-transparent mt-2.5"
                style={{ animation: "gcLineGrow 0.7s ease-out 0.2s both" }}
              ></span>
            </div>

            <h3 className="font-serif text-white text-3xl md:text-4xl mb-7 tracking-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
              Men's Collection
            </h3>

            <Link
              to={"/collections/all?gender=Men"}
              className="group/btn relative inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 rounded-full text-sm font-semibold tracking-wide overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_35px_rgba(201,168,94,0.4)] border border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 uppercase">Shop Now</span>
              <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                →
              </span>
              <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#C9A85E]/25 to-transparent"></span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollection;
