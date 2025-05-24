import React from 'react';
import './Pop.css';

const PopAlert = ({ message }) => {
    return (
        <div className="pop-alert fixed top-16 right-4 z-50 bg-white text-black px-4 py-3 shadow-lg rounded-lg border border-blue-300 animate-slide-in">
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default PopAlert;