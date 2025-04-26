import React, { useState, useEffect, useCallback } from 'react';
import { PiBell } from 'react-icons/pi';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NotificationBadge = () => {
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [newNotifications, setNewNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const { user } = useSelector((state) => state.user);

    const fetchNewNotifications = useCallback(async () => {
        if (user?._id) {
            try {
                const response = await fetch(SummaryApi.getNewNotifications.url, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                if (data.success && data.newNotifications && data.newNotifications.length > 0) {
                    setNewNotifications(prev => {
                        const trulyNew = data.newNotifications.filter(
                            (newItem) => !prev.some((existingItem) => existingItem._id === newItem._id)
                        );
                        if (trulyNew.length > 0) {
                            setNewNotifications([...prev, ...trulyNew]);
                            setShowPopup(true);
                            setTimeout(() => {
                                setShowPopup(false);
                            }, 5000);
                        }
                        return prev;
                    });
                }
            } catch (error) {
                console.error("Error fetching new notifications:", error);
            }
        }
    }, [user?._id]);

    const fetchUnreadCount = useCallback(async () => {
        if (user?._id) {
            try {
                const response = await fetch(SummaryApi.notificationCount.url, {
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                const data = await response.json();
                if (data.success) {
                    setUnreadNotificationCount(data.count);
                } else {
                    console.error("Failed to fetch unread notification count:", data.message);
                }
            } catch (error) {
                console.error("Error fetching unread notification count:", error);
            }
        }
    }, [user?._id]);

    useEffect(() => {
        fetchUnreadCount();

        const unreadCountIntervalId = setInterval(fetchUnreadCount, 5000);
        const newNotificationsIntervalId = setInterval(fetchNewNotifications, 5000);

        return () => {
            clearInterval(unreadCountIntervalId);
            clearInterval(newNotificationsIntervalId);
        };
    }, [fetchUnreadCount, fetchNewNotifications]);

    const handleNotificationClick = useCallback(() => {
        setShowPopup(false);
        setNewNotifications([]);
    }, []);

    return (
        <div className="relative">
            <PiBell size={28} className="text-gray-600 hover:text-blue-700 transition duration-200 cursor-pointer" onClick={handleNotificationClick} />
            {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 right-0.5 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotificationCount > 20 ? '20+' : unreadNotificationCount}
                </span>
            )}

            {showPopup && newNotifications.length > 0 && (
                <div className="absolute top-10 right-0 w-64 bg-white shadow-md rounded-md overflow-hidden z-50 border border-gray-300">
                    <div className="p-3 border-b border-gray-200">
                        New Notifications
                    </div>
                    {newNotifications.map((notification, index) => (
                        <Link
                            key={notification._id}
                            to={notification.link || "/notifications"}
                            className="block px-4 py-2 text-sm hover:bg-gray-100 truncate"
                            onClick={() => {
                                setShowPopup(false);
                                setNewNotifications([]);
                            }}
                        >
                            {notification.message}
                        </Link>
                    ))}
                    <Link
                        to="/notifications"
                        className="block px-4 py-2 text-center text-blue-500 text-sm hover:bg-gray-100"
                        onClick={() => {
                            setShowPopup(false);
                            setNewNotifications([]);
                        }}
                    >
                        See All Notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationBadge;