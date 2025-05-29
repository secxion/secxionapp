// src/components/VerticalCard.js
import React from "react";
import { Link } from "react-router-dom";
import scrollTop from "../helpers/scrollTop";
import "./VerticalCard.css";

const VerticalCard = React.memo(({ loading, data = [] }) => {
  const loadingList = new Array(12).fill(null);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="bg-gray-800 p-3 rounded-md animate-pulse border border-gray-700"
            >
              <div className="h-24 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-1"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))
        : data.map((product) => (
            <Link
              to={`/product/${product._id}`}
              onClick={scrollTop}
              key={product._id}
              className="block bg-gray-800 hover:bg-gray-700 rounded-md p-2 border border-gray-700 hover:shadow-lg transition-transform duration-200 transform hover:scale-105"
            >
              <div className="h-24 md:h-28 overflow-hidden rounded bg-gray-900 flex items-center justify-center border-b border-gray-700">
                <img
                  src={product.productImage?.[0] || "/placeholder.jpg"}
                  alt={product.productName}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="mt-2 text-sm font-medium text-gray-200 line-clamp-2">
                {product.productName}
              </div>
            </Link>
          ))}
    </div>
  );
});

export default VerticalCard;
