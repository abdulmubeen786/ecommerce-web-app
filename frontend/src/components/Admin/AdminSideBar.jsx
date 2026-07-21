import React from "react";
import { FaBoxOpen, FaSignOutAlt, FaStore, FaUser } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const AdminSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-gray-900 text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className="flex h-full w-full flex-col justify-between bg-white border-r border-gray-200 px-4 py-6">
      <div>
        <div className="mb-8 px-2">
          <Link to={"/admin"} className="text-xl font-bold text-gray-900">
            Shopify
          </Link>
          <h1 className="mt-1 text-sm text-gray-500">Admin dashboard</h1>
        </div>

        <nav className="flex flex-col gap-1">
          <NavLink to={"/admin/user"} className={linkClasses}>
            <FaUser className="text-base" />
            <span>User</span>
          </NavLink>
          <NavLink to={"/admin/products"} className={linkClasses}>
            <FaBoxOpen className="text-base" />
            <span>Products</span>
          </NavLink>
          <NavLink to={"/admin/orders"} className={linkClasses}>
            <FaClipboardList className="text-base" />
            <span>Orders</span>
          </NavLink>
          <NavLink to={"/"} className={linkClasses}>
            <FaStore className="text-base" />
            <span>Store</span>
          </NavLink>
        </nav>
      </div>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        <FaSignOutAlt className="text-base" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AdminSideBar;
