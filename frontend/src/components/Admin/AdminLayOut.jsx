import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayOut = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* mobile top bar */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
        <button
          className="text-xl text-gray-700"
          onClick={toggleSideBar}
          aria-label="Toggle sidebar"
        >
          {isSideBarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* screen overlay */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={toggleSideBar}
        />
      )}

      {/* sidebar */}
      <div
        className={`fixed top-0 left-0 z-40 h-screen w-64 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSideBar />
      </div>

      {/* main content */}
      <div className="md:pl-64">
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayOut;
