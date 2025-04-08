import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productCategory from "../helpers/productCategory";
import SummaryApi from "../common";
import { FaCreditCard, FaGift, FaMoneyBillWave, FaBars, FaFilter } from "react-icons/fa";
import VerticalCard from "../Components/VerticalCard";
import debounce from "lodash.debounce";
import ClipLoader from "react-spinners/ClipLoader";

const CategoryProduct = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const urlSearch = new URLSearchParams(location.search);
    const urlCategoryListinArray = urlSearch.getAll("category");
    const urlCategoryListObject = urlCategoryListinArray.reduce((acc, el) => ({ ...acc, [el]: true }), {});

    const [selectCategory, setSelectCategory] = useState(urlCategoryListObject);
    const [filterCategoryList, setFilterCategoryList] = useState(Object.keys(urlCategoryListObject));

    useEffect(() => {
        const selectedCategories = Object.keys(selectCategory).filter((key) => selectCategory[key]);
        setFilterCategoryList(selectedCategories);
    }, [selectCategory]);

    useEffect(() => {
        navigate(`/product-category?${filterCategoryList.map((cat) => `category=${cat}`).join("&")}`);

        const fetchData = debounce(async (categories) => {
            if (categories.length === 0) {
                setData([]); // Clear data when no categories are selected
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
                    throw new Error(errorData?.message || "⚠️ Failed to fetch products. Please try again.");
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
        <div className="fixed top-[80px] left-0 right-0 bottom-0 flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
            {/* Mobile Toggle Button */}
            <div className="md:hidden flex justify-between items-center bg-blue-500 dark:bg-blue-800 text-white p-3">
              <h3 className="text-lg font-bold">
                  <FaFilter className="inline-block mr-2" />
              </h3>
              <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="flex items-center focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 rounded"
              >
                  <span className="mr-2">{mobileMenuOpen ? "Close Menu" : "Open Menu"}</span>
                  <FaBars className={`w-6 h-6 transition-transform duration-300 ${mobileMenuOpen ? 'transform rotate-90' : ''}`} />
              </button>
          </div>

            {/* Sidebar for Category Selection */}
            <aside
                className={`md:w-[300px] bg-gradient-to-br from-blue-100 dark:from-gray-800 via-white dark:via-gray-900 to-blue-50 dark:to-gray-800 p-6 shadow-lg overflow-y-auto transition-all duration-300 ${
                    mobileMenuOpen ? "block" : "hidden md:block"
                }`}
            >
                <h4 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                    <FaFilter className="inline-block mr-2" /> Filter by Category
                </h4>
                <form className="space-y-3">
                    {productCategory.map((category) => (
                        <label
                            key={category.id}
                            className="flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-blue-100 dark:hover:bg-gray-700"
                        >
                            {category.value === "gift cards" && <FaGift className="text-emerald-500 w-5 h-5" />}
                            {category.value === "visa / creditcards" && <FaCreditCard className="text-yellow-500 w-5 h-5" />}
                            {category.value === "Online Payments" && <FaMoneyBillWave className="text-indigo-500 w-5 h-5" />}
                            <input
                                type="checkbox"
                                name="category"
                                checked={!!selectCategory[category.value]}
                                value={category.value}
                                onChange={handleSelectCategory}
                                className="form-checkbox h-5 w-5 text-blue-600 dark:bg-gray-700 dark:border-gray-600 focus:ring-blue-500 rounded border-gray-300"
                            />
                            <span className="text-gray-700 dark:text-gray-300">{category.label}</span>
                        </label>
                    ))}
                </form>
            </aside>

            {/* Product Display Section */}
            <main className="flex-1 bg-gray-100 dark:bg-gray-800 shadow-lg p-4 overflow-hidden">
                <div className="container mx-auto h-full flex flex-col">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                            🛍️ Explore Products
                        </h2>
                        {filterCategoryList.length > 0 && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Filtering by: {filterCategoryList.map((cat, index) => (
                                    <span key={cat}>
                                        <span className="font-semibold">{productCategory.find(p => p.value === cat)?.label || cat}</span>
                                        {index < filterCategoryList.length - 1 ? ", " : ""}
                                    </span>
                                ))}
                            </p>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-700">
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <ClipLoader loading={loading} size={50} color="#3b82f6" />
                            </div>
                        ) : error ? (
                            <p className="text-red-500 font-semibold text-center">{error}</p>
                        ) : data.length === 0 && filterCategoryList.length > 0 ? (
                            <p className="text-gray-500 text-center">No products found in the selected categories.</p>
                        ) : data.length === 0 && filterCategoryList.length === 0 ? (
                            <p className="text-gray-500 text-center">Please select a category to see products.</p>
                        ) : (
                          <div className="h-[calc(100vh-140px)] overflow-y-auto">
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