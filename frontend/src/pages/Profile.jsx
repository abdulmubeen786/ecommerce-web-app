import React, { useEffect } from "react";
import OrderDetail from "./OrderDetail";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { logout } from "../redux/slices/authSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");

    if (!confirmLogout) return;

    dispatch(clearCart());
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side - Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-fit">
            <div className="bg-black text-white px-6 py-8 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-bold uppercase shadow-md">
                {user?.name?.charAt(0)}
              </div>

              <h2 className="mt-4 text-2xl font-semibold capitalize">
                {user?.name}
              </h2>

              <p className="text-gray-300 text-sm mt-1">{user?.email}</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="border rounded-xl p-4 bg-gray-50">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Account Status
                  </p>
                  <p className="font-semibold text-green-600 mt-1">Active</p>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-black text-white font-medium hover:bg-gray-800 transition duration-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="border-b px-6 py-5 bg-gray-50">
              <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
              <p className="text-sm text-gray-500 mt-1">
                View and track all your recent purchases.
              </p>
            </div>

            <div className="p-6">
              <OrderDetail />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
