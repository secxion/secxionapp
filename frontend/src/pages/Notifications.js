import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBell, FaEnvelopeOpen, FaCheckDouble } from 'react-icons/fa';
import NotificationItem from '../Components/NotificationItems';
import NotificationDetails from '../Components/NotificationDetails';
import SummaryApi from '../common';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const previousCountRef = useRef(0);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      const [transactionRes, reportRes, marketRes] = await Promise.all([
        fetch(SummaryApi.getTransactionNotifications.url, {
          method: SummaryApi.getTransactionNotifications.method,
          credentials: 'include',
        }),
        fetch(SummaryApi.getReportNotifications.url, {
          method: SummaryApi.getReportNotifications.method,
          credentials: 'include',
        }),
        fetch(SummaryApi.getMarketNotifications.url, {
          method: 'GET',
          credentials: 'include',
        }),
      ]);

      const [transactionData, reportData, marketData] = await Promise.all([
        transactionRes.json(),
        reportRes.json(),
        marketRes.json(),
      ]);

      if (transactionData.success && reportData.success && marketData.success) {
        const filteredTxns = transactionData.data.filter((n) =>
          [
            'transaction:debit',
            'transaction:credit',
            'transaction:payment_completed',
            'transaction:withdrawal',
            'transaction:rejected',
            'transaction:eth_processed',
          ].includes(n.type)
        );

        const all = [...filteredTxns, ...reportData.data, ...marketData.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );


        previousCountRef.current = all.length;
        setNotifications(all);
      } else {
        setError(
          `${transactionData.message || ''} ${reportData.message || ''} ${marketData.message || 'Failed to fetch notifications.'}`
        );
      }
    } catch (err) {
      console.error('[Fetch Notifications Error]', err);
      setError('An unexpected error occurred while fetching notifications.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`${SummaryApi.markNotificationAsRead.url}/${id}`, {
        method: SummaryApi.markNotificationAsRead.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true, read: 'READ' } : n))
        );
        toast.success(data.message || 'Marked as read');
      } else toast.error(data.message || 'Failed to mark');
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark notification as read.');
    }
  };

  const handleDeleteNotification = async (id) => {
    try {
      const res = await fetch(`${SummaryApi.deleteNotification.url}/${id}`, {
        method: SummaryApi.deleteNotification.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        toast.success(data.message || 'Notification deleted.');
      } else toast.error(data.message || 'Failed to delete.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete notification.');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch(SummaryApi.markAllNotificationsAsRead.url, {
        method: SummaryApi.markAllNotificationsAsRead.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true, read: 'READ' }))
        );
        toast.success(data.message || 'All marked as read.');
      } else toast.error(data.message || 'Failed to mark all.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to mark all as read.');
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await fetch(SummaryApi.deleteAllNotifications.url, {
        method: SummaryApi.deleteAllNotifications.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setNotifications([]);
        toast.success(data.message || 'All notifications deleted.');
      } else toast.error(data.message || 'Failed to delete all.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete all notifications.');
    }
  };

  const handleOpenReportReply = (notification) => {
    navigate(`/chat/${notification.relatedObjectId}`);
    if (!notification.isRead) handleMarkAsRead(notification._id);
  };

  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailsOpen(true);
  };

  const handleOpenMarketDetails = (marketId) => {
    const item = notifications.find((n) => n.relatedObjectId === marketId && n.onModel === 'userproduct');
    if (item) {
      setSelectedNotification(item);
      setIsDetailsOpen(true);
    }
  };

  const handleViewCreditDetails = (notification) => {
    setSelectedNotification(notification);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setSelectedNotification(null);
    setIsDetailsOpen(false);
  };

  const filteredNotifications = () => {
    if (filter === 'unread') return notifications.filter((n) => !n.isRead);
    if (filter === 'read') return notifications.filter((n) => n.isRead);
    return notifications;
  };

  const hasUnread = notifications.some((n) => !n.isRead);

  return (
    <div className="mt-2 py-20 bg-gray-100">
      <div className="mx-auto shadow-md rounded-md overflow-hidden bg-white">
        <div className="fixed bg-white border-b border-gray-200 py-2 z-10">
          <div className="flex items-center fixed justify-between p-4 mx-auto w-full bg-white shadow-md z-10">
            <nav className="flex space-x-3 w-full" aria-label="Tabs">
              {['all', 'unread', 'read'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`${
                    filter === tab
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  {tab === 'all' && <><FaBell className="mr-1 inline-block" /> All</>}
                  {tab === 'unread' && <><FaEnvelopeOpen className="mr-1 inline-block" /> Unread</>}
                  {tab === 'read' && <><FaCheckDouble className="mr-1 inline-block" /> Read</>}
                </button>
              ))}
              <button
                onClick={handleDeleteAll}
                className="py-2 px-3 text-red-600 border rounded border-gray-300 hover:bg-red-600 hover:text-white text-sm"
              >
                Delete All
              </button>
              {hasUnread && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="py-2 px-3 text-blue-600 border rounded border-gray-300 hover:bg-blue-600 hover:text-white text-sm"
                >
                  Mark All Read
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="py-24 pb-0 hover:bg-gray-50 transition duration-150 ease-in-out">
          <ul className="divide-y divide-gray-200">
            {filteredNotifications().length > 0 ? (
              filteredNotifications().map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                  onOpenReportReply={handleOpenReportReply}
                  onViewDetails={handleViewDetails}
                  onOpenMarketDetails={handleOpenMarketDetails}
                  onViewCreditDetails={handleViewCreditDetails}
                />
              ))
            ) : (
              <li className="px-4 py-6 text-gray-500 text-center">No notifications here. 😴</li>
            )}
          </ul>
        </div>
      </div>

      {isDetailsOpen && selectedNotification && (
        <NotificationDetails
          notification={selectedNotification}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default NotificationsPage;