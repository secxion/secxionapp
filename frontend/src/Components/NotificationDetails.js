import React from 'react';

const NotificationDetails = ({ notification, onClose }) => {


    if (!notification) {
        return null;
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center pt-44 px-4 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    {notification.onModel === 'userproduct' ? 'Market Record Details' : 'Notification Details'}
                                </h3>
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        <strong>Message:</strong> {notification.message}
                                    </p>
                                    {notification.rejectionReason && (
                                        <p className="text-sm text-red-600 font-semibold mt-1">
                                            <strong>Reason:</strong> {notification.rejectionReason}
                                        </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        <strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                        <button
                            type="button"
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetails;