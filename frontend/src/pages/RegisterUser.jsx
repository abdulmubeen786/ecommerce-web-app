import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { registerUser } from "../redux/slices/authSlice";
import { mergeCart } from "../redux/slices/cartSlice";
import { signupValidationSchema } from "../validations/validator";

// ✅ Password strength checker
const getPasswordStrength = (password) => {
  if (!password) return null;
  const passed = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
    /[!@#$%^&*]/.test(password),
  ].filter(Boolean).length;

  if (passed <= 2)
    return { level: "Weak", color: "bg-red-500", width: "w-1/4" };
  if (passed <= 3)
    return { level: "Fair", color: "bg-yellow-500", width: "w-2/4" };
  if (passed <= 4)
    return { level: "Good", color: "bg-blue-500", width: "w-3/4" };
  return { level: "Strong", color: "bg-green-500", width: "w-full" };
};

// ✅ Password requirements list
const passwordRequirements = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  {
    key: "uppercase",
    label: "One uppercase letter (A-Z)",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    key: "lowercase",
    label: "One lowercase letter (a-z)",
    test: (p) => /[a-z]/.test(p),
  },
  { key: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
  {
    key: "special",
    label: "One special character (!@#$%^&*)",
    test: (p) => /[!@#$%^&*]/.test(p),
  },
];

const RegisterUser = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cart } = useSelector((state) => state.cart);
  const { loading, error, user, guestId } = useSelector((state) => state.auth);

  // ✅ redirect parameter — same pattern as Login
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // ✅ Register ke baad redirect — Login jaisa hi mergeCart logic
  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupValidationSchema,
    onSubmit: (values) => {
      const { confirmPassword, ...data } = values; // ✅ confirmPassword backend ko mat bhejo
      dispatch(registerUser(data));
    },
  });

  // ✅ Reusable helper
  const isFieldError = (field) => formik.touched[field] && formik.errors[field];

  const passwordStrength = getPasswordStrength(formik.values.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-500 text-center text-sm mb-6">
          Sign up to get started
        </p>

        {/* ✅ Backend error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
            {error}
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 transition
                ${
                  isFieldError("name")
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-black"
                }`}
            />
            {isFieldError("name") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 transition
                ${
                  isFieldError("email")
                    ? "border-red-500 focus:ring-red-300 bg-red-50"
                    : "border-gray-300 focus:ring-black"
                }`}
            />
            {isFieldError("email") && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a strong password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setShowRequirements(false);
                }}
                onFocus={() => setShowRequirements(true)}
                className={`w-full border rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 transition
                  ${
                    isFieldError("password")
                      ? "border-red-500 focus:ring-red-300 bg-red-50"
                      : "border-gray-300 focus:ring-black"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* ✅ Password Strength Bar */}
            {formik.values.password && passwordStrength && (
              <div className="mt-2">
                <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                  />
                </div>
                <p
                  className={`text-xs mt-1 font-medium
                  ${passwordStrength.level === "Weak" ? "text-red-500" : ""}
                  ${passwordStrength.level === "Fair" ? "text-yellow-600" : ""}
                  ${passwordStrength.level === "Good" ? "text-blue-600" : ""}
                  ${passwordStrength.level === "Strong" ? "text-green-600" : ""}
                `}
                >
                  Password strength: {passwordStrength.level}
                </p>
              </div>
            )}

            {/* ✅ Password Requirements Checklist */}
            {(showRequirements || formik.values.password) && (
              <ul className="mt-2 space-y-1">
                {passwordRequirements.map(({ key, label, test }) => {
                  const passed = test(formik.values.password);
                  return (
                    <li key={key} className="flex items-center gap-1.5 text-xs">
                      {passed ? (
                        <CheckCircle2
                          size={13}
                          className="text-green-500 shrink-0"
                        />
                      ) : (
                        <XCircle size={13} className="text-gray-300 shrink-0" />
                      )}
                      <span
                        className={passed ? "text-green-600" : "text-gray-400"}
                      >
                        {label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {isFieldError("password") && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 transition
                  ${
                    isFieldError("confirmPassword")
                      ? "border-red-500 focus:ring-red-300 bg-red-50"
                      : "border-gray-300 focus:ring-black"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isFieldError("confirmPassword") && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formik.isValid || !formik.dirty}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
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
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-600 hover:underline font-medium"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterUser;
