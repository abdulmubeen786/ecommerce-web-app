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
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md"
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
    className="flex items-start gap-3 backdrop-blur-md bg-red-500/10 border border-red-400/30 text-red-100 rounded-xl px-4 py-3 mb-5"
  >
    <XCircle
      size={18}
      className="mt-0.5 shrink-0 text-red-300"
      aria-hidden="true"
    />
    <div className="flex-1 text-sm leading-snug">
      <p className="font-semibold mb-0.5 text-red-200">Login failed</p>
      <p className="text-red-200/80">{message}</p>
    </div>
    <button
      type="button"
      onClick={onDismiss}
      aria-label="Dismiss error"
      className="text-red-300/70 hover:text-red-100 transition shrink-0"
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

      <section className="relative w-full min-h-screen overflow-hidden flex items-center justify-center px-4 py-16 bg-black">
        {/* Ambient background glow — echoes Hero's dark gradient language */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900 via-black to-neutral-950" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative w-full max-w-md">
          <div className="backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-6 py-8 sm:px-10 sm:py-10">
            {/* Glass badge */}
            <div className="flex justify-center mb-5">
              <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wider uppercase backdrop-blur-md bg-white/10 border border-white/20 shadow-lg text-white/90">
                Welcome Back
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide mb-2 text-center drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
              Login
            </h1>
            <p className="text-sm sm:text-base text-gray-300/80 text-center mb-8">
              Sign in to your account
            </p>

            {/* Error banner */}
            {showError && (
              <ErrorBanner
                message={error}
                onDismiss={() => setDismissedError(true)}
              />
            )}

            <form
              onSubmit={formik.handleSubmit}
              className="space-y-5"
              noValidate
            >
              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full rounded-xl px-4 py-3 outline-none transition backdrop-blur-md text-white placeholder:text-white/40
                    ${
                      isFieldError("email")
                        ? "bg-red-500/10 border border-red-400/40 focus:ring-2 focus:ring-red-400/40"
                        : "bg-white/5 border border-white/20 focus:ring-2 focus:ring-white/40 focus:bg-white/10"
                    }`}
                />
                {isFieldError("email") && (
                  <p className="flex items-center gap-1 text-red-300 text-xs mt-1.5">
                    <AlertCircle size={12} aria-hidden="true" />
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-xl px-4 py-3 pr-11 outline-none transition backdrop-blur-md text-white placeholder:text-white/40
                      ${
                        isFieldError("password")
                          ? "bg-red-500/10 border border-red-400/40 focus:ring-2 focus:ring-red-400/40"
                          : "bg-white/5 border border-white/20 focus:ring-2 focus:ring-white/40 focus:bg-white/10"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {isFieldError("password") && (
                  <p className="flex items-center gap-1 text-red-300 text-xs mt-1.5">
                    <AlertCircle size={12} aria-hidden="true" />
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-white/70 hover:text-white hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !formik.isValid || !formik.dirty}
                className="group relative w-full inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md text-black px-8 py-3.5 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)] border border-white/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">Login</span>
                <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
                {/* Shine sweep effect */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              </button>
            </form>

            <p className="text-center text-sm text-gray-300/70 mt-8">
              Don't have an account?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-white font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LogIn;
