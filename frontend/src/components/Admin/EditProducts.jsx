import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  fetchProductDetails,
  updateProduct,
} from "../../redux/slices/productSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EditProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectProduct, loading, error } = useSelector(
    (state) => state.products,
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    colors: [],
    sizes: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); //image upload
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectProduct) {
      setProductData(selectProduct);
    }
  }, [selectProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImage = { url: data.imageUrl };
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, newImage],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  const inputClasses =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500";
  const labelClasses = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        {/* name */}
        <div>
          <label className={labelClasses}>Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
            className={inputClasses}
          />
        </div>

        {/* description */}
        <div>
          <label className={labelClasses}>Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            required
            rows={4}
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* price */}
          <div>
            <label className={labelClasses}>Price</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* count in stock */}
          <div>
            <label className={labelClasses}>Count In Stock</label>
            <input
              type="number"
              name="countInStock"
              value={productData.countInStock}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* sku */}
          <div>
            <label className={labelClasses}>SKU</label>
            <input
              type="text"
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              required
              className={inputClasses}
            />
          </div>

          {/* sizes */}
          <div>
            <label className={labelClasses}>Sizes (comma separated)</label>
            <input
              type="text"
              name="sizes"
              value={productData.sizes.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                })
              }
              required
              className={inputClasses}
            />
          </div>

          {/* colors */}
          <div className="sm:col-span-2">
            <label className={labelClasses}>Colors (comma separated)</label>
            <input
              type="text"
              name="colors"
              value={productData.colors.join(", ")}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  colors: e.target.value
                    .split(",")
                    .map((color) => color.trim()),
                })
              }
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* image upload */}
        <div>
          <label className={labelClasses}>Upload Image</label>

          <div className="flex flex-wrap gap-3">
            {productData.images.map((image, index) => (
              <div
                key={index}
                className="group relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={image.url}
                  alt={image.altText || "product image"}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove image"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            ))}

            <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-500">
              <FaUpload />
              <span className="text-xs">
                {uploading ? "Uploading..." : "Upload"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 sm:w-auto disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProducts;
