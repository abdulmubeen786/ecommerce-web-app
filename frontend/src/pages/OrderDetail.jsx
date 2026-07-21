import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const OrderDetail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const headers = [
    "Product",
    "Order Id",
    "Created",
    "Shipping Address",
    "Qty",
    "Price",
    "Status",
  ];

  // ---------- Loading state ----------
  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="px-5 pb-2 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(4)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-5 py-4 bg-white first:rounded-l-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-100" />
                    <div className="h-3 w-24 bg-gray-200 rounded-full" />
                  </div>
                </td>
                <td className="px-5 py-4 bg-white">
                  <div className="h-3 w-16 bg-gray-200 rounded-full" />
                </td>
                <td className="px-5 py-4 bg-white">
                  <div className="h-3 w-20 bg-gray-200 rounded-full" />
                </td>
                <td className="px-5 py-4 bg-white">
                  <div className="h-3 w-28 bg-gray-200 rounded-full" />
                </td>
                <td className="px-5 py-4 bg-white">
                  <div className="h-3 w-6 bg-gray-200 rounded-full" />
                </td>
                <td className="px-5 py-4 bg-white">
                  <div className="h-3 w-12 bg-gray-200 rounded-full" />
                </td>
                <td className="px-5 py-4 bg-white last:rounded-r-2xl">
                  <div className="h-5 w-16 bg-gray-200 rounded-full" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ---------- Error state ----------
  if (error) {
    return (
      <div className="relative overflow-hidden flex flex-col items-center justify-center gap-3 bg-white rounded-3xl py-14 px-6 text-center shadow-[0_8px_30px_rgb(0,0,0,0.08)] ring-1 ring-red-100">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-100/50 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-rose-100/50 blur-3xl" />
        <div className="relative w-14 h-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white text-2xl font-bold shadow-lg shadow-red-200 rotate-3">
          !
        </div>
        <p className="relative text-sm font-semibold text-gray-800">
          Something went wrong while loading your orders
        </p>
        <p className="relative text-xs text-gray-400">{error}</p>
        <button
          onClick={() => dispatch(fetchUserOrders())}
          className="relative mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 rounded-full shadow-lg shadow-red-200 transition-all duration-200 hover:shadow-red-300 hover:-translate-y-0.5"
        >
          Try Again
        </button>
      </div>
    );
  }

  // ---------- Main table: floating card rows, one per product ----------
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-3">
        <thead>
          <tr>
            {headers.map((h) => (
              <th
                key={h}
                className="px-5 pb-2 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map((order) =>
              order.orderitems.map((item, idx) => (
                <tr
                  key={`${order._id}-${item.productId ?? idx}`}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="group cursor-pointer"
                >
                  <td className="relative px-5 py-4 bg-white first:rounded-l-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <span
                      className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${
                        order.isPaid
                          ? "bg-gradient-to-b from-emerald-400 to-teal-500"
                          : "bg-gradient-to-b from-amber-400 to-orange-500"
                      }`}
                    />
                    <div className="flex items-center gap-3 pl-2">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-md flex-shrink-0">
                        <img
                          src={item.image?.[0]?.url}
                          alt={item.image?.[0]?.altText || item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">
                        {item.name}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <span className="font-mono text-[11px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                      #{order._id.slice(-6).toUpperCase()}
                    </span>
                  </td>

                  <td className="px-5 py-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </td>

                  <td className="px-5 py-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200 text-sm text-gray-500">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  <td className="px-5 py-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold">
                      {item.quantity}
                    </span>
                  </td>

                  <td className="px-5 py-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      ${item.price}
                    </span>
                  </td>

                  <td className="px-5 py-4 bg-white last:rounded-r-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5 group-hover:shadow-[0_10px_25px_rgb(0,0,0,0.09)] group-hover:-translate-y-0.5 transition-all duration-200">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        order.isPaid
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          order.isPaid
                            ? "bg-emerald-500 animate-pulse"
                            : "bg-amber-500 animate-pulse"
                        }`}
                      />
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              )),
            )
          ) : (
            <tr>
              <td
                className="px-5 py-16 text-center bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.04)] ring-1 ring-black/5"
                colSpan="7"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center text-gray-300 text-2xl">
                    🛍
                  </div>
                  <p className="text-sm font-medium text-gray-400">
                    Checkout list empty
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetail;
