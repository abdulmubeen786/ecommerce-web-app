import React, { useEffect } from "react";
import { useFormik } from "formik";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/adminSlice";
import { addUserValidationSchema } from "../../validations/validator";

const UserManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
    if (user && user.role !== "admin") {
      navigate("/");
    }
  }, [dispatch, user, navigate]);
  useEffect(() => {
    if (user && user.role === "admin") {
      dispatch(fetchUsers());
    }
  }, [dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "customer",
    },
    validationSchema: addUserValidationSchema,
    onSubmit: (values, { resetForm }) => {
      dispatch(addUser(values));
      resetForm();
    },
  });

  // ✅ Reusable helper — same pattern as RegisterUser
  const isFieldError = (field) => formik.touched[field] && formik.errors[field];

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, role: newRole }));
  };

  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user"))
      dispatch(deleteUser(userId));
  };

  const inputClasses = (field) =>
    `w-full rounded-lg border px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 transition
    ${
      isFieldError(field)
        ? "border-red-500 focus:border-red-500 focus:ring-red-300 bg-red-50"
        : "border-gray-300 focus:border-gray-500 focus:ring-gray-500"
    }`;

  const labelClasses = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

      {/* add user form */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Add User</h2>
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          noValidate
        >
          <div>
            <label className={labelClasses}>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClasses("name")}
            />
            {isFieldError("name") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClasses("email")}
            />
            {isFieldError("email") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClasses("password")}
            />
            {isFieldError("password") && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <div>
            <label className={labelClasses}>Role</label>
            <select
              name="role"
              value={formik.values.role}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClasses("role")}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
            {isFieldError("role") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
              className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* user list management */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        {error && (
          <div className="bg-red-50 border-b border-red-200 text-red-600 text-sm px-4 py-3">
            {error}
          </div>
        )}
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                    Loading users...
                  </span>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="text-gray-700">
                  <td className="px-4 py-3 font-medium text-gray-900 capitalize">
                    {user.name}
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500"
                    >
                      <option value="customer">Customer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="flex items-center gap-1.5 text-gray-500 hover:text-red-600"
                      aria-label="Delete user"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
