import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axiosInstance from "../../utils/axiosInstance";

const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] }; // ✅
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart)); // ✅
};

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // ✅

// Fetch cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/api/cart`, {
        params: { userId, guestId },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Add to cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { productId, color, size, quantity, guestId, userId },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/api/cart`,
        { productId, size, color, quantity, userId, guestId },
        { withCredentials: true },
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Update cart
export const updateCart = createAsyncThunk(
  "cart/update",
  async (
    { productId, size, color, quantity, userId, guestId },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.put(
        `${BACKEND_URL}/api/cart`, // ✅ sahi URL
        { productId, size, color, quantity, userId, guestId },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Delete from cart
export const cartDelete = createAsyncThunk(
  "cart/deleteCart",
  async ({ productId, size, color, userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance({
        method: "DELETE",
        url: `${BACKEND_URL}/api/cart`,
        data: { productId, size, color, guestId, userId },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

// Merge cart
export const mergeCart = createAsyncThunk(
  "cart/merge",
  async ({ guestId, userId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/api/cart/merge`, // ✅ sahi URL
        { guestId, userId },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    error: null,
    loading: false, // ✅ false hona chahiye shuru mein
  },

  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] }; // ✅
      localStorage.removeItem("cart"); // ✅
      localStorage.removeItem("guestId");
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true; // ✅
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Cart fetch failed";
      })

      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true; // ✅
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Add to cart failed";
      })

      // Update cart
      .addCase(updateCart.pending, (state) => {
        state.loading = true; // ✅
        state.error = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update cart failed";
      })

      // Delete cart
      .addCase(cartDelete.pending, (state) => {
        state.loading = true; // ✅
        state.error = null;
      })
      .addCase(cartDelete.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(cartDelete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Delete cart failed";
      })

      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true; // ✅
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Merge cart failed";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
