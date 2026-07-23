import React, { useEffect, useState } from "react";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

// color name -> actual CSS value
// (patterns like "Tropical Print" get an approximate gradient since a
// flat color/CSS can't reproduce an actual print texture)
const colorMap = {
  Red: "#DC2626",
  Blue: "#2563EB",
  Yellow: "#FACC15",
  Black: "#000000",
  White: "#FFFFFF",
  Gray: "#808080",
  Navy: "#001F3F",
  "Navy Blue": "#001F54",
  "Dark Blue": "#0B1F4E",
  "Light Blue": "#7EC8E3",
  Burgundy: "#6D071A",
  Olive: "#556B2F",
  Charcoal: "#36454F",
  "Dark Green": "#1B4332",
  Beige: "#E8DCC4",
  Pink: "#F8BBD0",
  Khaki: "#C3B091",
  Brown: "#5C4033",
  Lavender: "#E6E6FA",
  "Heather Gray": "#B0B0B0",
  "Dark Wash": "#2C3E50",
  "Tropical Print": "linear-gradient(135deg, #2E7D32, #F9A825, #00796B)",
  "Navy Palms": "linear-gradient(135deg, #001F3F, #2E7D32)",
};

const ProductDetail = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectProduct,
    detailLoading,
    detailError,
    similarProducts,
    similarLoading,
    similarError,
  } = useSelector((state) => state.products);

  const { guestId, user } = useSelector((state) => state.auth);
  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts(productFetchId));
    }
  }, [dispatch, productFetchId]);

  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (selectProduct?.images?.length > 0) {
      setMainImage(selectProduct.images[0]);
    }
  }, [selectProduct]);

  const handleToast = async () => {
    if (!selectedColor || !selectedSize) {
      return toast.error("please select a size and color");
    }

    setIsAddingToCart(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          color: selectedColor,
          size: selectedSize,
          quantity,
          guestId,
          userId: user?._id,
        }),
      ).unwrap();

      toast.success("added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!productFetchId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-400 text-sm">No product selected.</p>
      </div>
    );
  }

  if (detailLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  if (detailError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500 font-medium">
          Something went wrong: {detailError}
        </p>
      </div>
    );
  }

  if (!selectProduct || !mainImage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Local keyframes — scoped to this page */}
      <style>{`
        @keyframes pdFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pdLineGrow {
          from { width: 0; opacity: 0; }
          to { width: 32px; opacity: 1; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT SIDE: Images */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex md:flex-col flex-row gap-3 order-2 md:order-1 overflow-x-auto md:overflow-visible">
            {selectProduct.images.map((item, index) => (
              <img
                key={index}
                src={item.url}
                alt={item.altText}
                onClick={() => setMainImage(item)}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-300 flex-shrink-0 ${
                  mainImage.url === item.url
                    ? "border-[#C9A85E] shadow-md scale-105"
                    : "border-transparent opacity-60 hover:opacity-100 hover:shadow-sm"
                }`}
              />
            ))}
          </div>

          <div className="flex-1 order-1 md:order-2 overflow-hidden rounded-2xl bg-[#FAF9F6] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-[#E8E6E1] relative">
            <img
              src={mainImage.url}
              alt={mainImage.altText}
              className="w-full h-72 sm:h-96 md:h-[500px] object-cover transition-transform duration-500 hover:scale-105"
            />
            {/* glossy top sheen */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/25 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* RIGHT SIDE: Details */}
        <div
          className="flex flex-col justify-center space-y-7"
          style={{
            animation: "pdFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          <div>
            {selectProduct.brand && (
              <span className="text-[11px] font-medium tracking-[0.3em] uppercase text-[#8A6A3D]">
                {selectProduct.brand}
              </span>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#1A1A1A] tracking-tight mt-2 mb-3">
              {selectProduct.name}
            </h1>

            <div className="flex items-center gap-2 mb-5">
              <span className="text-[#C9A85E] tracking-tight">★★★★☆</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                (12 Reviews)
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <p className="text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
                ${selectProduct.price}
              </p>
              <p className="text-lg sm:text-xl text-gray-400 line-through">
                ${selectProduct.originalPrice}
              </p>
              <span className="bg-[#8A6A3D]/10 text-[#8A6A3D] px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider">
                Sale
              </span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-light">
            {selectProduct.description}
          </p>

          {/* Colors */}
          <div>
            <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase text-gray-400 mb-3">
              Colors
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectProduct.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedColor(color)}
                  className={`flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-300 ${
                    selectedColor === color
                      ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md scale-105"
                      : "border-gray-200 text-gray-600 hover:border-[#C9A85E]/50 hover:bg-[#FAF9F6]"
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full border shadow-sm ${
                      selectedColor === color
                        ? "border-white/60"
                        : "border-gray-300"
                    }`}
                    style={{
                      background: colorMap[color] || color.toLowerCase(),
                    }}
                  ></span>
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h2 className="text-[11px] font-medium tracking-[0.25em] uppercase text-gray-400 mb-3">
              Sizes
            </h2>
            <div className="flex flex-wrap gap-2">
              {selectProduct.sizes.map((size, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(size)}
                  className={`w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl border-2 font-semibold text-sm transition-all duration-300 ${
                    selectedSize === size
                      ? "bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-md scale-105"
                      : "border-gray-100 hover:border-[#C9A85E]/60 text-gray-600 hover:shadow-sm"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and CTA */}
          <div className="pt-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="flex items-center justify-center border-2 border-gray-100 rounded-xl px-4 py-2 bg-[#FAF9F6] shadow-inner w-fit mx-auto sm:mx-0">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-lg">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleToast}
                disabled={isAddingToCart}
                className={`group relative flex-1 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 uppercase tracking-widest text-xs ${
                  isAddingToCart
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#1A1A1A] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_35px_rgba(201,168,94,0.35)] hover:scale-[1.02] active:scale-95"
                }`}
              >
                <span className="relative z-10">
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </span>
                {!isAddingToCart && (
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-[#C9A85E]/25 to-transparent"></span>
                )}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="pt-8 border-t border-gray-100 flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                Brand
              </p>
              <p className="font-semibold text-[#1A1A1A]">
                {selectProduct.brand}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                Material
              </p>
              <p className="font-semibold text-[#1A1A1A]">
                {selectProduct.material}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* similar product */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 md:py-20">
        <div className="text-center md:text-left mb-8 md:mb-10">
          <span className="text-[11px] font-medium tracking-[0.35em] uppercase text-[#8A6A3D]">
            Complete the Look
          </span>
          <span
            className="block h-px w-8 bg-gradient-to-r from-[#C9A85E] to-transparent mt-2.5 mx-auto md:mx-0"
            style={{ animation: "pdLineGrow 0.7s ease-out 0.2s both" }}
          ></span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#1A1A1A] mt-4 tracking-tight">
            You May Also Like
          </h2>
        </div>

        <ProductGrid
          products={similarProducts}
          loading={similarLoading}
          error={similarError}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
