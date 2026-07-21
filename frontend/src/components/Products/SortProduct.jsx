import { useSearchParams } from "react-router-dom";

const SortProduct = () => {
  const [searchParams, SetSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sort = e.target.value;
    searchParams.set("sortBy", sort);
    SetSearchParams(searchParams);
  };

  return (
    <div className="flex justify-end">
      <select
        name="sort"
        onChange={handleSortChange}
        value={searchParams.get("sortBy") || ""}
        className="w-full sm:w-auto bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm outline-none cursor-pointer transition focus:border-black focus:ring-1 focus:ring-black hover:border-gray-400"
      >
        <option value="default">Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
    </div>
  );
};

export default SortProduct;
