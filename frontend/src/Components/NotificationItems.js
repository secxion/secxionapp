import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FaCheck, FaTrash, FaExternalLinkAlt, FaCommentDots, FaExclamationTriangle, FaInfoCircle, FaShoppingCart, FaClock, FaCheckCircle, FaTimesCircle, FaFileInvoice } from 'react-icons/fa';

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onOpenReportReply, onViewDetails, onOpenMarketDetails }) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    const truncateLength = 60;
    const truncatedMessage = notification.message.length > truncateLength
        ? `${notification.message.substring(0, truncateLength)}......`
        : notification.message;

    const isRejectionCredit = notification.type === 'transaction:credit' && notification.message.includes('rejected');
    const isMarketNotification = notification.onModel === 'userproduct' && notification.relatedObjectId;

    let notificationIcon;
    switch (notification.type) {
        case 'report_reply':
            notificationIcon = <FaCommentDots className="h-3 w-3 mr-1" />;
            break;
        case 'transaction:debit':
            notificationIcon = <span className="mr-1">⬇️</span>;
            break;
        case 'transaction:credit':
            notificationIcon = <span className="mr-1">⬆️</span>;
            break;
        case 'new_blog':
            notificationIcon = <span className="mr-1">📰</span>;
            break;
        case 'transaction:withdrawal':
            notificationIcon = <FaShoppingCart className="h-3 w-3 mr-1" />;
            break;
        case 'transaction:payment_completed':
            notificationIcon = <FaCheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'transaction:rejected':
            notificationIcon = <FaExclamationTriangle className="h-3 w-3 mr-1" />;
            break;
        case 'market_upload:DONE':
            notificationIcon = <FaCheckCircle className="h-3 w-3 mr-1" />;
            break;
        case 'market_upload:CANCEL':
            notificationIcon = <FaTimesCircle className="h-3 w-3 mr-1" />;
            break;
        case 'market_upload:PROCESSING':
            notificationIcon = <FaClock className="h-3 w-3 mr-1" />;
            break;
        default:
            notificationIcon = <FaInfoCircle className="h-3 w-3 mr-1" />;
            break;
    }

    return (
        <li className={`px-4 py-6 hover:bg-gray-50 transition duration-150 ease-in-out ${notification.isRead ? 'bg-gray-100' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex-grow">
                    <p className="text-sm font-medium text-black flex items-center">
                        {notificationIcon}
                        {truncatedMessage}
                    </p>
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
                        {notification.type.startsWith('transaction:') && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2
                                ${notification.type === 'transaction:debit' ? 'bg-red-100 text-red-800' : ''}
                                ${notification.type === 'transaction:credit' ? 'bg-green-100 text-green-800' : ''}
                                ${notification.type === 'transaction:withdrawal' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${notification.type === 'transaction:payment_completed' ? 'bg-indigo-100 text-indigo-800' : ''}
                                ${notification.type === 'transaction:rejected' ? 'bg-orange-100 text-orange-800' : ''}
                            `}>
                                {notification.type === 'transaction:debit' && '⬇️ Debit'}
                                {notification.type === 'transaction:credit' && '⬆️ Credit'}
                                {notification.type === 'transaction:withdrawal' && <><FaShoppingCart className="h-3 w-3 mr-1" /> Withdrawal</>}
                                {notification.type === 'transaction:payment_completed' && <><FaCheckCircle className="h-3 w-3 mr-1" /> Completed</>}
                                {notification.type === 'transaction:rejected' && <><FaExclamationTriangle className="h-3 w-3 mr-1" /> Rejected</>}
                            </span>
                        )}
                        {notification.type.startsWith('market_upload:') && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold mr-2
                                ${notification.type === 'market_upload:DONE' ? 'bg-green-100 text-green-800' : ''}
                                ${notification.type === 'market_upload:CANCEL' ? 'bg-red-100 text-red-800' : ''}
                                ${notification.type === 'market_upload:PROCESSING' ? 'bg-yellow-100 text-yellow-800' : ''}
                            `}>
                                {notification.type === 'market_upload:DONE' && <><FaCheckCircle className="h-3 w-3 mr-1" /> Done</>}
                                {notification.type === 'market_upload:CANCEL' && <><FaTimesCircle className="h-3 w-3 mr-1" /> Cancelled</>}
                                {notification.type === 'market_upload:PROCESSING' && <><FaClock className="h-3 w-3 mr-1" /> Processing</>}
                            </span>
                        )}
                    </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                    {isMarketNotification && (
                        <button
                            onClick={() => onOpenMarketDetails(notification.relatedObjectId)}
                            className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-2"
                        >
                            <FaFileInvoice className="h-4 w-4 mr-1" /> Invoice
                        </button>
                    )}
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
                            <FaInfoCircle className="h-4 w-4 mr-1" /> Details
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