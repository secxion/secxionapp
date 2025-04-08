import React from "react";
import { Link } from "react-router-dom";
import scrollTop from "../helpers/scrollTop";
import "./VerticalCard.css";

const VerticalCard = React.memo(({ loading, data = [] }) => {
    const loadingList = new Array(8).fill(null);

    if (!Array.isArray(data) || data.length === 0) {
      return <p className="text-gray-500 text-center">No products available.</p>;
    }
  

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 p-1 md:p-2">
            {loading
                ? loadingList.map((_, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 p-2 rounded-md shadow animate-pulse border border-gray-300 dark:border-gray-700"
                    >
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-md mb-1"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                    </div>
                ))
                : data.map((product) => (
                    <div
                        key={product._id}
                        className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 transition-transform transform hover:shadow-md hover:scale-101"
                    >
                        <Link to={`/product/${product._id}`} onClick={scrollTop} className="block">
                            <div className="h-16 md:h-20 overflow-hidden rounded-md mb-2 bg-gray-100 dark:bg-gray-900 flex items-center justify-center border-b border-gray-200 dark:border-gray-700 shadow-inner">
                                <img
                                    src={product.productImage?.[0] || "placeholder.jpg"}
                                    alt={product.productName}
                                    loading="lazy"
                                    className="h-full w-full object-contain transition-transform duration-200 ease-in-out transform hover:scale-103"
                                />
                            </div>
                            <div className="pt-1">
                                <h3 className="font-medium text-xs text-gray-800 dark:text-gray-300 line-clamp-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150">
                                    {product.productName}
                                </h3>
                            </div>
                        </Link>
                    </div>
                ))}
        </div>
    );
});

export default VerticalCard;