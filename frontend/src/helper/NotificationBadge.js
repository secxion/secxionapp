import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PiBell } from 'react-icons/pi';
import SummaryApi from '../common';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import notificationSound from '../Assets/notification.mp3';

const NotificationBadge = () => {
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [newNotifications, setNewNotifications] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [animate, setAnimate] = useState(false);
    const { user } = useSelector((state) => state.user);
    const audioRef = useRef(null);

    const playNotificationSound = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.warn("Notification sound could not be played:", err);
            });
        }
    };

    const triggerVibration = () => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
            console.log("🔔 Vibration triggered");
        }
    };

    const fetchNewNotifications = useCallback(async () => {
        if (user?._id) {
            try {
                console.log("📩 Fetching new notifications...");
                const response = await fetch(SummaryApi.getNewNotifications.url, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success && Array.isArray(data.newNotifications) && data.newNotifications.length > 0) {
                    setNewNotifications(prev => {
                        const trulyNew = data.newNotifications.filter(
                            (newItem) => !prev.some((existingItem) => existingItem._id === newItem._id)
                        );
                        if (trulyNew.length > 0) {
                            console.log("✅ New notifications received:", trulyNew);
                            const updated = [...prev, ...trulyNew];
                            setShowPopup(true);
                            setAnimate(true);
                            playNotificationSound();
                            triggerVibration();

                            setTimeout(() => {
                                setShowPopup(false);
                                setAnimate(false);
                            }, 4000); 
                            return updated;
                        }
                        return prev;
                    });
                } else {
                    console.log("📭 No new notifications");
                }
            } catch (error) {
                console.error("❌ Error fetching new notifications:", error);
            }
        }
    }, [user?._id]);

    const fetchUnreadCount = useCallback(async () => {
        if (user?._id) {
            try {
                const response = await fetch(SummaryApi.notificationCount.url, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success) {
                    console.log("🔢 Unread count:", data.count);
                    setUnreadNotificationCount(data.count);
                } else {
                    console.error("Failed to fetch unread count:", data.message);
                }
            } catch (error) {
                console.error("❌ Error fetching unread notification count:", error);
            }
        }
    }, [user?._id]);

    useEffect(() => {
        fetchUnreadCount();
        fetchNewNotifications();

        const unreadCountIntervalId = setInterval(fetchUnreadCount, 5000);
        const newNotificationsIntervalId = setInterval(fetchNewNotifications, 5000);

        return () => {
            clearInterval(unreadCountIntervalId);
            clearInterval(newNotificationsIntervalId);
        };
    }, [fetchUnreadCount, fetchNewNotifications]);

    const handleNotificationClick = useCallback(() => {
        console.log("🔕 Notification clicked");
        setShowPopup(false);
        setNewNotifications([]);
        setAnimate(false);
    }, []);

    return (
        <div className="relative">
            <audio ref={audioRef} src={notificationSound} preload="auto" />
            <PiBell
                size={28}
                className={`text-gray-900 hover:text-blue-400 transition duration-200 cursor-pointer ${animate ? 'animate-bounce' : ''}`}
                onClick={handleNotificationClick}
            />
            {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 right-0.5 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                    {unreadNotificationCount > 20 ? '20+' : unreadNotificationCount}
                </span>
            )}

            {/* Notification Popup */}
            {showPopup && newNotifications.length > 0 && (
                <div className="absolute top-10 right-0 w-72 bg-white shadow-lg rounded-md overflow-hidden z-50 border border-gray-300 animate-fade-in">
                    <div className="p-3 font-semibold text-gray-700 border-b border-gray-200">
                        New Notifications
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {newNotifications.map((notification) => (
                            <Link
                                key={notification._id}
                                to="/notifications"
                                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 truncate"
                                onClick={handleNotificationClick}
                            >
                                {notification.message}
                            </Link>
                        ))}
                    </div>
                    <Link
                        to="/notifications"
                        className="block px-4 py-2 text-center text-blue-600 text-sm hover:bg-gray-100 border-t border-gray-200"
                        onClick={handleNotificationClick}
                    >
                        See All Notifications
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationBadge;
