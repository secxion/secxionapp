import React from "react";

const Loader = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {error ? (
        <>
          <p className="text-red-500 text-lg font-semibold">⚠️ {error}</p>
          <button
            onClick={onRetry}
            className="mt-4 px-6 py-2 bg-red-600 text-white font-medium rounded-lg shadow-lg ring-2 ring-red-400 hover:bg-red-700 hover:ring-red-500 transition-all duration-300"
          >
            Retry
          </button>
        </>
      ) : (
        <>          
          <p className="mt-4 text-lg font-semibold text-gray-800 dark:text-gray-300 animate-pulse">
            Loading ...
          </p>
        </>
      )}
    </div>
  );
};

export default Loader;
