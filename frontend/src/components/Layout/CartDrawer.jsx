import { TbXboxXFilled } from "react-icons/tb";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ isCartOpen, cartOpen }) => {
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const userId = user ? user._id : null;
  const navigate = useNavigate();

  // ✅ Bug fix: return lagaya — pehle dono navigate() chal rahe the
  const handleCheckout = () => {
    cartOpen();
    if (!user) {
      navigate("/login?redirect=checkout");
      return;
    }
    navigate("/checkout");
  };

  const hasProducts = cart?.products?.length > 0;

  return (
    <div>
      {/* Overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={cartOpen} />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white shadow-lg z-50 
          transform transition-transform duration-300 flex flex-col 
          ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Your Cart</h2>
          <button
            type="button"
            onClick={cartOpen}
            className="text-gray-600 hover:text-red-500 transition"
          >
            <TbXboxXFilled size={20} />
          </button>
        </div>

        {/* Cart Content — scrollable */}
        <div className="p-4 text-gray-600 flex-1 overflow-y-auto">
          {hasProducts ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
              <p className="text-gray-500 font-medium">Your cart is empty</p>
              <p className="text-xs text-gray-400">Add items to get started</p>
            </div>
          )}
        </div>

        {/* Checkout — fixed at bottom */}
        {hasProducts && (
          <div className="p-4 border-t border-gray-200 bg-white">
            <button
              type="button"
              onClick={handleCheckout}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Checkout
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Shipping, taxes, and discount codes calculated at checkout.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
