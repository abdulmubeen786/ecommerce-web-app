import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// fetch All products by admin
export const fetchAdminProducts = createAsyncThunk(
  "admin/allproducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/admin/products`,
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

// add prroduts only admin
export const addAdminProduct = createAsyncThunk(
  "admin/addproducts",
  async (productData, rejectWithValue) => {
    try {
      const response = await axiosInstance.post(
        `${BACKEND_URL}/api/products`,
        productData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

// update product admin only

export const adminUpdateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, productData }, rejectWithValue) => {
    try {
      const response = await axiosInstance.put(
        `${BACKEND_URL}/update/${id}`,
        productData,
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

// delete product admin only

export const adminDeleteProduct = createAsyncThunk(
  "admin/deleteproduct",
  async (id, { rejectWithValue }) => {
    // ✅ sahi destructuring
    try {
      await axiosInstance.delete(`${BACKEND_URL}/api/delete/${id}`, {
        withCredentials: true,
      });
      return id; // ✅ id return karo, taake reducer ka filter kaam kare
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);
const adminProductSlice = createSlice({
  name: "admin/products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error;
      })
      // add admin products
      .addCase(addAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(addAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // update products
      .addCase(adminUpdateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const productIndex = action.payload;
        const index = state.products.findIndex(
          (p) => p._id === productIndex._id,
        );
        if (index !== -1) {
          state.products[index] = productIndex;
        }
      })
      .addCase(adminUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // delet produc admin only
      .addCase(adminDeleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(adminDeleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default adminProductSlice.reducer;
