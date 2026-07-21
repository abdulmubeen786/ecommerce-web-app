import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  adminDeleteProduct,
  fetchAdminProducts,
} from "../../redux/slices/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { products, loading, error } = useSelector(
    (state) => state.adminProduct,
  );

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      dispatch(adminDeleteProduct(id));
    }
  };
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAdminProducts());
    }
  }, [dispatch, user, navigate]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Link
          to={"/admin/product/new"}
          className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          <FaPlus className="text-xs" />
          <span>Add Product</span>
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {typeof error === "string"
            ? error
            : "Products load karne mein error aayi"}
        </p>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Loading products...
                </td>
              </tr>
            ) : products.length > 0 ? (
              products.map((item) => (
                <tr key={item._id} className="text-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-4 py-3">${item.price}</td>
                  <td className="px-4 py-3">{item.sku}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/products/${item._id}/edit`}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="flex items-center gap-1.5 text-gray-500 hover:text-red-600"
                      >
                        <FaTrash />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Product not found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
