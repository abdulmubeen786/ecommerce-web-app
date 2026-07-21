import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// async thunk to fetch user orders
export const fetchUserOrders = createAsyncThunk(
  "orders/fetchuserorders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BACKEND_URL}/api/my-order`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.message);
    }
  },
);

// fetch order detail by id;
export const fetchorderdetail = createAsyncThunk(
  "order/orderdetail",
  async (orderid, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/order/${orderid}`,
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
const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    totalorders: 0,
    orderdetail: null,
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch order details
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      // order detail
      .addCase(fetchorderdetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchorderdetail.fulfilled, (state, action) => {
        state.loading = false;
        state.orderdetail = action.payload;
      })
      .addCase(fetchorderdetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

export default orderSlice.reducer;
