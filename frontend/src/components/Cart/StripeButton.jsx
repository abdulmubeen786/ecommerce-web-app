import { useDispatch, useSelector } from "react-redux";
import { startStripePayment } from "../../redux/slices/checkOutSlice";

const StripeButton = () => {
  const dispatch = useDispatch();
  const { checkout, loading } = useSelector((state) => state.checkout);

  const handleClick = async () => {
    if (!checkout?._id) return;

    const result = await dispatch(startStripePayment(checkout._id));

    if (!result.error) {
      window.location.href = result.payload.url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition text-sm disabled:opacity-50"
    >
      {loading ? "Redirecting..." : "Pay with Stripe"}
    </button>
  );
};

export default StripeButton;
