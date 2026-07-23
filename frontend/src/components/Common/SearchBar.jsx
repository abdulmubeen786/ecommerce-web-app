import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { TbXboxXFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductByFilters,
  setFilters,
} from "../../redux/slices/productSlice";
import axiosInstance from "../../utils/axiosInstance"; // ⚠️ path apne project ke hisaab se check kar lein

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  // Live results state
  const [liveResults, setLiveResults] = useState([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounced live search — jab bhi searchTerm change ho
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = searchTerm.trim();

    if (!trimmed) {
      setLiveResults([]);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setLiveLoading(true);
        const res = await axiosInstance.get(
          `${BACKEND_URL}/api/products?search=${encodeURIComponent(
            trimmed,
          )}&limit=6`,
        );
        setLiveResults(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.log(err);
        setLiveResults([]);
      } finally {
        setLiveLoading(false);
      }
    }, 400);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const handleSearchToggle = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setError("");
    setLiveResults([]);
    setShowDropdown(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchTerm.trim()) {
      setError("Please enter a search term");
      return;
    }

    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProductByFilters({ search: searchTerm }));
    navigate(`/collections/all?search=${searchTerm}`);

    handleClose();
  };

  // Kisi ek result pe click karke uski detail page pe jana
  const handleResultClick = (id) => {
    navigate(`/product/${id}`); // ⚠️ apna actual product detail route yahan confirm kar lein
    handleClose();
  };

  return (
    <>
      {/* Local keyframes — sirf is component ke liye, koi global CSS file chhedne ki zaroorat nahi */}
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {!isOpen && (
        <button
          onClick={handleSearchToggle}
          className="p-2 rounded-full text-gray-700 hover:text-black hover:bg-black/5 transition-all duration-300 text-lg"
          aria-label="Open search"
        >
          <FaSearch />
        </button>
      )}

      <div
        className={`
          fixed top-0 left-0 right-0 z-[60]
          bg-white/70 backdrop-blur-xl border-b border-white/40
          shadow-[0_4px_30px_rgba(0,0,0,0.08)]
          flex flex-col items-center px-4 md:px-8
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full max-w-2xl mx-auto gap-3 h-16"
        >
          <div
            className={`relative flex items-center flex-1 bg-white/60 backdrop-blur-md rounded-full px-4 py-2 gap-2 border shadow-inner transition-all duration-300
              ${error ? "border-red-400" : "border-gray-200 focus-within:border-black/30 focus-within:shadow-md"}`}
          >
            <FaSearch className="text-gray-400 shrink-0" />

            <input
              ref={inputRef}
              type="text"
              placeholder={error ? error : "Search products..."}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => {
                if (liveResults.length > 0) setShowDropdown(true);
              }}
              className={`bg-transparent outline-none text-sm flex-1 placeholder:${
                error ? "text-red-500" : "text-gray-400"
              }`}
            />
          </div>

          <button
            type="submit"
            className="group relative bg-black text-white text-sm px-5 py-2.5 rounded-full overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.4)] hover:scale-105 transition-all duration-300 shrink-0"
          >
            <span className="relative z-10">Search</span>
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent"></span>
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-all duration-300 shrink-0"
            aria-label="Close search"
          >
            <TbXboxXFilled size={22} />
          </button>
        </form>

        {/* Live results dropdown — boutique style */}
        {showDropdown && (
          <div className="w-full max-w-2xl mx-auto mb-4 bg-[#FAF9F6]/95 backdrop-blur-md rounded-2xl border border-[#E8E6E1] shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden max-h-96 overflow-y-auto">
            {liveLoading ? (
              <div className="flex items-center justify-center gap-2 p-6 text-xs uppercase tracking-widest text-[#8B8880]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8935F] animate-pulse"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8935F] animate-pulse [animation-delay:150ms]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8935F] animate-pulse [animation-delay:300ms]"></span>
                <span className="ml-1">Searching</span>
              </div>
            ) : liveResults.length > 0 ? (
              liveResults.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => handleResultClick(item._id)}
                  style={{
                    animation: "fadeSlideIn 0.35s ease-out forwards",
                    animationDelay: `${index * 60}ms`,
                    opacity: 0,
                  }}
                  className="group relative flex items-center gap-4 p-3.5 cursor-pointer border-b border-[#E8E6E1] last:border-b-0"
                >
                  {/* Brass accent bar — grows on hover */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-0 bg-[#B8935F] transition-all duration-300 ease-out group-hover:h-[70%] rounded-full"></span>

                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-[#EFEDE7] ring-1 ring-[#E8E6E1] transition-transform duration-300 group-hover:scale-[1.04]">
                    <img
                      src={item.images?.[0]?.url || "/placeholder.png"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A1A] truncate transition-colors duration-200 group-hover:text-[#8A6A3D]">
                      {item.name}
                    </p>
                    {item.category && (
                      <p className="text-[11px] uppercase tracking-wider text-[#B0ACA3] mt-0.5">
                        {item.category}
                      </p>
                    )}
                  </div>

                  <span className="shrink-0 text-xs font-semibold text-[#8A6A3D] bg-[#B8935F]/10 px-2.5 py-1 rounded-full">
                    ${item.discountPrice || item.price}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-[#1A1A1A]">No matches found</p>
                <p className="text-xs text-[#8B8880] mt-1">
                  Try a different keyword or check the spelling
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />
    </>
  );
};

export default SearchBar;
