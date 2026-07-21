import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchALLOrders } from "../../redux/slices/adminOrderSlice";
import { fetchAdminProducts } from "../../redux/slices/adminProductSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProduct);
  const {
    orders,
    totalOrders,
    totalSales,
    error: ordersError,
    loading: ordersLoading,
  } = useSelector((state) => state.adminOrder);

  useEffect(() => {
    dispatch(fetchALLOrders());
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const statusStyles = {
    processing: "bg-yellow-100 text-yellow-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  if (productsLoading || ordersLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <span className="ml-3 text-sm text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  if (productsError || ordersError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
        {productsError || ordersError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Revenue</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            ${totalSales.toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalOrders}</p>
          <Link
            to={"/admin/orders"}
            className="mt-3 inline-block text-sm font-medium text-gray-900 underline hover:text-gray-600"
          >
            Manage orders
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">Total Products</h2>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {products?.length}
          </p>
          <Link
            to={"/admin/products"}
            className="mt-3 inline-block text-sm font-medium text-gray-900 underline hover:text-gray-600"
          >
            Manage products
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Order ID</th>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Total Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders?.length > 0 ? (
              orders.map((item, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    #{item._id}
                  </td>
                  <td className="px-4 py-3 capitalize">{item.user?.name}</td>
                  <td className="px-4 py-3">${item.totalPrice}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        statusStyles[item.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHomePage;
