import React, { useEffect, useRef, useState } from "react";
import { FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import FilterSideBar from "../components/Products/FilterSideBar";
import SortProduct from "../components/Products/SortProduct";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductByFilters } from "../redux/slices/productSlice";

const PRODUCTS_PER_PAGE = 8; // 👈 aap yahan number change kar sakte hain

const CollectionPage = () => {
  const { collections } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, SetIsSidebarOpen] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);

    dispatch(
      fetchProductByFilters({
        collections,
        ...queryParams,
      }),
    );
  }, [dispatch, collections, searchParams.toString()]);

  // ✅ Jab bhi filters/collection change ho, page 1 par wapas le aao
  useEffect(() => {
    setCurrentPage(1);
  }, [collections, searchParams.toString()]);

  const togglesidebar = () => {
    SetIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutSide = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      SetIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, []);

  // ✅ Pagination calculations
  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE,
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <button
        onClick={togglesidebar}
        className="lg:hidden flex items-center gap-2 border px-4 py-2 rounded-lg mb-5"
      >
        <FaFilter />
        Filter
      </button>

      {isSidebarOpen && (
        <div
          onClick={togglesidebar}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      <div className="flex gap-6">
        <div
          ref={sidebarRef}
          className={`fixed lg:static top-0 left-0 z-50 w-72 bg-white transition-transform ${
            isSidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <FilterSideBar />
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">All Collections</h1>
            <SortProduct />
          </div>

          {/* ✅ No Products Found Message */}
          {!loading && !error && products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-6xl mb-4">🛍️</p>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Products Found
              </h2>
              <p className="text-sm text-gray-500">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          ) : (
            <>
              <ProductGrid
                products={paginatedProducts}
                loading={loading}
                error={error}
              />

              {/* ✅ Pagination Controls */}
              {!loading && !error && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
                  {/* Prev Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1.5 mx-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-200 ${
                            currentPage === page
                              ? "bg-gradient-to-b from-gray-800 to-black text-white shadow-md shadow-black/20 scale-105"
                              : "text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:shadow-sm"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
