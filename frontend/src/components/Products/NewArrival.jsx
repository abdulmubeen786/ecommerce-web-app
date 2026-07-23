import axiosInstance from "../../utils/axiosInstance";
import React, { useRef, useState, useEffect } from "react";
import { FaArrowCircleRight, FaArrowCircleLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const NewArrival = () => {
  const scrollRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [dragDistance, setDragDistance] = useState(0);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrival, SetNewArrival] = useState([]);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/new-Arrival`,
        );
        SetNewArrival(response.data);
      } catch (error) {
        return error;
      }
    };
    fetchNewArrival();
  }, []);

  // scroll function
  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const amount = 320;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // check scroll position
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    const left = el.scrollLeft;
    const max = el.scrollWidth - el.clientWidth;

    setCanScrollLeft(left > 0);
    setCanScrollRight(left < max - 1);
  };

  useEffect(() => {
    checkScroll();
  }, [newArrival]);

  // drag start
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragDistance(0);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;

    setDragDistance(Math.abs(walk));
    scrollRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  // window pe bhi mouseup listen karo, taaki div ke bahar mouse chhodne pe bhi drag ruk jaye
  useEffect(() => {
    const stopDrag = () => setIsDragging(false);
    window.addEventListener("mouseup", stopDrag);
    return () => window.removeEventListener("mouseup", stopDrag);
  }, []);

  const handleScroll = () => {
    checkScroll();
  };

  // drag ke baad accidental navigation rokne ke liye
  const handleLinkClick = (e) => {
    if (dragDistance > 5) {
      e.preventDefault();
    }
  };

  return (
    <section className="py-20 px-4 overflow-hidden bg-gradient-to-b from-white to-[#FAF9F6]">
      <div className="max-w-7xl mx-auto">
        {/* heading — editorial eyebrow + serif title, matches Hero/GenderCollection */}
        <div className="text-center mb-12">
          <span className="text-[11px] sm:text-xs font-medium tracking-[0.35em] uppercase text-[#8A6A3D]">
            Fresh Drop
          </span>

          <div className="flex items-center justify-center gap-3 mt-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#C9A85E]"></span>
            <h1 className="font-serif text-3xl md:text-4xl text-gray-900 tracking-tight">
              New Arrivals
            </h1>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#C9A85E]"></span>
          </div>

          <p className="text-gray-500 max-w-2xl mx-auto leading-7 text-sm sm:text-base font-light">
            Discover the latest styles straight off the runway, freshly added to
            keep your wardrobe modern and fresh.
          </p>
        </div>

        {/* slider */}
        <div className="relative">
          {/* desktop arrows */}
          <div className="hidden md:flex justify-end gap-3 mb-4">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 ${
                canScrollLeft
                  ? "bg-white/90 border-[#E8E6E1] text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-[#8A6A3D] hover:border-[#C9A85E]/50"
                  : "bg-gray-100/60 border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <FaArrowCircleLeft className="text-xl" />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`w-11 h-11 flex items-center justify-center rounded-full backdrop-blur-md border transition-all duration-300 ${
                canScrollRight
                  ? "bg-white/90 border-[#E8E6E1] text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-[#8A6A3D] hover:border-[#C9A85E]/50"
                  : "bg-gray-100/60 border-gray-100 text-gray-300 cursor-not-allowed"
              }`}
            >
              <FaArrowCircleRight className="text-xl" />
            </button>
          </div>

          {/* mobile arrows */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md border border-[#E8E6E1] rounded-full shadow-lg disabled:opacity-40"
          >
            <FaArrowCircleLeft className="text-xl text-gray-700" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-md border border-[#E8E6E1] rounded-full shadow-lg disabled:opacity-40"
          >
            <FaArrowCircleRight className="text-xl text-gray-700" />
          </button>

          {/* scroll content */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            className="flex gap-6 overflow-x-auto scroll-smooth select-none cursor-grab active:cursor-grabbing scrollbar-hide"
          >
            {newArrival.map((item) => (
              <div
                key={item._id}
                className="relative min-w-[260px] sm:min-w-[300px] h-[400px] rounded-2xl overflow-hidden flex-shrink-0 group shadow-lg hover:shadow-[0_20px_50px_rgba(201,168,94,0.2)] transition-shadow duration-500"
              >
                {/* Product Image */}
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  draggable={false}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none"></div>

                {/* gold frame ring on hover — replaces the plain white ring */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-[#C9A85E]/50 transition-all duration-500 pointer-events-none"></div>

                {/* text */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                  <Link to={`/product/${item._id}`} onClick={handleLinkClick}>
                    <h1 className="font-serif text-xl sm:text-2xl text-white group-hover:text-[#E8D4A8] transition-colors duration-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      {item.name}
                    </h1>
                    <span className="inline-block mt-2.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-[#C9A85E]/15 border border-[#C9A85E]/40 text-[#E8D4A8]">
                      ${item.price}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
