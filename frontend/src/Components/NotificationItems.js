// NotificationItem.js
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaCheck, FaTrash, FaExternalLinkAlt, FaCommentDots, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onOpenReportReply, onViewDetails }) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    const truncateLength = 60;
    const truncatedMessage = notification.message.length > truncateLength
        ? `${notification.message.substring(0, truncateLength)}...`
        : notification.message;

    const isRejectionCredit = notification.type === 'transaction:credit' && notification.message.includes('rejected');

    return (
        <li className={`px-4 py-6 hover:bg-gray-50 transition duration-150 ease-in-out ${notification.isRead ? 'bg-gray-100' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="text-sm font-medium text-black">{truncatedMessage}</p>
                    <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
                    {notification.read === 'READ' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                            Read
                        </span>
                    )}
                    <div className="mt-2">
                        {notification.type === 'report_reply' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mr-2">
                                <FaCommentDots className="h-3 w-3 mr-1" /> Reply
                            </span>
                        )}
                        {notification.type === 'transaction:debit' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 mr-2">
                                ⬇️ Debit
                            </span>
                        )}
                        {notification.type === 'transaction:credit' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 mr-2">
                                ⬆️ Credit
                            </span>
                        )}
                        {notification.type === 'new_blog' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 mr-2">
                                📰 New Blog
                            </span>
                        )}
                        {notification.type === 'transaction:withdrawal' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 mr-2">
                                💸 Withdrawal
                            </span>
                        )}
                        {notification.type === 'transaction:payment_completed' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 mr-2">
                                ✅ Completed
                            </span>
                        )}
                        {isRejectionCredit && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 mr-2">
                                <FaExclamationTriangle className="h-3 w-3 mr-1" /> Rejected
                            </span>
                        )}
                    </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                    {notification.type === 'report_reply' && (
                        <button
                            onClick={() => onOpenReportReply(notification)}
                            className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        >
                            <FaExternalLinkAlt className="h-4 w-4 mr-1" /> Open
                        </button>
                    )}
                    {isRejectionCredit && (
                        <button
                            onClick={() => onViewDetails(notification)}
                            className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        >
                            <FaInfoCircle className="h-4 w-4 mr-1" /> Open
                        </button>
                    )}
                    <div className="inline-flex rounded-md shadow-sm">
                        {!notification.isRead && (
                            <button
                                onClick={() => onMarkAsRead(notification._id)}
                                className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <FaCheck className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            onClick={() => onDelete(notification._id)}
                            className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <FaTrash className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default NotificationItem;