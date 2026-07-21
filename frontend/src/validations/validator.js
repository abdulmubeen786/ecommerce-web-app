import * as Yup from "yup";

// ============================================
// ✅ Reusable Email Schema
// ============================================
const emailSchema = Yup.string()
  .required("Email is required")
  .email("Invalid email format")
  .matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    "Please enter a valid email address",
  )
  .max(254, "Email cannot exceed 254 characters")
  .test(
    "no-consecutive-dots",
    "Email cannot contain consecutive dots",
    (value) => (value ? !value.includes("..") : true),
  )
  .test("valid-domain", "Email domain is not valid", (value) => {
    if (!value) return true;
    const domain = value.split("@")[1];
    return domain
      ? domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".")
      : false;
  })
  .lowercase()
  .trim();

// ============================================
// ✅ Reusable Password Schema
// ============================================
const passwordSchema = Yup.string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .max(32, "Password cannot exceed 32 characters")
  .matches(/[A-Z]/, "Must contain at least one uppercase letter")
  .matches(/[a-z]/, "Must contain at least one lowercase letter")
  .matches(/[0-9]/, "Must contain at least one number")
  .matches(
    /[!@#$%^&*]/,
    "Must contain at least one special character (!@#$%^&*)",
  );

// ============================================
// ✅ Login Schema
// ============================================
export const loginValidationSchema = Yup.object({
  email: emailSchema,
  password: passwordSchema,
});

// ============================================
// ✅ Signup Schema
// ============================================
export const signupValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
});

// ============================================
// ✅ Admin - Add User Schema
// ============================================
export const addUserValidationSchema = Yup.object({
  name: Yup.string()
    .required("Name is required")
    .min(6, "Name must be at least 6 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
    .trim(),
  email: emailSchema,
  password: passwordSchema,
  role: Yup.string()
    .required("Role is required")
    .oneOf(["customer", "admin"], "Invalid role selected"),
});
