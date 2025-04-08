// NotificationDetails.js
import React from 'react';

const NotificationDetails = ({ notification, onClose }) => {
    if (!notification) {
        return null;
    }

    let rejectionReason = '';
    if (notification.type === 'transaction:credit' && notification.message.includes('rejected')) {
        const reasonMatch = notification.message.match(/Reason:\s*(.*?)(?:,|$)/i);
        if (reasonMatch && reasonMatch[1]) {
            rejectionReason = reasonMatch[1].trim();
        }
    }

    return (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                    Notification Details
                                </h3>
                                <div className="mt-2">
                                    {notification.type === 'transaction:credit' && notification.message.includes('rejected') && (
                                        <>
                                            <p className="text-sm text-gray-500">
                                                <strong>Type:</strong> Payment Request Rejected (Refund)
                                            </p>
                                            {notification.amount && (
                                                <p className="text-sm text-gray-500">
                                                    <strong>Refund Amount:</strong> {(notification.amount / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </p>
                                            )}
                                            {rejectionReason && (
                                                <p className="text-sm text-red-600 font-semibold">
                                                    <strong>Rejection Reason:</strong> {rejectionReason}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500 mt-2">
                                                <strong>Full Message:</strong> {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                <strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}
                                            </p>
                                        </>
                                    )}
                                    {! (notification.type === 'transaction:credit' && notification.message.includes('rejected')) && (
                                        <p className="text-sm text-gray-500">
                                            <strong>Message:</strong> {notification.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
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