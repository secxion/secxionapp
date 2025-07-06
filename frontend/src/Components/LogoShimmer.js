import React from 'react';
import './LogoSimmer.css';

const LogoShimmer = ({ type }) => {
  const className = `shimmer-wrapper ${type}`;
  return (
    <div className={className}>
      <div className="shimmer-effect"></div>
    </div>
  );
};

export default LogoShimmer;