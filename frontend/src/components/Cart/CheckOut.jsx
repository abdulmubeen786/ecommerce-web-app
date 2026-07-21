import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createCheckout,
  clearCheckout,
  startStripePayment,
} from "../../redux/slices/checkOutSlice";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const { checkout, finalOrder, loading, error } = useSelector(
    (state) => state.checkout,
  );

  const [showPayment, setShowPayment] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handlestripePayment = async () => {
    if (!checkout._id) return;
    localStorage.setItem("pendingCheckoutId", checkout._id);
    const result = await dispatch(startStripePayment(checkout._id));
    if (!result.error) {
      window.location.href = result.payload.url;
    }
  };

  useEffect(() => {
    if (finalOrder?._id) {
      navigate(`/order-confirmation`);
      dispatch(clearCheckout());
    }
  }, [finalOrder, navigate, dispatch, handlestripePayment]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      createCheckout({
        checkoutItems: cart.products.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        paymentMethod: "Stripe",
        totalPrice: cart.totalPrice,
      }),
    );

    if (!result.error) {
      setShowPayment(true);
    }
  };

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-3 py-2.5 mt-1 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition";

  const labelClass = "block text-sm font-medium text-gray-600";

  const handleAddress = (field) => (e) =>
    setShippingAddress((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleAddressSubmit} className="space-y-6">
            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Contact Details
              </h3>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                value={user?.email || ""}
                readOnly
                className={`${inputClass} bg-gray-50 cursor-not-allowed text-gray-500`}
              />
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Delivery Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      required
                      value={shippingAddress.firstName}
                      onChange={handleAddress("firstName")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      required
                      value={shippingAddress.lastName}
                      onChange={handleAddress("lastName")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Address</label>
                  <input
                    type="text"
                    placeholder="Street address"
                    required
                    value={shippingAddress.address}
                    onChange={handleAddress("address")}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      placeholder="Karachi"
                      required
                      value={shippingAddress.city}
                      onChange={handleAddress("city")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <input
                      type="text"
                      placeholder="Pakistan"
                      required
                      value={shippingAddress.country}
                      onChange={handleAddress("country")}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input
                      type="text"
                      placeholder="75000"
                      required
                      value={shippingAddress.postalCode}
                      onChange={handleAddress("postalCode")}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      type="tel"
                      placeholder="+92 300 0000000"
                      required
                      value={shippingAddress.phone}
                      onChange={handleAddress("phone")}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ CHANGE: styled + loading state add kiya, baaki logic same */}
            {!showPayment ? (
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Pay with Stripe"
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlestripePayment}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white text-sm font-semibold px-6 py-3 rounded-xl transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Redirecting to Stripe...
                  </>
                ) : (
                  "Pay Now"
                )}
              </button>
            )}
          </form>
        </div>

        <div className="w-full lg:w-80 xl:w-96 bg-white border border-gray-100 shadow-sm rounded-2xl p-6 sm:p-8 lg:sticky lg:top-8">
          <h2 className="text-base font-semibold text-gray-900 mb-5">
            Order Summary
          </h2>

          <div className="space-y-4 mb-6">
            {cart?.products?.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <img
                  src={item.image[0]?.url}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Size: {item.size} · Color: {item.color} · Qty:{" "}
                    {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  ${item.price}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${cart?.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Delivery</span>
              <span className="text-green-600 font-medium">Free</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-gray-900 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>${cart?.totalPrice?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
