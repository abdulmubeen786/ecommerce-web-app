import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// fetch all orders admin only
export const fetchALLOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/admin/order`,
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

// updte order status admin only
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BACKEND_URL}/api/admin/order/${id}`,
        {
          status,
        },
        { withCredentials: true },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

// delete order admin only

export const deleteOrder = createAsyncThunk(
  "admin/orderDelete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BACKEND_URL}/admin/order/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

const adminOrderSlice = createSlice({
  name: "admin/order",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all orders
      .addCase(fetchALLOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchALLOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        const totalSales = action.payload.reduce((accu, order) => {
          return accu + order.totalPrice;
        }, 0);
        state.totalSales = totalSales;
      })
      .addCase(fetchALLOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updateorder = action.payload;
        const orderIndex = state.orders.findIndex(
          (p) => p._id === updateorder._id,
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updateorder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      //   delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminOrderSlice.reducer;
