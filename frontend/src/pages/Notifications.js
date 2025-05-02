import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NotificationItem from '../Components/NotificationItems';
import NotificationDetails from '../Components/NotificationDetails';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaBell, FaEnvelopeOpen, FaCheckDouble, FaTimesCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Notification.css';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useSelector((state) => state.user);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
                const transactionNotifications = transactionData.data.filter(n =>
                    ['transaction:debit', 'transaction:credit', 'transaction:payment_completed', 'transaction:withdrawal', 'transaction:rejected'].includes(n.type)
                );

                const allNotifications = [...transactionNotifications, ...reportData.data, ...marketData.data].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );

                setNotifications(allNotifications);
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
        if (user?._id) fetchNotifications();
    }, [user]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${SummaryApi.markNotificationAsRead.url}/${notificationId}`, {
                method: SummaryApi.markNotificationAsRead.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(prev =>
                    prev.map(n => n._id === notificationId ? { ...n, isRead: true, read: 'READ' } : n)
                );
                toast.success(data.message || 'Notification marked as read.');
            } else {
                toast.error(data.message || 'Failed to mark notification as read.');
            }
        } catch (error) {
            console.error('[Mark As Read Error]', error);
            toast.error('Failed to mark notification as read.');
        }
    };

    const handleDeleteNotification = async (notificationId) => {
        try {
            const response = await fetch(`${SummaryApi.deleteNotification.url}/${notificationId}`, {
                method: SummaryApi.deleteNotification.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
                toast.success(data.message || 'Notification deleted.');
            } else {
                toast.error(data.message || 'Failed to delete notification.');
            }
        } catch (error) {
            console.error('[Delete Notification Error]', error);
            toast.error('Failed to delete notification.');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const response = await fetch(SummaryApi.markAllNotificationsAsRead.url, {
                method: SummaryApi.markAllNotificationsAsRead.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true, read: 'READ' })));
                toast.success(data.message || 'All notifications marked as read.');
            } else {
                toast.error(data.message || 'Failed to mark all as read.');
            }
        } catch (error) {
            console.error('[Mark All As Read Error]', error);
            toast.error('Failed to mark all as read.');
        }
    };

    const handleDeleteAll = async () => {
        try {
            const response = await fetch(SummaryApi.deleteAllNotifications.url, {
                method: SummaryApi.deleteAllNotifications.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setNotifications([]);
                toast.success(data.message || 'All notifications deleted.');
            } else {
                toast.error(data.message || 'Failed to delete all.');
            }
        } catch (error) {
            console.error('[Delete All Notifications Error]', error);
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
        const marketNotification = notifications.find(n =>
            n.relatedObjectId === marketId && n.onModel === 'userproduct'
        );
        if (marketNotification) {
            setSelectedNotification(marketNotification);
            setIsDetailsOpen(true);
        }
    };

    const handleViewCreditDetails = (notification) => {
        // You can replace this with actual credit modal, drawer, or page routing logic
        setSelectedNotification(notification);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedNotification(null);
    };

    const filteredNotifications = () => {
        if (filter === 'unread') return notifications.filter(n => !n.isRead);
        if (filter === 'read') return notifications.filter(n => n.isRead);
        return notifications;
    };

    const hasUnread = notifications.some(n => !n.isRead);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-60">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
            </div>
        );
    }

    return (
        <div className="container bg-gray-100">
            <div className="max-w-4xl mx-auto shadow-md rounded-md overflow-hidden bg-white">
                <div className="bg-gray-50 border-b border-gray-200 py-6 px-4 sm:px-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <FaBell className="mr-2 text-gray-600" /> Notifications
                    </h2>
                    <div>
                        <button
                            onClick={handleDeleteAll}
                            className="inline-flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                        >
                            <FaTimesCircle className="mr-2" /> Delete All
                        </button>
                        {hasUnread && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="inline-flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 text-sm"
                            >
                                <FaCheckDouble className="mr-2" /> Mark All Read
                            </button>
                        )}
                    </div>
                </div>

                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-4 px-4 sm:px-6" aria-label="Tabs">
                        {['all', 'unread', 'read'].map(tab => (
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
                    </nav>
                </div>

                <ul className="divide-y divide-gray-200">
                    {filteredNotifications().length > 0 ? (
                        filteredNotifications().map(notification => (
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
