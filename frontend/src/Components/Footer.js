import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGlobe, FaClock, FaCaretDown } from "react-icons/fa"; // Import dropdown icon
import timezones from "../helpers/timeZones";
import "./Footer.css"

const Footer = () => {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [selectedTimezone, setSelectedTimezone] = useState(
        localStorage.getItem("selectedTimezone") || "local"
    );
    const [userLocation, setUserLocation] = useState({
        ip: "Fetching...",
        country: "Detecting...",
        city: "Loading...",
        timezone: "",
    });
    const [loading, setLoading] = useState(true);
    const [showTimezoneDropdownMobile, setShowTimezoneDropdownMobile] = useState(false);

    useEffect(() => {
        const fetchUserIP = async () => {
            try {
                const response = await fetch("https://ipapi.co/json/");
                if (!response.ok) throw new Error("IP API failed");

                const data = await response.json();
                if (!data.ip) throw new Error("Invalid API response");

                setUserLocation({
                    ip: data.ip || "Unknown",
                    country: data.country_name || "Unknown",
                    city: data.city || "Unknown",
                    timezone: data.timezone || "UTC",
                });

                if (!localStorage.getItem("selectedTimezone") && data.timezone) {
                    setSelectedTimezone(data.timezone);
                    localStorage.setItem("selectedTimezone", data.timezone);
                }

            } catch (error) {
                console.error("Error fetching location:", error);
                try {
                    const backupResponse = await fetch("https://ipwho.is/");
                    if (!backupResponse.ok) throw new Error("Backup API failed");
                    const backupData = await backupResponse.json();
                    setUserLocation({
                        ip: backupData.ip || "Unknown",
                        country: backupData.country || "Unknown",
                        city: backupData.city || "Unknown",
                        timezone: backupData.timezone || "UTC",
                    });
                } catch (backupError) {
                    console.error("Backup API also failed:", backupError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserIP();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTimezoneChange = (event) => {
        const newTimezone = event.target.value;
        setSelectedTimezone(newTimezone);
        localStorage.setItem("selectedTimezone", newTimezone);
        setShowTimezoneDropdownMobile(false);
    };

    const formatTime = () => {
        return new Intl.DateTimeFormat("en-US", {
            timeZone: selectedTimezone === "local" ? undefined : selectedTimezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        }).format(currentTime);
    };

    const handleSupportClick = () => {
        document.body.classList.add("fade-out");
        setTimeout(() => {
            navigate("/report");
            document.body.classList.remove("fade-out");
        }, 300);
    };

    const toggleTimezoneDropdownMobile = () => {
        setShowTimezoneDropdownMobile(!showTimezoneDropdownMobile);
    };

    return (
        <footer className=" bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 py-4 border-t border-gray-300 dark:border-gray-700">
            <div className="container mx-auto px-4 flex flex-col items-center md:flex-row md:justify-between gap-y-3 md:gap-y-0">
                <motion.button
                    className="flex flex-col bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-200"
                    onClick={handleSupportClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get In touch With Us
                </motion.button>

                <div className="flex items-center gap-2 md:hidden">
                    <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <p className="font-medium">{formatTime()}</p>
                    </div>
                    <motion.button
                        onClick={toggleTimezoneDropdownMobile}
                        className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner flex items-center"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaCaretDown />
                    </motion.button>
                    {showTimezoneDropdownMobile && (
                        <motion.select
                            value={selectedTimezone}
                            onChange={handleTimezoneChange}
                            className="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg overflow-y-auto max-h-48 z-10"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {timezones.map((tz) => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label}
                                </option>
                            ))}
                        </motion.select>
                    )}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <p className="font-medium">{formatTime()} — {currentTime.toDateString()}</p>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        <FaGlobe className="inline mr-1" /> {loading ? "Loading..." : `${userLocation.city}, ${userLocation.country}`}
                    </p>
                    <div className="relative">
                        <select
                            value={selectedTimezone}
                            onChange={handleTimezoneChange}
                            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                        >
                            {timezones.map((tz) => (
                                <option key={tz.value} value={tz.value}>
                                    {tz.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <motion.p
                className="mt-4 text-center text-gray-500 dark:text-gray-400 text-xs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                &copy; {new Date().getFullYear()} Secxion. All rights reserved.
            </motion.p>
        </footer>
    );
};

export default Footer;