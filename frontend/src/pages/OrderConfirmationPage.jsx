import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { payCheckout, finalizeCheckout } from "../redux/slices/checkOutSlice";
import { clearCart } from "../redux/slices/cartSlice"; // ✅ ADD
import { FaCcStripe } from "react-icons/fa";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasRun = useRef(false); // ✅ ADD: strict-mode / re-render mein dobara call na ho

  const { finalOrder, loading, error } = useSelector((state) => state.checkout); // ✅ ADD

  // ✅ ADD: Stripe se wapas aane par pay + finalize trigger karo
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const sessionId = searchParams.get("session_id");
    const checkoutId = localStorage.getItem("pendingCheckoutId");

    if (!sessionId || !checkoutId) {
      navigate("/cart");
      return;
    }

    const confirmOrder = async () => {
      const payResult = await dispatch(
        payCheckout({
          checkoutId,
          paymentDetail: { sessionId, provider: "stripe" },
        }),
      );

      if (payResult.error) return;

      const finalizeResult = await dispatch(finalizeCheckout(checkoutId));

      if (!finalizeResult.error) {
        localStorage.removeItem("pendingCheckoutId");
        dispatch(clearCart());
      }
    };

    confirmOrder();
  }, [dispatch, navigate, searchParams]);

  const calculateDelivery = (createdAt) => {
    const date = new Date(createdAt);
    date.setDate(date.getDate() + 10);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // ✅ ADD: jab tak confirm nahi hota, loading/error dikhao
  if (loading || !finalOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        {error ? (
          <p className="text-red-600 text-sm">{error}</p>
        ) : (
          <p className="text-gray-500 text-sm">Confirming your order...</p>
        )}
      </div>
    );
  }

  const checkout = finalOrder; // ✅ CHANGE: dummy object ki jagah real data
  const totalPrice = checkout.totalPrice; // ✅ CHANGE: reduce hataya, backend se aaya total use kiya

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* ── Success Header ── */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Thank you for your order!
          </h1>
          <p className="text-sm text-gray-500">
            A confirmation has been sent to your email.
          </p>

          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3 sm:gap-8 text-sm">
            <div>
              <span className="text-gray-400">Order ID</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                #{checkout._id}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Order Date</span>
              <p className="font-semibold text-gray-800 mt-0.5">
                {new Date(checkout.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <span className="text-gray-400">Estimated Delivery</span>
              <p className="font-semibold text-indigo-600 mt-0.5">
                {calculateDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ── Order Items ── */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Order Items
          </h2>
          <div className="space-y-4">
            {checkout.orderitems.map(
              (
                item,
                index, // ✅ CHANGE: checkoutItems → orderitems (Order model ka field)
              ) => (
                <div
                  key={index}
                  className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <img
                    src={item.image?.[0]?.url || item.image} // ✅ CHANGE: dono format handle
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.color} · {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800">
                    ${item.price * item.quantity}
                  </p>
                </div>
              ),
            )}
          </div>

          {/* Total */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="space-y-1 text-sm text-gray-500">
              <div className="flex justify-between gap-16">
                <span>Subtotal</span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between gap-16">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-between text-base font-bold text-gray-900">
            <span>Total</span>
            <span>${totalPrice}</span>
          </div>
        </div>

        {/* ── Payment & Delivery ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Payment
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <FaCcStripe />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700">
                {checkout.paymentMethod}{" "}
                {/* ✅ CHANGE: hardcoded "PayPal" hataya */}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Delivery Address
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>{checkout.shippingAddress.address}</p>
              <p>
                {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>

        {/* ── Continue Shopping ── */}
        <div className="text-center pb-4">
          <a
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-8 py-3 rounded-xl transition"
          >
            Continue Shopping
          </a>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
