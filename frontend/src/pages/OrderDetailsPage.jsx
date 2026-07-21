import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchorderdetail } from "../redux/slices/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const {
    orderdetail: orderDetails,
    loading,
    error,
  } = useSelector((state) => state.order);
  useEffect(() => {
    dispatch(fetchorderdetail(id));
  }, [dispatch, id]);

  const Badge = ({ label, positive }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        positive ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {label}
    </span>
  );

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Order not found.</p>
      </div>
    );
  }

  const total = orderDetails.orderitems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* ── Header ── */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Order #{orderDetails._id}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Placed on{" "}
                {new Date(orderDetails.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge
                label={orderDetails.isPaid ? "Paid" : "Pending"}
                positive={orderDetails.isPaid}
              />
              <Badge
                label={
                  orderDetails.isDelivered ? "Delivered" : "Pending Delivery"
                }
                positive={orderDetails.isDelivered}
              />
            </div>
          </div>
        </div>

        {/* ── Payment & Shipping Info ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Payment Info
            </h2>
            <div className="text-sm text-gray-600 space-y-1.5">
              <p>
                <span className="text-gray-400">Method: </span>
                {orderDetails.paymentMethod}
              </p>
              <p>
                <span className="text-gray-400">Status: </span>
                <span
                  className={
                    orderDetails.isPaid
                      ? "text-green-600 font-medium"
                      : "text-amber-600 font-medium"
                  }
                >
                  {orderDetails.isPaid ? "Paid" : "Unpaid"}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Shipping Info
            </h2>
            <div className="text-sm text-gray-600 space-y-1.5">
              <p>
                <span className="text-gray-400">Address: </span>
                {orderDetails.shippingAddress.address},{" "}
                {orderDetails.shippingAddress.city},{" "}
                {orderDetails.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* ── Products ── */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Products
          </h2>

          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 font-medium text-right">Unit Price</th>
                  <th className="py-2 font-medium text-right">Quantity</th>
                  <th className="py-2 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderitems.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-50 last:border-0"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image?.[0]?.url}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <Link
                          to={`/product/${item.productId}`}
                          className="font-medium text-gray-800 hover:text-indigo-600 transition"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      ${item.price}
                    </td>
                    <td className="py-3 text-right text-gray-600">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-semibold text-gray-800">
                      ${item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-4">
            {orderDetails.orderitems.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0"
              >
                <img
                  src={item.image?.[0]?.url}
                  alt={item.name}
                  className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${item.productId}`}
                    className="font-medium text-gray-800 hover:text-indigo-600 transition text-sm"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    ${item.price} × {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  ${item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-end">
            <div className="text-right">
              <p className="text-xs text-gray-400">Order Total</p>
              <p className="text-lg font-bold text-gray-900">${total}</p>
            </div>
          </div>
        </div>

        {/* ── Back link ── */}
        <div>
          <Link
            to="/my-order"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition"
          >
            ← Back to my orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
