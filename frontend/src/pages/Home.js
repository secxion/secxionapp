import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWallet, FaUser, FaCog, FaStore, FaBook, FaClipboardList, FaComment } from "react-icons/fa";
import './Home.css'; // Import the CSS file

const menuItems = [
    { label: "Wallet", path: "/mywallet", color: "bg-blue-600", icon: <FaWallet className="text-4xl md:text-5xl" /> },
    { label: "Profile", path: "/profile", color: "bg-green-600", icon: <FaUser className="text-4xl md:text-5xl" /> },
    { label: "Settings", path: "/settings", color: "bg-yellow-600", icon: <FaCog className="text-4xl md:text-5xl" /> },
    { label: "Market", path: "/section", color: "bg-red-600", icon: <FaStore className="text-4xl md:text-5xl" /> },
    { label: "DataPad", path: "/datapad", color: "bg-purple-600", icon: <FaBook className="text-4xl md:text-5xl" /> },
    { label: "Record", path: "/record", color: "bg-indigo-600", icon: <FaClipboardList className="text-4xl md:text-5xl" /> },
];

const Home = () => {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-start p-6 pt-20 md:pt-24 w-full relative">
            {/* Header */}
            <motion.h1
                className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                Welcome to Secxion
            </motion.h1>

            <p className="text-gray-700 dark:text-gray-300 text-center mt-4 text-lg md:text-xl max-w-2xl">
                Your trusted platform for gift card trading and seamless digital transactions.
            </p>

            {/* Menu Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10 w-full max-w-6xl">
                {menuItems.map((item, index) => (
                    <motion.div
                        key={index}
                        className={`rounded-xl shadow-lg transition-shadow ${item.color} transform w-full glassmorphic-card`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Link to={item.path} className="flex flex-col items-center justify-center p-6 text-white w-full h-full" aria-label={item.label}>
                            <div className="p-3 rounded-full bg-black/15">
                                {item.icon}
                            </div>
                            <span className="text-lg md:text-xl font-semibold mt-3 text-gray-100">{item.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Home;