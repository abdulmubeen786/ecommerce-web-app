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
      const errMsg =
        error?.response?.data?.message || "Something went wrong, try again.";
      setMessage({ type: "error", text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Newsletter</h2>

          <p className="text-gray-400 text-sm leading-6 mb-4">
            Be the first to hear about new products, exclusive events, and
            online offers
          </p>

          <h3 className="text-sm font-medium mb-4 text-gray-300">
            Sign up and get 10% off your first order
          </h3>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md bg-white text-black outline-none"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-white text-black px-5 py-3 rounded-md font-medium hover:bg-gray-200 transition disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {message && (
            <p
              className={`mt-3 text-sm ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-5">Shop</h1>

          <div className="flex flex-col gap-3 text-gray-400 text-sm">
            <Link
              to={"collections/all?gender=Men"}
              className="hover:text-white transition"
            >
              Men's Top Wear
            </Link>

            <Link
              to={"collections/all?gender=Women"}
              className="hover:text-white transition"
            >
              Women's Top Wear
            </Link>

            <Link
              to={"collections/all?category=Top Wear"}
              className="hover:text-white transition"
            >
              Top Wear
            </Link>

            <Link
              to={"collections/all?category=Bottom Wear"}
              className="hover:text-white transition"
            >
              Bottom Wear
            </Link>
          </div>
        </div>

        <div>
          <h1 className="text-xl font-semibold mb-5">Support</h1>

          <div className="flex flex-col gap-3 text-gray-400 text-sm">
            <Link to={"#"} className="hover:text-white transition">
              Contact Us
            </Link>

            <Link to={"#"} className="hover:text-white transition">
              About Us
            </Link>

            <Link to={"#"} className="hover:text-white transition">
              FAQs
            </Link>

            <Link to={"#"} className="hover:text-white transition">
              Features
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-5">Follow Us</h2>

          <div className="flex items-center gap-4 mb-6 text-lg">
            <a
              href="https://www.facebook.com"
              target="blank"
              className="hover:text-gray-300 transition"
            >
              <SiMeta />
            </a>

            <a
              href="https://www.facebook.com"
              target="blank"
              className="hover:text-gray-300 transition"
            >
              <GrInstagram />
            </a>

            <a
              href="https://www.facebook.com"
              target="blank"
              className="hover:text-gray-300 transition"
            >
              <RiTwitterXLine />
            </a>
          </div>

          <p className="text-gray-400 text-sm mb-2">Call Us</p>

          <p className="flex items-center gap-2 text-sm text-gray-300">
            <FaPhoneVolume />
            0937-8363432
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 text-center text-sm text-gray-400">
          <p>@ 2025 - CompileTab. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
