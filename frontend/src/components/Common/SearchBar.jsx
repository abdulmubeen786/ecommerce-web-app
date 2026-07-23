import React, { useState, useEffect, useRef } from "react";
import { FaSearch } from "react-icons/fa";
import { TbXboxXFilled } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductByFilters,
  setFilters,
} from "../../redux/slices/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSearchToggle = () => setIsOpen(true);

  const handleClose = () => {
    setIsOpen(false);
    setSearchTerm("");
    setError("");
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

    // ✅ auto-close (slide back up) once the search is submitted
    handleClose();
  };

  return (
    <>
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
          flex items-center px-4 md:px-8 h-16
          transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
      >
        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full max-w-2xl mx-auto gap-3"
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
      </div>

      {/* backdrop — always mounted, fades in/out smoothly instead of popping */}
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
