import React, { useState } from 'react';
import { FaBlog, FaBars, FaUser, FaWallet } from 'react-icons/fa';
import Clock from 'react-live-clock';
import timezones from '../helpers/timeZones';
import { Link } from 'react-router-dom';

const HomeFooter = ({ onBlogClick, onMenuClick, isBlogVisible }) => {
    const [timezone, setTimezone] = useState('Africa/Lagos');
    const [showTimezones, setShowTimezones] = useState(false);

    const toggleTimezones = () => {
        setShowTimezones(!showTimezones);
    };

    const handleTimezoneChange = (newTimezone) => {
        setTimezone(newTimezone);
        setShowTimezones(false);
    };

    const getSelectedTimezoneLabel = () => {
        const selected = timezones.find((tz) => tz.value === timezone);
        return selected ? selected.label : '';
    };

    return (
        <footer className="fixed bottom-0 left-0 right-0 shadow-md bg-white border-t-2 border-gray-300 dark:border-gray-700 shadow-md z-40">
            <div className="flex justify-around items-center px-4 py-2">
                <button
                    onClick={isBlogVisible ? onMenuClick : onBlogClick}
                    className="minecraft-font flex flex-col items-center text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                    aria-label={isBlogVisible ? 'Navigate to Menu' : 'View Blogs'}
                >
                    {isBlogVisible ? (
                        <FaBars className="text-xl mb-1" />
                    ) : (
                        <FaBlog className="text-xl mb-1" />
                    )}
                    {isBlogVisible ? 'Menu' : 'Blogs'}
                </button>

                <Link
                    to="/profile"
                    className="minecraft-font flex flex-col items-center text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                    aria-label="View Profile"
                >
                    <FaUser className="text-xl mb-1" />
                    Profile
                </Link>

                <Link
                    to="/mywallet"
                    className="minecraft-font flex flex-col items-center text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                    aria-label="View wallet"
                >
                    <FaWallet className="text-xl mb-1" />
                    Wallet
                </Link>

                {/* <div className="relative items-center text-sm text-black dark:text-gray-200">
                    <div className="items-center space-x-2 cursor-pointer" onClick={toggleTimezones}>
                        <Clock format={'HH:mm:ss'} ticking={true} timezone={timezone} />
                        <div className="text-bold text-xs mt-1">{getSelectedTimezoneLabel()}</div>
                        {showTimezones && (
                            <div className="absolute bottom-full text-black left-0 border border-gray-300 dark:border-gray-600 rounded-md shadow-md z-10 overflow-y-auto max-h-40">
                                {timezones.map((tz) => (
                                    <div
                                        key={tz.value}
                                        onClick={() => handleTimezoneChange(tz.value)}
                                        className="px-3 py-2 text-xs text-black cursor-pointer hover:bg-gray-500 dark:hover:bg-gray-600"
                                    >
                                        {tz.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div> */}
            </div>
        </footer>
    );
};

export default HomeFooter;