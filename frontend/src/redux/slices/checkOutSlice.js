import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// ── Step 1: Create checkout (address submit ke baad) ──────────
export const createCheckout = createAsyncThunk(
  "checkout/create",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        checkoutData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || "Checkout failed",
      );
    }
  },
);

// ── Step 2: Payment confirm hone ke baad checkout ko "paid" mark karna ──
export const payCheckout = createAsyncThunk(
  "checkout/pay",
  async ({ checkoutId, paymentDetail }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid", // backend isi field ko check karta hai
          paymentDetail,
        },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Payment update failed",
      );
    }
  },
);

// ── Step 3: Checkout ko final Order mein convert karna ─────────
export const finalizeCheckout = createAsyncThunk(
  "checkout/finalize",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Order finalization failed",
      );
    }
  },
);

// ── Step 2 (new): Stripe payment session start karna ──────────
export const startStripePayment = createAsyncThunk(
  "checkout/startStripePayment",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/payment`,
        { checkoutId },
        { withCredentials: true },
      );
      return response.data; // { url }
      // console.log(response.data);
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Payment session failed",
      );
    }
  },
);

const checkOutSlice = createSlice({
  name: "checkout",
  initialState: {
    stripe: null,
    checkout: null,
    finalOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
      state.finalOrder = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // createCheckout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // payCheckout
      .addCase(payCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // finalizeCheckout
      .addCase(finalizeCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.finalOrder = action.payload;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // startStripePayment ✅ ADD THIS
      .addCase(startStripePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startStripePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.stripe = action.payload;
      })
      .addCase(startStripePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCheckout } = checkOutSlice.actions;
export default checkOutSlice.reducer;
