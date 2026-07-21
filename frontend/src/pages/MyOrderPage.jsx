import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockOrders = [
        {
          _id: "2334",
          createdAt: new Date(),
          shippingAddress: { city: "Karachi", country: "USA" },
          orderItems: [
            { name: "Product 1", image: "https://picsum.photos/200?random=2" },
          ],
          totalPrice: 2000,
          isPaid: true,
        },
        {
          _id: "23343",
          createdAt: new Date(),
          shippingAddress: { city: "Karachi", country: "USA" },
          orderItems: [
            { name: "Product 1", image: "https://picsum.photos/200?random=1" },
          ],
          totalPrice: 2000,
          isPaid: false,
        },
      ];
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const Badge = ({ paid }) => (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        paid ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {paid ? "Paid" : "Pending"}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 mb-6">My Orders</h1>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-400 border-b border-gray-100">
                  <th className="px-6 py-3 font-medium">Order</th>
                  <th className="px-6 py-3 font-medium">Created</th>
                  <th className="px-6 py-3 font-medium">Shipping Address</th>
                  <th className="px-6 py-3 font-medium text-center">Items</th>
                  <th className="px-6 py-3 font-medium text-right">Price</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => navigate(`/order/${order._id}`)}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={order.orderItems[0].image}
                            alt={order.orderItems[0].name}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                          />
                          <span className="font-medium text-gray-800">
                            #{order._id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.shippingAddress
                          ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-center text-gray-500">
                        {order.orderItems.length}
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">
                        ${order.totalPrice}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge paid={order.isPaid} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-sm text-gray-400"
                    >
                      You have no orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="sm:hidden divide-y divide-gray-50">
            {loading ? (
              <p className="px-4 py-10 text-center text-sm text-gray-400">
                Loading orders...
              </p>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="flex items-center gap-3 px-4 py-4 active:bg-gray-50 cursor-pointer"
                >
                  <img
                    src={order.orderItems[0].image}
                    alt={order.orderItems[0].name}
                    className="w-14 h-14 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm">
                      #{order._id}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.country} ·{" "}
                      {order.orderItems.length} item
                      {order.orderItems.length > 1 ? "s" : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-gray-800 mb-1">
                      ${order.totalPrice}
                    </p>
                    <Badge paid={order.isPaid} />
                  </div>
                </div>
              ))
            ) : (
              <p className="px-4 py-10 text-center text-sm text-gray-400">
                You have no orders yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
