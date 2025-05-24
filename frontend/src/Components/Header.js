import React, { useContext, useState, useMemo, useCallback, useEffect, useRef } from "react";
import { FcSearch } from "react-icons/fc";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import { useSound } from "../Context/SoundContext";
import { useDebounce } from "../hooks/useDebounce";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faSignOutAlt, faVolumeUp, faVolumeMute } from '@fortawesome/free-solid-svg-icons';
import { PiBell } from 'react-icons/pi';
import notificationSound from '../Assets/notification.mp3';
import ROLE from "../common/role";
import SummaryApi from "../common";
import { BiSearch } from 'react-icons/bi';
import SidePanel from "./SidePanel";
import './Header.css';
import './Pop.css';

const Header = () => {
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const { soundEnabled, toggleSound } = useSound();
    const {token} = useContext(Context);
    const navigate = useNavigate();
    const searchInput = useLocation();
    const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [animateNotification, setAnimateNotification] = useState(false);
    const audioRef = useRef(null);
    const searchQuery = useMemo(() => {
    const URLSearch = new URLSearchParams(searchInput.search);
        return URLSearch.get("q") || "";
    }, [searchInput]);
    const [search, setSearch] = useState(searchQuery);
    const debouncedSearch = useDebounce(search, 300);

    // Notification Sound
    const playNotificationSound = () => {
        if (soundEnabled && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(err => {
                console.warn("Notification sound failed:", err);
            });
        }
    };

    // Vibration
    const triggerVibration = () => {
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }
    };

    // Function to truncate words
    const truncateWords = (text, limit) => {
        const words = text.split(/\s+/);
        if (words.length > limit) {
            return {
                truncated: words.slice(0, limit).join(' ') + '...',
                original: text,
                isTruncated: true,
            };
        }
        return {
            truncated: text,
            original: text,
            isTruncated: false,
        };
    };

    // Fetch Unread Count
    const fetchUnreadCount = useCallback(async () => {
        if (user?._id) {
            try {
                const response = await fetch(SummaryApi.notificationCount.url, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                if (data.success) {
                    setUnreadNotificationCount(data.count);
                }
            } catch (error) {
                console.error("❌ Error fetching unread count:", error);
            }
        }
    }, [user?._id]);

    // Fetch New Notifications
    const fetchNewNotifications = useCallback(async () => {
        if (user?._id) {
            try {
                const response = await fetch(SummaryApi.getNewNotifications.url, {
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (data.success && Array.isArray(data.newNotifications)) {
                    const latest = data.newNotifications[0];
                    const lastShownId = localStorage.getItem('lastNotifiedId');
                    if (latest && latest._id !== lastShownId) {
                        localStorage.setItem('lastNotifiedId', latest._id);
                        setPopupMessage(latest.message || "New notification received!");
                        setShowPopup(true);
                        setAnimateNotification(true);
                        playNotificationSound();
                        triggerVibration();
                        // Reset animation
                        setTimeout(() => setAnimateNotification(false), 2000);
                        // Hide popup after 4 seconds
                        setTimeout(() => setShowPopup(false), 4000);
                    }
                }
            } catch (error) {
                console.error("❌ Error fetching new notifications:", error);
            }
        }
    }, [user?._id, playNotificationSound, triggerVibration]);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`);
        }
    }, [debouncedSearch, navigate]);

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

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.logout_user.url, {
                method: SummaryApi.logout_user.method,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message);
                dispatch(setUserDetails(null));
                navigate("/");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate, token]);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);
    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
    const truncatedMessage = useMemo(() => truncateWords(popupMessage, 10), [popupMessage]);

    useEffect(() => {
        console.log("Header soundEnabled:", soundEnabled);
    }, [soundEnabled]);

    return (
        <>
            <header className="header-spa left-0 right-0 top-0 pt-8 mb-8 inset-0 bg-black/80 backdrop-blur-md fixed w-full z-50 border-b border-white/20 shadow-md transition-all duration-300 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="w-full mx-auto flex items-center justify-between">
                    {/* Menu Icon */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-500 hover:text-blue-600 md:hidden"
                            aria-expanded={mobileMenuOpen}
                        >
                            <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
                        </button>
                    </div>
                    {/* Logo */}
                    <Link to="/home" className="hidden minecraft-font text-[14px] md:flex items-center font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mr-4 tracking-wide">
                        SXN
                    </Link>
                    {/* Search Input - Desktop */}
                    <div className="hidden md:flex items-center bg-black border-2 rounded-md px-4 py-[6px] w-72 glow-border">
                        <FcSearch className="text-white h-5 w-5 mr-2" />
                        <input
                            type="text"
                            placeholder="Search gift cards..."
                            className="bg-transparent minecraft-font text-white text-[12px] outline-none w-full placeholder:text-[8px] placeholder-gray-600"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {/* Mobile Search */}
                    <div className="md:hidden flex items-center w-full mx-4">
                        <div className="flex items-center bg-black border-2 rounded-md px-2 py-[6px] w-full glow-border">
                            <BiSearch className="text-yellow-700 h-5 w-5 mr-2" />
                            <input
                                type="text"
                                placeholder="Search gift cards..."
                                className="bg-transparent minecraft-font text-white text-[12px] outline-none w-full placeholder:text-[8px] placeholder-gray-600"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* Main Nav */}
                    <nav className="hidden minecraft-font text-[9px] md:flex items-center gap-2">
                        <Link to="/record" className="px-3 py-1 border border-cyan-500 text-gray-900 hover:bg-cyan-600 hover:text-white rounded transition duration-200">
                            Trade Status
                        </Link>

                        <Link to="/datapad" className="px-3 py-1 border border-yellow-500 text-gray-900 hover:bg-yellow-500 hover:text-black rounded transition duration-200">
                            DataPad
                        </Link>
                        {user?.role === ROLE.ADMIN && (
                            <Link to="/admin-panel" className="px-3 py-1 border border-purple-500 text-gray-900 hover:bg-purple-700 hover:text-white rounded transition duration-200">
                                Admin
                            </Link>
                        )}
                        <Link to="/notifications" className="relative px-3 py-1 border border-emerald-500 text-gray-900 hover:bg-emerald-600 hover:text-white rounded transition duration-200">
                            <PiBell className={animateNotification ? 'animate-ping-slow text-2xl' : 'text-2xl'} />
                            {unreadNotificationCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    {unreadNotificationCount}
                                </span>
                            )}
                        </Link>
                        {user?._id && (
                            <button
                                onClick={handleLogout}
                                disabled={loading}
                                className="px-3 py-1 border border-red-500 text-gray-900 hover:bg-red-600 hover:text-white rounded transition flex items-center"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                                Logout
                            </button>
                        )}
                        {/* Audio Toggle Switch - Desktop */}
                        <button
                            onClick={toggleSound}
                            className="px-3 py-1 border border-gray-500 text-gray-900 hover:bg-gray-600 hover:text-white rounded transition flex items-center"
                            title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                        >
                            <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} className="mr-1" />
                            <span className="hidden sm:inline">{soundEnabled ? "Sound On" : "Sound Off"}</span>
                        </button>
                    </nav>

                    {/* Mobile Audio Toggle */}
                    <div className="md:hidden flex items-center ml-4">
                        <button
                            onClick={toggleSound}
                            className="text-gray-500 hover:text-blue-600"
                            title={soundEnabled ? "Disable Sound" : "Enable Sound"}
                        >
                            <FontAwesomeIcon icon={soundEnabled ? faVolumeUp : faVolumeMute} className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Integrated PopAlert */}
                {showPopup && (
                    <div className="pop-alert w-screen right-0 left-0 bg-white text-black px-4 py-8 -mt-4 shadow-lg rounded-lg animate-slide-in">
                        <p className="text-sm font-medium">{truncatedMessage.truncated}</p>
                        {truncatedMessage.isTruncated && (
                            <Link to="/notifications" className="block text-blue-500 hover:underline text-xs">
                                Read More
                            </Link>
                        )}
                    </div>
                )}
                <audio ref={audioRef} src={notificationSound} preload="auto" />
                <SidePanel
                    open={mobileMenuOpen}
                    setOpen={setMobileMenuOpen}
                    handleLogout={handleLogout}
                    loading={loading}
                    onCloseMenu={closeMobileMenu}
                />
            </header>
        </>
    );
};

export default Header;