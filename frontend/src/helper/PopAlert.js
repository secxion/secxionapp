import React from 'react';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopAlert = ({ message = "", onClose }) => {
  const shouldTruncate = message.length > 100;
  const truncatedMessage = shouldTruncate ? message.slice(0, 100) + "..." : message;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 sm:px-6 lg:px-8 bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white max-w-md w-full rounded-xl p-6 border border-gray-200 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 "
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-black mb-2">Notification</h2>
        <p className="text-gray-800 text-sm leading-relaxed mb-4">
          {truncatedMessage}
          {shouldTruncate && (
            <>
              {' '}
              <Link
                to="/notifications"
                className="text-blue-600 font-medium text-sm underline"
                onClick={onClose}
              >
                View more
              </Link>
            </>
          )}
        </p>
        {!shouldTruncate && (
          <Link
            to="/notifications"
            className="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm underline"
            onClick={onClose}
          >
            View all notifications
          </Link>
        )}
      </div>
    </div>
  );
};

export default PopAlert;
