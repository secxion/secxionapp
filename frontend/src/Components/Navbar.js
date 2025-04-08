import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaBell, FaBars, FaTimes } from "react-icons/fa";
import NotificationPanel from "./NotificationPanel";
import logo from "../Assets/1.svg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(0);

  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      // Fetch notifications only if user is logged in
      const fetchNotifications = async () => {
        setNotifications(3);
      };
      fetchNotifications();
    }
  }, [user]);

  return (
    <nav className="fixed top-[2rem] left-0 w-full bg-white dark:bg-gray-900 shadow-md border border-black py-2 px-4 flex justify-between items-center z-40 h-16">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-[200px] w-[300px] object-cover p-6 pt-10" />
      </div>

      {/* Notification Panel (Hidden on mobile) */}
      <div className="md:flex hidden">
        <NotificationPanel />
      </div>

      {/* User and Notification */}
      <div className="flex items-center gap-4">
        {/* User Display */}
        <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded-lg shadow-md border border-black">
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <span className="ml-1 text-blue-600 dark:text-blue-400 font-bold">@</span>
            <span className="ml-1">{user?.name || "Guest"}</span>
          </span>
        </div>

        {/* Notifications Bell Icon (Shown only if user is logged in) */}
        {user && (
          <Link to="/chat" className="relative">
            <FaBell className="text-xl text-gray-700 dark:text-gray-300 cursor-pointer" />
            {notifications > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
                {notifications}
              </span>
            )}
          </Link>
        )}

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-gray-900 shadow-lg py-4 flex flex-col items-center md:hidden transition-all duration-300 border-t border-black">
          <Link to="/wallet" className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-blue-500">Wallet</Link>
          <Link to="/profile" className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-blue-500">Profile</Link>
          <Link to="/settings" className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-blue-500">Settings</Link>
          <Link to="/market" className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-blue-500">Market</Link>
          {user && (
            <Link to="/chat" className="text-lg font-semibold text-gray-900 dark:text-gray-100 py-2 hover:text-blue-500">
              Notifications
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
