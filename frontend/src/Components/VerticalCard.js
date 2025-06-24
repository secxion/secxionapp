import React, { useState } from "react";
import { Link } from "react-router-dom";
import scrollTop from "../helpers/scrollTop";
import "./VerticalCard.css"; 

const VerticalCard = React.memo(({ loading, data = [] }) => {
  const loadingList = new Array(12).fill(null);
  const signature = "SXN";
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (productId) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  return (
    <div className="vertical-card-grid">
      {loading
        ? loadingList.map((_, index) => (
            <div
              key={index}
              className="vertical-card-skeleton"
            >
              <div className="skeleton-image"></div>
              <div className="skeleton-content">
                <div className="skeleton-title-1"></div>
                <div className="skeleton-title-2"></div>
              </div>
            </div>
          ))
        : data.map((product) => (
            <Link
              to={`/product/${product._id}`}
              onClick={scrollTop}
              key={product._id}
              className="vertical-card"
            >
              {/* Image Container with Enhanced Styling */}
              <div className="vertical-card__image-wrapper">
                <div className="vertical-card__image-container">
                  {imageErrors[product._id] ? (
                    <div className="vertical-card__placeholder">
                      <div className="vertical-card__placeholder-icon">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                        </svg>
                      </div>
                      <span className="vertical-card__placeholder-text">No Image</span>
                    </div>
                  ) : (
                    <img
                      src={product.productImage?.[0] || "/placeholder.jpg"}
                      alt={product.productName}
                      className="vertical-card__image"
                      loading="lazy"
                      onError={() => handleImageError(product._id)}
                    />
                  )}
                  
                </div>
              </div>

              {/* Content Section */}
              <div className="vertical-card__content">
                <h3 className="vertical-card__title">
                  {product.productName}
                </h3>
                
              </div>

              <div className="vertical-card__signature">
                <span className="vertical-card__signature-text">{signature}</span>
                <div className="vertical-card__signature-glow"></div>
              </div>

              <div className="vertical-card__border-animation"></div>
            </Link>
          ))}
    </div>
  );
});

export default VerticalCard;