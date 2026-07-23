import React from "react";
import HeroImg from "../../assets/black-friday-sales-sign-neon-light.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative w-full h-[90vh] overflow-hidden bg-black">
      {/* Local keyframes for the entrance sequence + ambient motion */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroLineGrow {
          from { width: 0; opacity: 0; }
          to { width: 48px; opacity: 1; }
        }
        @keyframes heroImageDrift {
          from { transform: scale(1.12); }
          to { transform: scale(1.04); }
        }
        @keyframes scrollDrift {
          0% { transform: translateY(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translateY(10px); opacity: 0; }
        }
      `}</style>

      {/* Hero Image — slow outward drift instead of a static scale */}
      <img
        src={HeroImg}
        alt="Rabbit"
        className="w-full h-full object-cover"
        style={{
          animation: "heroImageDrift 8s ease-out forwards",
        }}
      />

      {/* Filmic grain texture for a premium, non-flat finish */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      ></div>

      {/* Cinematic vignette + gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/25"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-black/55"></div>
      <div className="absolute inset-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.55)]"></div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center px-4">
        <div className="max-w-2xl text-white flex flex-col items-center">
          {/* Eyebrow label — thin line replaces the pill badge for an editorial feel */}
          <div
            className="flex flex-col items-center mb-6"
            style={{
              animation:
                "heroFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s both",
            }}
          >
            <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-white/70">
              New Season Collection
            </span>
            <span
              className="h-px bg-gradient-to-r from-transparent via-[#C9A85E] to-transparent mt-3"
              style={{
                animation: "heroLineGrow 0.8s ease-out 0.6s both",
              }}
            ></span>
          </div>

          <h1
            className="font-serif text-5xl sm:text-6xl md:text-8xl font-normal tracking-tight mb-5 leading-[0.95] drop-shadow-[0_4px_25px_rgba(0,0,0,0.65)] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60"
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.3s both",
            }}
          >
            Vacation
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg text-white/70 font-light leading-7 mb-9 max-w-md"
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.55s both",
            }}
          >
            Explore our vacation-ready outfits with fast worldwide shipping
          </p>

          <div
            style={{
              animation: "heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) 0.8s both",
            }}
          >
            <Link
              to={"collections/all"}
              className="group relative inline-flex items-center gap-2.5 bg-white text-black px-9 py-3.5 rounded-full text-sm font-semibold tracking-wide overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_40px_rgba(201,168,94,0.35)] border border-white/50 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 uppercase">Shop Now</span>
              <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
              {/* Champagne-gold shine sweep, on-brand with the divider accent */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#C9A85E]/25 to-transparent"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subtle scroll cue — grounds the hero as the top of a longer page */}
      <div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          animation: "heroFadeUp 1s cubic-bezier(0.22,1,0.36,1) 1.1s both",
        }}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
          Scroll
        </span>
        <span className="relative w-px h-8 bg-white/25 overflow-hidden">
          <span
            className="absolute top-0 left-0 w-px h-3 bg-white/80"
            style={{ animation: "scrollDrift 1.8s ease-in-out infinite" }}
          ></span>
        </span>
      </div>
    </section>
  );
};

export default Hero;
