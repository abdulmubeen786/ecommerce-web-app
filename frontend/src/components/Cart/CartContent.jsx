import React from "react";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { cartDelete, updateCart } from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const totalPrice = cart.products.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (quantity >= 1) {
      dispatch(
        updateCart({
          productId,
          quantity: newQuantity,
          userId,
          guestId,
          size,
          color,
        }),
      );
    }
  };

  const handleRemoveCart = (productId, size, color, userId, guestId) => {
    dispatch(cartDelete({ productId, size, color, userId, guestId }));
  };

  return (
    <div className="flex flex-col gap-4">
      {cart.products.map((item, index) => (
        <div
          key={index}
          className="flex gap-4 border border-gray-200 rounded-xl p-4 bg-white shadow-sm"
        >
          {/* Product Image */}
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <img
              src={item.image?.[0]?.url}
              alt={item.image?.[0]?.altText || item.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-base font-semibold text-gray-800">
                  {item.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {item.size} - {item.color}
                </p>
              </div>

              <button
                onClick={() =>
                  handleRemoveCart(
                    item.productId,
                    item.size,
                    item.color,
                    userId,
                    guestId,
                  )
                }
                className="text-gray-400 hover:text-red-500 transition"
              >
                <MdDelete size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-4">
              {/* Quantity */}
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  onClick={() =>
                    handleAddToCart(
                      item.productId,
                      -1,
                      item.quantity,
                      item.size,
                      item.color,
                    )
                  }
                  className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-4 text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      item.productId,
                      +1,
                      item.quantity,
                      item.size,
                      item.color,
                    )
                  }
                  className="px-3 py-1 text-gray-700 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>

              {/* Item Price */}
              <h2 className="text-base font-semibold text-gray-900">
                ${item.price.toLocaleString()}
              </h2>
            </div>
          </div>
        </div>
      ))}

      {/* Total Price */}
      <div className="border-t border-gray-200 pt-4 mt-2 flex items-center justify-between">
        <span className="text-base font-medium text-gray-600">Total</span>
        <span className="text-xl font-bold text-gray-900">
          ${totalPrice.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default CartContent;
