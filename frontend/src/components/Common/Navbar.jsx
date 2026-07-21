import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { FaShoppingBag } from "react-icons/fa";
import { HiBars3BottomRight } from "react-icons/hi2";
import { TbXboxXFilled } from "react-icons/tb";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { cart } = useSelector((state) => state.cart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [navDrawer, setNavDrawer] = useState(false);
  const toggleNavDrawer = () => {
    setNavDrawer(!navDrawer);
  };

  const cartOpen = () => {
    setIsCartOpen(!isCartOpen);
  };

  // ✅ Total cart items count
  const cartCount = cart?.products?.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <nav className="w-full bg-white border-b border-gray-200 relative z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* left - logo */}
          <div className="text-2xl font-bold text-gray-900 flex-shrink-0">
            <Link to={"/"} className="hover:text-black transition">
              Shopify
            </Link>
          </div>

          {/* center - navigation links */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium flex-shrink-0">
            <Link
              to={"collections/all?gender=Men"}
              className="hover:text-black transition"
            >
              Men
            </Link>
            <Link
              to={"collections/all?gender=Women"}
              className="hover:text-black transition"
            >
              Women
            </Link>
            <Link
              to={"collections/all?category=Top Wear"}
              className="hover:text-black transition"
            >
              Top Wear
            </Link>
            <Link
              to={"collections/all?category=Bottom Wear"}
              className="hover:text-black transition"
            >
              Bottom Wear
            </Link>
          </div>

          {/* right - icons */}
          <div className="flex items-center gap-4 text-gray-700 flex-shrink-0">
            {user && user.role === "admin" && (
              <Link to={"/admin"} className="hover:text-black transition">
                Admin
              </Link>
            )}

            <Link to={"/profile"} className="hover:text-black transition">
              <FaUser size={18} />
            </Link>

            <button
              className="relative hover:text-black transition"
              type="button"
              onClick={cartOpen}
            >
              <FaShoppingBag size={18} />
              {/* ✅ Hard coded 4 → dynamic cartCount */}
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* search - wrapped so its expansion stays contained */}
            <div className="relative z-40">
              <SearchBar />
            </div>

            {/* mobile menu */}
            <button className="md:hidden text-2xl" onClick={toggleNavDrawer}>
              <HiBars3BottomRight />
            </button>
          </div>
        </div>
      </nav>
      <CartDrawer cartOpen={cartOpen} isCartOpen={isCartOpen} />

      {/* mobile navigation link */}
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-50 shadow-xl transform transition-transform duration-300 md:hidden ${
          navDrawer ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>

          <button
            onClick={toggleNavDrawer}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <TbXboxXFilled size={22} />
          </button>
        </div>

        {/* mobile links */}
        <div className="flex flex-col p-4 space-y-2">
          <Link
            to={"collections/all?gender=Men"}
            className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-black hover:text-white transition duration-300"
            onClick={toggleNavDrawer}
          >
            Men
          </Link>

          <Link
            to={"collections/all?gender=Women"}
            className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-black hover:text-white transition duration-300"
            onClick={toggleNavDrawer}
          >
            Women
          </Link>

          <Link
            to={"collections/all?category=Top Wear"}
            className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-black hover:text-white transition duration-300"
            onClick={toggleNavDrawer}
          >
            Top
          </Link>

          <Link
            to={"collections/all?category=Bottom Wear"}
            className="px-4 py-3 rounded-lg text-gray-700 font-medium hover:bg-black hover:text-white transition duration-300"
            onClick={toggleNavDrawer}
          >
            Bottom
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
