import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import {
  FaCreditCard,
  FaGift,
  FaMoneyBillWave,
  FaFilter
} from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";
import debounce from "lodash.debounce";
import ClipLoader from "react-spinners/ClipLoader";
import './InlinePod.css';

const CategoryProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    const selectedCategories = Object.keys(selectCategory).filter(
      (key) => selectCategory[key]
    );
    setFilterCategoryList(selectedCategories);
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
        const response = await fetch(`${SummaryApi.filterProduct.url}`, {
          method: SummaryApi.filterProduct.method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category: categories }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData?.message ||
              "⚠️ Failed to fetch products. Please try again."
          );
        }
        const dataResponse = await response.json();
        setData(dataResponse?.data || []);
      } catch (err) {
        setError(err.message);
        console.error("🚨 Error fetching products:", err);
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

         {/* Mobile Top Bar Category Filter */}
         <div className="md:hidden w-full overflow-x-auto bg-gray-700 dark:bg-gray-800 shadow-md p-2 flex gap-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-700">
                {productCategory.map((category) => (
                    <label
                        key={category.id}
                        className="flex items-center gap-1 bg-gray-800 px-3 py-2 rounded-md text-white whitespace-nowrap cursor-pointer"
                    >
                        {category.value === "gift cards" && <FaGift className="text-emerald-400 w-4 h-4" />}
                        {category.value === "visa / creditcards" && <FaCreditCard className="text-yellow-400 w-4 h-4" />}
                        {category.value === "Online Payments" && <FaMoneyBillWave className="text-indigo-400 w-4 h-4" />}
                        <input
                            type="checkbox"
                            name="category"
                            checked={!!selectCategory[category.value]}
                            value={category.value}
                            onChange={handleSelectCategory}
                            className="form-checkbox text-blue-500 h-4 w-4"
                        />
                        <span className="text-sm">{category.label}</span>
                    </label>
                ))}
            </div>

      {/* Desktop Sidebar Category Filter */}
      <aside className="hidden md:block md:w-[300px] bg-gradient-to-b from-gray-900 via-black to-gray-800 p-6 shadow-lg overflow-y-auto border-r border-gray-700">
        <h4 className="text-xl font-semibold mb-4 text-white flex items-center">
          <FaFilter className="inline-block mr-2" /> Filter by Category
        </h4>

        <form className="space-y-3">
          {productCategory.map((category) => (
            <label
              key={category.id}
              className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-transform duration-200 hover:bg-blue-600/50"
            >
              {category.value === "gift cards" && <FaGift className="text-emerald-400 w-5 h-5" />}
              {category.value === "visa / creditcards" && <FaCreditCard className="text-yellow-400 w-5 h-5" />}
              {category.value === "Online Payments" && <FaMoneyBillWave className="text-indigo-400 w-5 h-5" />}
              <input
                type="checkbox"
                name="category"
                checked={!!selectCategory[category.value]}
                value={category.value}
                onChange={handleSelectCategory}
                className="form-checkbox h-5 w-5 accent-blue-500"
              />
              <span className="text-gray-200">{category.label}</span>
            </label>
          ))}
        </form>

        <div className="mt-8 text-sm text-gray-300 border-t border-gray-700 pt-4">
          Can't find what you're looking for? <br />
          <Link to={'/report'} className="text-green-400 underline hover:text-green-300 transition">Report it here</Link>
        </div>
      </aside>

      {/* Product Display Section */}
      <main className="flex-1 bg-gray-950 p-4 overflow-hidden">
        <div className="h-full flex flex-col">
          <div className="mb-4">
            {filterCategoryList.length > 0 && (
              <p className="text-sm text-blue-300">
                Showing results for:{" "}
                {filterCategoryList.map((cat, index) => (
                  <span key={cat}>
                    <span className="font-semibold text-white">
                      {productCategory.find((p) => p.value === cat)?.label || cat}
                    </span>
                    {index < filterCategoryList.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            )}
          </div>

          <div className="flex-1 overflow-y-auto rounded-lg border border-blue-700 bg-gray-900 shadow-inner p-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-800">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader loading={loading} size={50} color="#3b82f6" />
              </div>
            ) : error ? (
              <p className="text-red-400 font-semibold text-center">{error}</p>
            ) : data.length === 0 && filterCategoryList.length > 0 ? (
              <p className="text-gray-400 text-center">No products found in the selected categories.</p>
            ) : data.length === 0 && filterCategoryList.length === 0 ? (
              <p className="text-gray-400 text-center">Please select a category to see products.</p>
            ) : (
              <div className="h-[calc(100vh-140px)] overflow-y-auto transition-all duration-300 ease-in-out">
                <VerticalCard data={data} loading={loading} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoryProduct;
