import React from 'react';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import {
  FaCheck,
  FaTrash,
  FaExternalLinkAlt,
  FaCommentDots,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaFileInvoice,
  FaNewspaper,
} from 'react-icons/fa';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'report_reply': return <FaCommentDots className="h-3 w-3 mr-1" />;
    case 'transaction:debit': return <span className="mr-1">⬇️</span>;
    case 'transaction:credit': return <span className="mr-1">⬆️</span>;
    case 'new_blog': return <FaNewspaper className="h-3 w-3 mr-1 text-blue-500" />;
    case 'transaction:withdrawal': return <FaShoppingCart className="h-3 w-3 mr-1" />;
    case 'transaction:payment_completed': return <FaCheckCircle className="h-3 w-3 mr-1" />;
    case 'transaction:rejected': return <FaExclamationTriangle className="h-3 w-3 mr-1 text-red-600" />;
    case 'market_upload:DONE': return <FaCheckCircle className="h-3 w-3 mr-1 text-green-600" />;
    case 'market_upload:CANCEL': return <FaTimesCircle className="h-3 w-3 mr-1 text-red-600" />;
    case 'market_upload:PROCESSING': return <FaClock className="h-3 w-3 mr-1 text-yellow-600" />;
    default: return <FaInfoCircle className="h-3 w-3 mr-1 text-gray-400" />;
  }
};

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDelete,
  onOpenReportReply,
  onViewCreditDetails,
  onOpenMarketDetails,
}) => {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
  const truncateLength = 60;
  const truncatedMessage = notification.message.length > truncateLength
    ? `${notification.message.substring(0, truncateLength)}......`
    : notification.message;

  const isRejectionCredit = notification.type === 'transaction:credit' && notification.message.includes('rejected');
  const isMarketNotification = notification.onModel === 'userproduct' && notification.relatedObjectId;
  const notificationIcon = getNotificationIcon(notification.type);

  return (
    <li className={clsx(
      'px-4 py-6 hover:bg-gray-50 transition duration-150 ease-in-out',
      notification.isRead ? 'bg-gray-100' : ''
    )}>
      <div className="flex items-start justify-between">
        {/* Message + time + type tags */}
        <div className="flex-grow">
          <p className="text-sm font-medium text-black flex items-center">
            {notificationIcon}
            {truncatedMessage}
          </p>
          <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>

          {notification.isRead && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
              Read
            </span>
          )}

          {/* Notification Type Tags */}
          <div className="mt-2 space-x-2">
            {notification.type === 'report_reply' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                <FaCommentDots className="h-3 w-3 mr-1" /> Reply
              </span>
            )}

            {notification.type === 'new_blog' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                <FaNewspaper className="h-3 w-3 mr-1" /> Blog
              </span>
            )}

            {notification.type.startsWith('transaction:') && (
              <span className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                {
                  'bg-red-100 text-red-800': notification.type === 'transaction:debit',
                  'bg-green-100 text-green-800': notification.type === 'transaction:credit',
                  'bg-yellow-100 text-yellow-800': notification.type === 'transaction:withdrawal',
                  'bg-indigo-100 text-indigo-800': notification.type === 'transaction:payment_completed',
                  'bg-orange-100 text-orange-800': notification.type === 'transaction:rejected',
                }
              )}>
                {notification.type === 'transaction:debit' && '⬇️ Debit'}
                {notification.type === 'transaction:credit' && '⬆️ Credit'}
                {notification.type === 'transaction:withdrawal' && (<><FaShoppingCart className="h-3 w-3 mr-1" /> Withdrawal</>)}
                {notification.type === 'transaction:payment_completed' && (<><FaCheckCircle className="h-3 w-3 mr-1" /> Completed</>)}
                {notification.type === 'transaction:rejected' && (<><FaExclamationTriangle className="h-3 w-3 mr-1" /> Rejected</>)}
              </span>
            )}

            {notification.type.startsWith('market_upload:') && (
              <span className={clsx(
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold',
                {
                  'bg-green-100 text-green-800': notification.type === 'market_upload:DONE',
                  'bg-red-100 text-red-800': notification.type === 'market_upload:CANCEL',
                  'bg-yellow-100 text-yellow-800': notification.type === 'market_upload:PROCESSING',
                }
              )}>
                {notification.type === 'market_upload:DONE' && (<><FaCheckCircle className="h-3 w-3 mr-1" /> Done</>)}
                {notification.type === 'market_upload:CANCEL' && (<><FaTimesCircle className="h-3 w-3 mr-1" /> Cancelled</>)}
                {notification.type === 'market_upload:PROCESSING' && (<><FaClock className="h-3 w-3 mr-1" /> Processing</>)}
              </span>
            )}
          </div>
        </div>

        {/* Right-side Actions */}
        <div className="ml-4 flex-shrink-0 flex flex-col items-end space-y-2">
          {isMarketNotification && (
            <button
              onClick={() => onOpenMarketDetails(notification.relatedObjectId)}
              className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="View Invoice"
            >
              <FaFileInvoice className="h-4 w-4 mr-1" /> Invoice
            </button>
          )}
          {notification.type === 'report_reply' && (
            <button
              onClick={() => onOpenReportReply(notification)}
              className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Open Report Reply"
            >
              <FaExternalLinkAlt className="h-4 w-4 mr-1" /> Open
            </button>
          )}
          {isRejectionCredit && (
            <button
              onClick={() => onViewCreditDetails(notification)}
              className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="View Credit Details"
            >
              <FaInfoCircle className="h-4 w-4 mr-1" /> Details
            </button>
          )}
          <div className="inline-flex rounded-md shadow-sm">
            {!notification.isRead && (
              <button
                onClick={() => onMarkAsRead(notification._id)}
                className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-l-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Mark as Read"
              >
                <FaCheck className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(notification._id)}
              className="inline-flex items-center px-2 py-2 border border-gray-300 rounded-r-md shadow-sm text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Delete Notification"
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
