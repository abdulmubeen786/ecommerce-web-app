import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const fetchProductByFilters = createAsyncThunk(
  "products/filter",
  async (
    {
      collections,
      sizes,
      colors,
      category,
      brand,
      material, // ✅ ADDED — pehle missing tha
      minPrice,
      maxPrice,
      sortBy,
      gender,
      limit,
      search,
    },
    { rejectWithValue },
  ) => {
    try {
      let query = new URLSearchParams();
      if (collections) query.append("collections", collections);
      if (brand) query.append("brand", brand);
      if (category) query.append("category", category);
      if (gender) query.append("gender", gender);
      if (sizes) query.append("sizes", sizes); // ✅ FIXED — "sizes" backend ke naam se match
      if (colors) query.append("colors", colors); // ✅ FIXED — "colors" backend ke naam se match
      if (material) query.append("material", material); // ✅ ADDED
      if (minPrice) query.append("minPrice", minPrice);
      if (maxPrice) query.append("maxPrice", maxPrice);
      if (sortBy) query.append("sortBy", sortBy);
      if (limit) query.append("limit", limit);
      if (search) query.append("search", search);

      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/products?${query.toString()}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);
export const fetchProductDetails = createAsyncThunk(
  "products/singleProductDetail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/productsingle/${id}`,
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `${BACKEND_URL}/api/update/${id}`,
        productData,
        { withCredentials: true },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchSimilarProducts = createAsyncThunk(
  "products/similarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${BACKEND_URL}/api/product/similar-product/${id}`,
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectProduct: null,
    similarProducts: [],
    loading: false, // ✅ ab sirf updateProduct ke liye
    error: null, // ✅ ab sirf updateProduct ke liye
    detailLoading: false, // ✅ ADD: sirf fetchProductDetails ke liye
    detailError: null, // ✅ ADD: sirf fetchProductDetails ke liye
    filterLoading: false, // ✅ ADD: sirf fetchProductByFilters ke liye
    filterError: null, // ✅ ADD: sirf fetchProductByFilters ke liye
    similarLoading: false, // (pichli baar add kiya tha)
    similarError: null, // (pichli baar add kiya tha)
    filters: {
      collections: "",
      sizes: "",
      colors: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
    },
  },

  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        collections: "",
        sizes: "",
        colors: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder
      // ─── Filter Products ─── ✅ ab apna alag filterLoading/filterError
      .addCase(fetchProductByFilters.pending, (state) => {
        state.filterLoading = true; // ✅ CHANGED
        state.filterError = null; // ✅ CHANGED
      })
      .addCase(fetchProductByFilters.fulfilled, (state, action) => {
        state.filterLoading = false; // ✅ CHANGED
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductByFilters.rejected, (state, action) => {
        state.filterLoading = false; // ✅ CHANGED
        state.filterError = action.payload?.message; // ✅ CHANGED
      })

      // ─── Single Product ─── ✅ ab apna alag detailLoading/detailError
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailLoading = true; // ✅ CHANGED
        state.detailError = null; // ✅ CHANGED
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailLoading = false; // ✅ CHANGED
        state.selectProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailLoading = false; // ✅ CHANGED
        state.detailError = action.payload?.message; // ✅ CHANGED
      })

      // ─── Update Product ─── (waisa hi, koi change nahi)
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id,
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ─── Similar Products ───
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.similarLoading = true;
        state.similarError = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.similarLoading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.similarLoading = false;
        state.similarError = action.payload?.message;
      });
  },
});

export const { setFilters, clearFilters } = productSlice.actions;
export default productSlice.reducer;
