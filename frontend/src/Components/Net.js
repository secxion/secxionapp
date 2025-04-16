import React, { useEffect, useState, useRef } from "react";
import "./Net.css";

const Net = ({ blogs }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };

    const nextBlog = () => {
      resetTimeout();
      setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
      timeoutRef.current = setTimeout(nextBlog, 10000);
    };

    if (blogs && blogs.length > 0) {
      timeoutRef.current = setTimeout(nextBlog, 10000);
    }

    return () => {
      resetTimeout();
    };
  }, [blogs]);

  return (
    <div className="net-container">
      <div className="net-label">
        <span className="label">🤖 Blog:</span>
      </div>
      <div className="blog-wrapper">
        <div className="blog-content" style={{ transform: `translateX(0)` }}>
          {blogs && blogs.length > 0 ? (
            <div key={currentIndex} className="blog-item">
              <strong className="blog-title">{blogs[currentIndex].title} 🚀</strong>:{" "}
              <span className="blog-text">{blogs[currentIndex].content}</span>
            </div>
          ) : (
            <span className="loading-text">🔄 Fetching latest system updates...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Net;