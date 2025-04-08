import React from 'react';

const TransactionHistoryPlaceholder = () => {
  return (
    <div>
      <div className="bg-gray-100 rounded-md p-2 mb-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Deposit</span>
          <span className="font-bold text-green-600">+ $500.00</span>
        </div>
        <p className="text-xs text-gray-500">Mar 28, 2025 10:00 AM</p>
      </div>
      <div className="bg-gray-100 rounded-md p-2 mb-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Withdrawal</span>
          <span className="font-bold text-red-600">- $100.00</span>
        </div>
        <p className="text-xs text-gray-500">Mar 27, 2025 03:30 PM</p>
      </div>
      <div className="bg-gray-100 rounded-md p-2 mb-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">Payment Received</span>
          <span className="font-bold text-green-600">+ $350.00</span>
        </div>
        <p className="text-xs text-gray-500">Mar 26, 2025 11:15 AM</p>
      </div>
      <p className="text-gray-500 text-sm mt-2">More transactions...</p>
    </div>
  );
};

export default TransactionHistoryPlaceholder;