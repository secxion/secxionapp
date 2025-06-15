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
                  
                  {/* Hover Overlay */}
                  <div className="vertical-card__overlay">
                    <div className="vertical-card__overlay-content">
                      <span className="vertical-card__view-text">View Product</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="vertical-card__content">
                <h3 className="vertical-card__title">
                  {product.productName}
                </h3>
                
                {/* Price Display */}
                {product.price && (
                  <div className="vertical-card__price">
                    <span className="vertical-card__currency">$</span>
                    <span className="vertical-card__amount">{product.price}</span>
                  </div>
                )}

                {/* Rating Stars (if available) */}
                {product.rating && (
                  <div className="vertical-card__rating">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`vertical-card__star ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="vertical-card__rating-text">({product.rating})</span>
                  </div>
                )}
              </div>

              {/* Enhanced Signature with Animation */}
              <div className="vertical-card__signature">
                <span className="vertical-card__signature-text">{signature}</span>
                <div className="vertical-card__signature-glow"></div>
              </div>

              {/* Animated Border */}
              <div className="vertical-card__border-animation"></div>
            </Link>
          ))}
    </div>
  );
});

export default VerticalCard;