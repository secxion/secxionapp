// src/pages/CategoryProduct.js
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import {
  FaCreditCard,
  FaGift,
  FaMoneyBillWave,
  FaFilter,
} from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";
import debounce from "lodash.debounce";
import ClipLoader from "react-spinners/ClipLoader";
import './InlinePod.css';

const iconMap = {
  "gift cards": <FaGift className="text-emerald-400 w-5 h-5" />,
  "visa / creditcards": <FaCreditCard className="text-yellow-400 w-5 h-5" />,
  "Online Payments": <FaMoneyBillWave className="text-indigo-400 w-5 h-5" />,
};

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const urlSearch = new URLSearchParams(location.search);
  const urlCategoryListinArray = urlSearch.getAll("category");
  const urlCategoryListObject = urlCategoryListinArray.reduce(
    (acc, el) => ({ ...acc, [el]: true }),
    {}
  );

  const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
  const [filterCategoryList, setFilterCategoryList] = useState(
    Object.keys(urlCategoryListObject)
  );

  useEffect(() => {
    const selected = Object.keys(selectCategory).filter((key) => selectCategory[key]);
    setFilterCategoryList(selected);
  }, [selectCategory]);

  useEffect(() => {
    navigate(
      `/product-category?${filterCategoryList
        .map((cat) => `category=${cat}`)
        .join("&")}`
    );

    const fetchData = debounce(async (categories) => {
      if (categories.length === 0) {
        setData([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(SummaryApi.filterProduct.url, {
          method: SummaryApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: categories }),
        });

        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Fetch failed");

        setData(json.data || []);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 500);

    fetchData(filterCategoryList);
  }, [filterCategoryList, navigate]);

  const handleSelectCategory = (e) => {
    const { value, checked } = e.target;
    setSelectCategory((prev) => ({ ...prev, [value]: checked }));
  };

  return (
    <div className="container fixed top-[90px] left-0 right-0 bottom-0 flex flex-col md:flex-row bg-gradient-to-br from-gray-700 via-gray-900 to-black text-white">

      {/* Mobile Top Bar Filter */}
      <div className="md:hidden w-full bg-gray-800 px-2 py-3 flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-400">
        {productCategory.map((category) => (
          <label key={category.id} className="flex items-center gap-1 bg-gray-900 px-3 py-2 rounded text-white whitespace-nowrap">
            {iconMap[category.value]}
            <input
              type="checkbox"
              value={category.value}
              checked={!!selectCategory[category.value]}
              onChange={handleSelectCategory}
              className="accent-blue-500"
            />
            <span className="text-sm">{category.label}</span>
          </label>
        ))}
      </div>

      {/* Desktop Sidebar Filter */}
      <aside className="hidden md:block md:w-[300px] bg-black p-6 shadow-lg overflow-y-auto border-r border-gray-800">
        <h4 className="text-xl font-semibold mb-4 flex items-center">
          <FaFilter className="mr-2" /> Filter by Category
        </h4>
        <form className="space-y-3">
          {productCategory.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-blue-600/50 transition"
            >
              {iconMap[category.value]}
              <input
                type="checkbox"
                value={category.value}
                checked={!!selectCategory[category.value]}
                onChange={handleSelectCategory}
                className="accent-blue-500 h-5 w-5"
              />
              <span className="text-white">{category.label}</span>
            </label>
          ))}
        </form>
        <div className="mt-8 text-sm text-gray-400 border-t border-gray-800 pt-4">
          Can't find what you're looking for? <br />
          <Link to="/report" className="text-green-400 underline">Report it here</Link>
        </div>
      </aside>

      {/* Product List */}
      <main className="flex-1 bg-gray-950 p-4 overflow-hidden">
        <div className="h-full flex flex-col">
          {filterCategoryList.length > 0 && (
            <p className="mb-3 text-sm text-blue-300">
              Showing results for:{" "}
              {filterCategoryList.map((cat, i) => (
                <span key={cat}>
                  <span className="text-white font-semibold">
                    {productCategory.find((p) => p.value === cat)?.label || cat}
                  </span>
                  {i < filterCategoryList.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
          )}

          <div className="flex-1 overflow-y-auto rounded-lg border border-blue-700 bg-gray-900 p-4 shadow-inner scrollbar-thin scrollbar-thumb-blue-500">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <ClipLoader loading={loading} size={50} color="#3b82f6" />
              </div>
            ) : error ? (
              <p className="text-red-400 font-semibold text-center">{error}</p>
            ) : data.length === 0 ? (
              <p className="text-gray-400 text-center">
                {filterCategoryList.length === 0
                  ? "Please select a category to see products."
                  : "No products found in the selected categories."}
              </p>
            ) : (
              <VerticalCard data={data} loading={loading} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryProduct;
