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

const strengthTextColor = {
  Weak: "text-red-300",
  Fair: "text-yellow-300",
  Good: "text-blue-300",
  Strong: "text-green-300",
};

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

  const inputClass = (field) =>
    `w-full rounded-xl px-4 py-3 outline-none transition backdrop-blur-md text-white placeholder:text-white/40
    ${
      isFieldError(field)
        ? "bg-red-500/10 border border-red-400/40 focus:ring-2 focus:ring-red-400/40"
        : "bg-white/5 border border-white/20 focus:ring-2 focus:ring-white/40 focus:bg-white/10"
    }`;

  return (
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
              Join Us
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-wide mb-2 text-center drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)] bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Create Account
          </h1>
          <p className="text-sm sm:text-base text-gray-300/80 text-center mb-8">
            Sign up to get started
          </p>

          {/* ✅ Backend error */}
          {error && (
            <div className="backdrop-blur-md bg-red-500/10 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-5">
              {error}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass("name")}
              />
              {isFieldError("name") && (
                <p className="text-red-300 text-xs mt-1.5">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={inputClass("email")}
              />
              {isFieldError("email") && (
                <p className="text-red-300 text-xs mt-1.5">
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
                  placeholder="Create a strong password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={(e) => {
                    formik.handleBlur(e);
                    setShowRequirements(false);
                  }}
                  onFocus={() => setShowRequirements(true)}
                  className={`${inputClass("password")} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* ✅ Password Strength Bar */}
              {formik.values.password && passwordStrength && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 font-medium ${
                      strengthTextColor[passwordStrength.level]
                    }`}
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
                      <li
                        key={key}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        {passed ? (
                          <CheckCircle2
                            size={13}
                            className="text-green-400 shrink-0"
                          />
                        ) : (
                          <XCircle
                            size={13}
                            className="text-white/25 shrink-0"
                          />
                        )}
                        <span
                          className={
                            passed ? "text-green-300" : "text-white/40"
                          }
                        >
                          {label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}

              {isFieldError("password") && (
                <p className="text-red-300 text-xs mt-1.5">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
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
                  className={`${inputClass("confirmPassword")} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {isFieldError("confirmPassword") && (
                <p className="text-red-300 text-xs mt-1.5">
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !formik.isValid || !formik.dirty}
              className="group relative w-full inline-flex items-center justify-center gap-2 bg-white/90 backdrop-blur-md text-black px-8 py-3.5 rounded-full font-semibold overflow-hidden shadow-[0_8px_30px_rgba(255,255,255,0.25)] hover:shadow-[0_8px_40px_rgba(255,255,255,0.45)] border border-white/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <span className="relative z-10 flex items-center justify-center gap-2">
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
                <>
                  <span className="relative z-10">Register</span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
              {/* Shine sweep effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-black/10 to-transparent" />
            </button>
          </form>

          <p className="text-center text-sm text-gray-300/70 mt-8">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-white font-medium hover:underline"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RegisterUser;
