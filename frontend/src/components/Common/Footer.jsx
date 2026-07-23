import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SiMeta } from "react-icons/si";
import { GrInstagram } from "react-icons/gr";
import { RiTwitterXLine } from "react-icons/ri";
import { FaPhoneVolume } from "react-icons/fa6";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setMessage(null);

    try {
      await axios.post(`${BACKEND_URL}/api/subscribe`, { email });
      setMessage({ type: "success", text: "Successfully subscribed!" });
      setEmail("");
    } catch (error) {
      const errMsg = "Something went wrong, try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-black text-white mt-16 overflow-hidden">
      {/* Ambient background glow — same language as Hero / Auth pages */}
      <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-black pointer-events-none" />
      <div className="absolute -top-32 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Newsletter — glass panel, sits above the grid as a signature element */}
        <div className="pt-14 pb-10">
          <div className="backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] px-6 py-8 sm:px-10 sm:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-md">
              <span className="inline-block mb-3 px-3.5 py-1 rounded-full text-xs font-medium tracking-wider uppercase backdrop-blur-md bg-white/10 border border-white/20 text-white/80">
                Newsletter
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
                Get 10% off your first order
              </h2>
              <p className="text-gray-400 text-sm leading-6">
                Be the first to hear about new products, exclusive events, and
                online offers
              </p>
            </div>

            <div className="w-full lg:w-auto lg:min-w-[380px]">
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-full bg-white/5 border border-white/20 backdrop-blur-md text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-white/40 focus:bg-white/10 transition"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md text-black px-6 py-3 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.2)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.4)] border border-white/50 transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 shrink-0"
                >
                  <span className="relative z-10">
                    {loading ? "Subscribing..." : "Subscribe"}
                  </span>
                  {!loading && (
                    <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  )}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
                </button>
              </form>

              {message && (
                <p
                  className={`mt-3 text-sm ${
                    message.type === "success"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Link columns */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5">
              Shop
            </h1>

            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link
                to={"collections/all?gender=Men"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Men's Top Wear
              </Link>

              <Link
                to={"collections/all?gender=Women"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Women's Top Wear
              </Link>

              <Link
                to={"collections/all?category=Top Wear"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Top Wear
              </Link>

              <Link
                to={"collections/all?category=Bottom Wear"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Bottom Wear
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5">
              Support
            </h1>

            <div className="flex flex-col gap-3 text-gray-400 text-sm">
              <Link
                to={"#"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Contact Us
              </Link>

              <Link
                to={"#"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                About Us
              </Link>

              <Link
                to={"#"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                FAQs
              </Link>

              <Link
                to={"#"}
                className="w-fit hover:text-white hover:translate-x-1 transition-all duration-200"
              >
                Features
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-white/90 mb-5">
              Follow Us
            </h2>

            <div className="flex items-center gap-3 mb-7">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/15 text-white/80 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
              >
                <SiMeta />
              </a>

              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/15 text-white/80 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
              >
                <GrInstagram />
              </a>

              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/15 text-white/80 hover:text-black hover:bg-white hover:border-white transition-all duration-300"
              >
                <RiTwitterXLine />
              </a>
            </div>

            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
              Call Us
            </p>

            <p className="flex items-center gap-2 text-sm text-gray-300">
              <span className="w-8 h-8 flex items-center justify-center rounded-full backdrop-blur-md bg-white/5 border border-white/15 text-white/70">
                <FaPhoneVolume size={13} />
              </span>
              0937-8363432
            </p>
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 text-center text-xs text-gray-500 tracking-wide">
          <p>© 2025 CompileTab. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
