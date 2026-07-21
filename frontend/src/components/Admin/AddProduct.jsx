import { useState } from "react";
import { FaTrash, FaUpload, FaBoxOpen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addAdminProduct } from "../../redux/slices/adminProductSlice";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const initialFormState = {
  name: "",
  description: "",
  price: "",
  discountPrice: "",
  countInStock: "",
  category: "",
  brand: "",
  sizes: "",
  colors: "",
  collections: "",
  material: "",
  gender: "",
  images: [],
  isFeatured: false,
  isPublished: false,
  tags: "",
  dimension: {
    length: "",
    width: "",
    height: "",
  },
  weight: "",
  sku: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
};

const inputClasses =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 transition-colors";
const labelClasses = "mb-1 block text-sm font-medium text-gray-700";
const sectionClasses =
  "space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm";
const sectionTitleClasses =
  "text-sm font-semibold uppercase tracking-wide text-gray-500 border-b border-gray-100 pb-2";

const AddProduct = () => {
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.adminProduct);

  const [formData, setFormData] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "length" || name === "width" || name === "height") {
      setFormData((prev) => ({
        ...prev,
        dimension: { ...prev.dimension, [name]: value },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadData = new FormData();
      uploadData.append("image", file);

      const { data } = await axios.post(
        `${BACKEND_URL}/api/upload`,
        uploadData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const newImage = { url: data.imageUrl };
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage],
      }));
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    // comma-separated strings ko arrays mein convert karna (backend arrays expect karta hai)
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice
        ? Number(formData.discountPrice)
        : undefined,
      countInStock: Number(formData.countInStock),
      weight: formData.weight ? Number(formData.weight) : undefined,
      sizes: formData.sizes
        ? formData.sizes.split(",").map((s) => s.trim())
        : [],
      colors: formData.colors
        ? formData.colors.split(",").map((c) => c.trim())
        : [],
      // schema: material is [String], pehle single string bhej rahe the — array mein convert
      material: formData.material
        ? formData.material.split(",").map((m) => m.trim())
        : [],
      tags: formData.tags ? formData.tags.split(",").map((t) => t.trim()) : [],
    };

    const result = await dispatch(addAdminProduct(payload));

    if (addAdminProduct.fulfilled.match(result)) {
      setSuccessMsg("Product successfully added");
      setFormData(initialFormState);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white">
          <FaBoxOpen />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {typeof error === "string" ? error : "Kuch ghalat ho gaya"}
        </p>
      )}
      {successMsg && (
        <p className="rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
          {successMsg}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Basic Information</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              className={inputClasses}
            />
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Pricing &amp; Stock</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className={labelClasses}>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Discount Price</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Count In Stock</label>
              <input
                type="number"
                name="countInStock"
                value={formData.countInStock}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Classification</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Collections</label>
              <input
                type="text"
                name="collections"
                value={formData.collections}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Material (comma separated)</label>
              <input
                type="text"
                name="material"
                placeholder="Cotton, Polyester"
                value={formData.material}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClasses}
              >
                <option value="">Select</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                placeholder="summer, casual"
                value={formData.tags}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Variants</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Sizes (comma separated)</label>
              <input
                type="text"
                name="sizes"
                placeholder="S, M, L, XL"
                value={formData.sizes}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Colors (comma separated)</label>
              <input
                type="text"
                name="colors"
                placeholder="Red, Blue"
                value={formData.colors}
                onChange={handleChange}
                required
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Images</h3>

          <div className="flex flex-wrap gap-3">
            {formData.images.map((image, index) => (
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
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
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

        {/* Dimensions & Weight */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Dimensions &amp; Weight</h3>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <label className={labelClasses}>Length (cm)</label>
              <input
                type="number"
                name="length"
                value={formData.dimension.length}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Width (cm)</label>
              <input
                type="number"
                name="width"
                value={formData.dimension.width}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Height (cm)</label>
              <input
                type="number"
                name="height"
                value={formData.dimension.height}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* SEO / Meta */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>SEO (optional)</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClasses}>Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                value={formData.metaTitle}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div>
              <label className={labelClasses}>Meta Keywords</label>
              <input
                type="text"
                name="metaKeywords"
                value={formData.metaKeywords}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClasses}>Meta Description</label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                rows={2}
                className={inputClasses}
              />
            </div>
          </div>
        </div>

        {/* Visibility */}
        <div className={sectionClasses}>
          <h3 className={sectionTitleClasses}>Visibility</h3>

          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              Published
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
