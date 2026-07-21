import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition duration-300 flex flex-col"
        >
          {/* Product Image - click to go to detail page */}
          <Link
            to={`/product/${product._id}`}
            className="relative overflow-hidden block"
          >
            <img
              src={product.images[0].url}
              alt={product.name}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Product Info */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <Link to={`/product/${product._id}`}>
              <p className="text-gray-800 font-medium truncate hover:text-blue-600 transition">
                {product.name}
              </p>
            </Link>

            <div className="mt-3">
              <p className="text-lg font-semibold text-black">
                ${product.price}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
