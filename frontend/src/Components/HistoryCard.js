import React, { useState } from "react";
import HistoryDetailView from './HistoryDetailView';


const HistoryCard = ({ data, isDetailViewOpen, onCloseDetailView }) => {
  const [showDetailView, setShowDetailView] = useState(false);
  
  const initialStatus = data.status || 'WAIT';

  const handleViewMore = () => {
    setShowDetailView(true);
  }; 
  const renderStatusIndicator = (status) => {
    switch (status) {
      case 'PROCESSING':
        return (
          <div className="flex items-center">
            <div className="animate-spin h-5 w-5 border-4 border-blue-500 rounded-full border-t-transparent mr-2"></div>
            <span className="text-yellow-500">PROCESSING</span>
          </div>
        );
      case 'DONE':
        return <span className="text-green-500">👍✨ DONE</span>;
      case 'CANCEL':
        return <span className="text-red-500">👎 CANCEL</span>;
      case 'WAIT':
        return (
          <div className="flex items-center">
            <div className="animate-pulse h-5 w-5 mr-2">
              <svg className="h-full w-full text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.34 2 9 3.34 9 5v6H7c-1.66 0-3 1.34-3 3s1.34 3 3 3h2v6c0 1.66 1.34 3 3 3s3-1.34 3-3v-6h2c1.66 0 3-1.34 3-3s-1.34-3-3-3h-2V5c0-1.66-1.34-3-3-3z" />
              </svg>
            </div>
            <span className="text-gray-500">⏳ WAIT</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div
        className='container mt-10 p-6 rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 cursor-pointer'
        onClick={onCloseDetailView} 
      >
        <div className='w-full'>
          <p className="text-green-500 font-semibold">
            Market ID: <span className='text-green-700 truncate block'>{data._id}</span>
          </p>
          <p className="text-blue-500 text-sm mt-1">
            Created At: <span className='truncate block'>{data.timestamp ? new Date(data.timestamp).toLocaleString() : "N/A"}</span>
          </p>
          <p className="text-blue-500 text-sm mt-1">
            Status: <span className='truncate block'>{renderStatusIndicator(initialStatus)}</span>
          </p>
          {initialStatus === 'CANCEL' && (
            <p className="text-red-600 text-sm mt-1">
              Cancel Reason: <span className='truncate block'>{data.cancelReason || 'N/A'}</span>
            </p>
          )}
            <button 
            onClick={handleViewMore} 
            className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full">
            View More
          </button>        </div>
      </div>

      {showDetailView && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <HistoryDetailView
            productDetails={{
              ...data,
              crImage: data.crImage || null
            }}
            onClose={() => setShowDetailView(false)}
          />
        </div>
      )}
      
    </>
  );
};

export default HistoryCard;