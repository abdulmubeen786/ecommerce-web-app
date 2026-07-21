import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, AlertCircle, XCircle } from "lucide-react";
import { loginUser } from "../redux/slices/authSlice";
import { loginValidationSchema } from "../validations/validator";
import { mergeCart } from "../redux/slices/cartSlice";

// ─── Full-screen loading overlay ─────────────────────────────────────────────
const LoadingOverlay = () => (
  <div
    role="status"
    aria-live="polite"
    aria-label="Signing in, please wait"
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm"
  >
    <svg
      className="animate-spin h-10 w-10 text-white mb-4"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
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
    <p className="text-white text-sm font-medium tracking-wide">Signing in…</p>
  </div>
);

// ─── Error banner ─────────────────────────────────────────────────────────────
const ErrorBanner = ({ message, onDismiss }) => (
  <div
    role="alert"
    className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-5"
  >
    <XCircle
      size={18}
      className="mt-0.5 shrink-0 text-red-500"
      aria-hidden="true"
    />
    <div className="flex-1 text-sm leading-snug">
      <p className="font-semibold mb-0.5">Login failed</p>
      <p className="text-red-600">{message}</p>
    </div>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss error"
      className="text-red-400 hover:text-red-600 transition shrink-0"
    >
      <XCircle size={16} />
    </button>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [dismissedError, setDismissedError] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = useSelector((state) => state.cart);
  const { loading, error, user, guestId } = useSelector((state) => state.auth); // ✅ FIX: guetsId -> guestId

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  // Reset dismissed state whenever a new error arrives
  useEffect(() => {
    if (error) setDismissedError(false);
  }, [error]);

  // Redirect after successful login
  useEffect(() => {
    if (!user) return;
    if (cart?.products.length > 0 && guestId) {
      dispatch(mergeCart({ guestId })).then(() => {
        // ✅ FIX: guetsId:user -> guestId
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      });
    } else {
      navigate(isCheckoutRedirect ? "/checkout" : "/");
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]); // ✅ FIX: dep array

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      setDismissedError(false);
      dispatch(loginUser(values));
    },
  });

  const isFieldError = (field) => formik.touched[field] && formik.errors[field];
  const showError = error && !dismissedError;

  return (
    <>
      {/* Loading overlay — rendered outside the card so it covers full screen */}
      {loading && <LoadingOverlay />}

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border">
          <h1 className="text-3xl font-semibold text-center mb-2">Login</h1>
          <p className="text-gray-500 text-center mb-6">
            Sign in to your account
          </p>

          {/* Error banner */}
          {showError && (
            <ErrorBanner
              message={error}
              onDismiss={() => setDismissedError(true)}
            />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
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
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} aria-hidden="true" />
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
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
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {isFieldError("password") && (
                <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <AlertCircle size={12} aria-hidden="true" />
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <button type="button" className="text-blue-600 hover:underline">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-600 hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default LogIn;
