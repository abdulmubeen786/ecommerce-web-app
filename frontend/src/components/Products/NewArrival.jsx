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
    <section className="py-16 px-4 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* heading */}
        <div className="text-center mb-10">
          <span className="inline-block mb-3 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase bg-black/5 border border-black/10 text-gray-700">
            Fresh Drop
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Explore New Arrival
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto leading-7">
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
                  ? "bg-white/80 border-gray-200 text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-black"
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
                  ? "bg-white/80 border-gray-200 text-gray-700 shadow-md hover:shadow-lg hover:scale-105 hover:text-black"
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
            className="md:hidden absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg disabled:opacity-40"
          >
            <FaArrowCircleLeft className="text-xl" />
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md border border-gray-200 rounded-full shadow-lg disabled:opacity-40"
          >
            <FaArrowCircleRight className="text-xl" />
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
                className="relative min-w-[260px] sm:min-w-[300px] h-[400px] rounded-2xl overflow-hidden flex-shrink-0 group shadow-lg hover:shadow-2xl transition-shadow duration-500"
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

                {/* glossy border ring on hover */}
                <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-white/30 transition-all duration-500 pointer-events-none"></div>

                {/* text */}
                <div className="absolute bottom-0 left-0 w-full p-6 z-10">
                  <Link to={`/product/${item._id}`} onClick={handleLinkClick}>
                    <h1 className="text-2xl font-bold text-white group-hover:underline drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                      {item.name}
                    </h1>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-md bg-white/15 border border-white/20 text-white">
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
