import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filter, SetFilter] = useState({
    category: "",
    gender: "",
    colors: [],
    sizes: [],
    brand: [],
    material: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, SetPriceRange] = useState([0, 100]);

  // NEW: track which sections are open (click based instead of hover)
  const [openSections, setOpenSections] = useState({
    category: false,
    gender: false,
    colors: false,
    sizes: false,
    material: false,
    brand: false,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const categorys = ["Top Wear", "Bottom Wear"];

  const colors = ["Charcoal", "Dark Green", "Navy"];

  const colorMap = {
    Charcoal: "#36454F",
    "Dark Green": "#1B4332",
    Navy: "#001F54",
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton",
    "Cotton Blend",
    "Denim",
    "Viscose",
    "Fleece",
    "Polyester",
  ];

  const brands = [
    "Urban Threads",
    "Modern Fit",
    "Street Style",
    "Beach Breeze",
    "Urban Chic",
    "Polo Classics",
    "Street Vibes",
    "Heritage Wear",
    "Winter Basics",
    "Everyday Comfort",
    "ChillZone",
    "DenimCo",
    "CasualLook",
    "SportX",
    "ExecutiveStyle",
  ];

  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    SetFilter({
      category: params.category || "",
      gender: params.gender || "",
      colors: params.colors ? params.colors.split(",") : [],
      sizes: params.sizes ? params.sizes.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 0,
      maxPrice: Number(params.maxPrice) || 100,
    });

    SetPriceRange([0, Number(params.maxPrice) || 100]);
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newFilter = {
      ...filter,
      [key]: value,
    };

    SetFilter(newFilter);

    const params = new URLSearchParams();

    Object.keys(newFilter).forEach((k) => {
      const val = newFilter[k];

      if (Array.isArray(val) && val.length > 0) {
        params.set(k, val.join(","));
      } else if (!Array.isArray(val) && val !== "" && val !== 0) {
        params.set(k, val);
      }
    });

    setSearchParams(params);
  };

  const clearFilters = () => {
    SetFilter({
      category: "",
      gender: "",
      colors: [],
      sizes: [],
      brand: [],
      material: [],
      minPrice: 0,
      maxPrice: 100,
    });

    SetPriceRange([0, 100]);
    setSearchParams({});
  };

  return (
    <div className="h-full bg-white/80 backdrop-blur-xl p-5 lg:p-6 overflow-y-auto rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Filters
        </h1>

        <button
          onClick={clearFilters}
          className="text-xs font-semibold uppercase tracking-wide text-red-500 hover:text-white px-3 py-1.5 rounded-full border border-red-200 hover:bg-red-500 hover:border-red-500 transition-all duration-300"
        >
          Clear All
        </button>
      </div>

      {/* Category Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Category
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.category ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.category
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2.5">
            {categorys.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 text-sm cursor-pointer group/item"
              >
                <span className="relative flex items-center justify-center w-[18px] h-[18px] rounded-full border-2 border-gray-300 group-hover/item:border-gray-400 transition-colors">
                  <input
                    type="radio"
                    name="category"
                    checked={filter.category === category}
                    onChange={() => updateFilter("category", category)}
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-black scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
                </span>
                <span className="text-gray-700 peer-checked:text-black group-hover/item:text-black transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Gender Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("gender")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Gender
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.gender ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.gender
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2.5">
            {genders.map((gender) => (
              <label
                key={gender}
                className="flex items-center gap-3 text-sm cursor-pointer group/item"
              >
                <span className="relative flex items-center justify-center w-[18px] h-[18px] rounded-full border-2 border-gray-300 group-hover/item:border-gray-400 transition-colors">
                  <input
                    type="radio"
                    name="gender"
                    checked={filter.gender === gender}
                    onChange={() => updateFilter("gender", gender)}
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <span className="w-2.5 h-2.5 rounded-full bg-black scale-0 peer-checked:scale-100 transition-transform duration-200"></span>
                </span>
                <span className="text-gray-700 group-hover/item:text-black transition-colors">
                  {gender}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Colors Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("colors")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Colors
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.colors ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.colors
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                type="button"
                title={color}
                onClick={() =>
                  updateFilter(
                    "colors",
                    filter.colors.includes(color)
                      ? filter.colors.filter((c) => c !== color)
                      : [...filter.colors, color],
                  )
                }
                style={{ background: colorMap[color] || color.toLowerCase() }}
                className={`w-8 h-8 rounded-full border border-white shadow-md hover:scale-110 transition-all duration-200 ${
                  filter.colors.includes(color)
                    ? "ring-2 ring-black ring-offset-2 scale-110"
                    : "ring-1 ring-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Size Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("sizes")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Size
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.sizes ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.sizes
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = filter.sizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() =>
                    updateFilter(
                      "sizes",
                      active
                        ? filter.sizes.filter((s) => s !== size)
                        : [...filter.sizes, size],
                    )
                  }
                  className={`w-10 h-10 flex items-center justify-center text-sm font-semibold rounded-lg border transition-all duration-200 ${
                    active
                      ? "bg-black text-white border-black shadow-md scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Material Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("material")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Material
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.material ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.material
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {materials.map((material) => (
              <label
                key={material}
                className="flex items-center gap-3 text-sm cursor-pointer group/item"
              >
                <span className="relative flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 border-gray-300 group-hover/item:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={filter.material.includes(material)}
                    onChange={() =>
                      updateFilter(
                        "material",
                        filter.material.includes(material)
                          ? filter.material.filter((m) => m !== material)
                          : [...filter.material, material],
                      )
                    }
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <svg
                    className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="absolute inset-0 rounded-md bg-black scale-0 peer-checked:scale-100 transition-transform duration-200 -z-10"></span>
                </span>
                <span className="text-gray-700 group-hover/item:text-black transition-colors">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Filter — click to toggle */}
      <div className="mb-6 pb-6 border-b border-gray-100">
        <div
          onClick={() => toggleSection("brand")}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <label className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
            Brand
          </label>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform duration-300 ${
              openSections.brand ? "rotate-180" : ""
            }`}
          />
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            openSections.brand
              ? "max-h-96 opacity-100 mt-3"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label
                key={brand}
                className="flex items-center gap-3 text-sm cursor-pointer group/item"
              >
                <span className="relative flex items-center justify-center w-[18px] h-[18px] rounded-md border-2 border-gray-300 group-hover/item:border-gray-400 transition-colors">
                  <input
                    type="checkbox"
                    checked={filter.brand.includes(brand)}
                    onChange={() =>
                      updateFilter(
                        "brand",
                        filter.brand.includes(brand)
                          ? filter.brand.filter((b) => b !== brand)
                          : [...filter.brand, brand],
                      )
                    }
                    className="peer absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <svg
                    className="w-3 h-3 text-white scale-0 peer-checked:scale-100 transition-transform duration-200"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="absolute inset-0 rounded-md bg-black scale-0 peer-checked:scale-100 transition-transform duration-200 -z-10"></span>
                </span>
                <span className="text-gray-700 group-hover/item:text-black transition-colors">
                  {brand}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Price Range — always visible */}
      <div>
        <label className="block font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
          Price Range
        </label>

        <input
          type="range"
          min={0}
          max={100}
          value={filter.maxPrice}
          onChange={(e) => {
            const value = Number(e.target.value);

            SetPriceRange([0, value]);
            updateFilter("maxPrice", value);
          }}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer bg-gray-200 accent-black"
        />

        <div className="flex justify-between mt-3 text-sm">
          <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">
            $0
          </span>
          <span className="px-2.5 py-1 rounded-full bg-black text-white font-medium shadow-md">
            ${priceRange[1]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
