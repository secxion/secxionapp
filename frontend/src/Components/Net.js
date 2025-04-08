import React, { useEffect, useState } from "react";
import "./Net.css";

const Net = ({ blogs }) => {
  const [systemBlogs, setSystemBlogs] = useState([]);

  useEffect(() => {
    setSystemBlogs([...blogs, ...blogs, ...blogs,]); 
  }, [blogs]);

  return (
    <div className="net-container">
      <div className="net-label">
        <span className="label">🤖 Blog:</span>
      </div>
      <div className="blog-wrapper">
        <div className="blog-content">
          {systemBlogs.length > 0 ? (
            systemBlogs.map((blog, index) => (
              <div key={index} className="blog-item">
                <strong className="blog-title">{blog.title} 🚀</strong>:{" "}
                <span className="blog-text">{blog.content}</span>
              </div>
            ))
          ) : (
            <span className="loading-text">🔄 Fetching latest system updates...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Net;
