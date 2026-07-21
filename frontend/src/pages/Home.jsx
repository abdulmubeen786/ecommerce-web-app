import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrival from "../components/Products/NewArrival";
import ProductDetail from "../components/Products/ProductDetail";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProductByFilters } from "../redux/slices/productSlice";

const Home = () => {
  const [bestSeller, setBestSeller] = useState(null);
  const [bestSellerError, setBestSellerError] = useState(null); // ✅ ADD: error track karne ke liye
  const dispatch = useDispatch();
  const { products, filterLoading, filterError } = useSelector(
    // ✅ FIX
    (state) => state.products,
  );

  useEffect(() => {
    dispatch(
      fetchProductByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      }),
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/product/best-seller`,
        );

        setBestSeller(response.data);
      } catch (error) {
        console.error("Best seller fetch failed:", error); // ✅ ADD: error visible
        setBestSellerError(error.message);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrival />
      {/* best seller */}
      <h1 className=" text-3xl text-center font-bold mb-4">Best Seller</h1>
      {bestSeller ? (
        <ProductDetail productId={bestSeller._id} />
      ) : bestSellerError ? (
        <p className="text-center text-red-500">
          Failed to load best seller: {bestSellerError}
        </p>
      ) : (
        <p className="text-center">Best Seller Loading..</p>
      )}
      {/* womens Top Wear */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 md:mb-8 text-center md:text-left">
          Womens Top Wear
        </h1>
        <ProductGrid
          products={products}
          loading={filterLoading} // ✅ FIX
          error={filterError} // ✅ FIX
        />
      </div>
    </div>
  );
};

export default Home;
