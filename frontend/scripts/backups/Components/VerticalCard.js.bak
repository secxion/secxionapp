import React from "react";
import { Link } from "react-router-dom";
import scrollTop from "../helpers/scrollTop";
import "./VerticalCard.css"; // Ensure you have this CSS file

const VerticalCard = React.memo(({ loading, data = [] }) => {
  const loadingList = new Array(12).fill(null);
  const signature = "SXN";
  const neonBorderClass = "border-2 border-neon-pink"; // Define in CSS

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2">
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className={`bg-gray-800 p-0.5 rounded-md animate-pulse border border-gray-700 ${neonBorderClass}`}
            >
              <div className="aspect-w-1 aspect-h-1 bg-gray-700 rounded mb-0.25"></div>
              <div className="h-2 bg-gray-600 rounded w-3/4 mb-0.125"></div>
              <div className="h-1.5 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))
        : data.map((product) => (
            <Link
              to={`/product/${product._id}`}
              onClick={scrollTop}
              key={product._id}
              className={`block bg-gray-800 rounded-md border border-gray-700 transition-all duration-300 ease-in-out transform hover:scale-100 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-offset-1 relative ${neonBorderClass}`}
            >
              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded bg-gray-900 flex items-center justify-center border-b border-gray-700">
                <img
                  src={product.productImage?.[0] || "/placeholder.jpg"}
                  alt={product.productName}
                  className="object-contain w-full h-full transition-opacity duration-300 ease-in-out opacity-90 hover:opacity-100"
                  loading="lazy"
                />
              </div>
              <div className="p-0.5">
                <div className="text-[0.6rem] font-medium text-gray-200 line-clamp-2">
                  {product.productName}
                </div>
              </div>
              {/* Subtle Signature */}
              <div className="absolute bottom-0 right-0 bg-neon-pink text-black text-[0.5rem] font-bold p-0.25 rounded-tl">
                {signature}
              </div>
            </Link>
          ))}
    </div>
  );
});

export default VerticalCard;