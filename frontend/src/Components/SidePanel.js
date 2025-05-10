import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ROLE from "../common/role";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, HomeIcon, GlobeAltIcon, InformationCircleIcon, PhoneIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { PiUserSquare as UserIcon } from "react-icons/pi";
import { FaBlog, FaWallet } from 'react-icons/fa';
import Clock from 'react-live-clock';
import timezones from '../helpers/timeZones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import NotificationBadge from "../helper/NotificationBadge";


const SidePanel = ({ open, setOpen, handleLogout, loading, onCloseMenu }) => {
    const [timezone, setTimezone] = useState('Africa/Lagos');
    const [showTimezones, setShowTimezones] = useState(false);
    const { user } = useSelector((state) => state.user);

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

    const handleLinkClick = () => {
        if (onCloseMenu) {
            onCloseMenu();
        }
    };

    return (
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog as="div" className="fixed inset-0 z-50 md:hidden" onClose={() => setOpen(false)}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-in-out duration-300 transform"
                    enterFrom="-translate-x-full"
                    enterTo="translate-x-0"
                    leave="ease-in-out duration-300 transform"
                    leaveFrom="translate-x-0"
                    leaveTo="-translate-x-full"
                >
                    <Dialog.Panel className="relative flex w-screen max-w-md flex-col bg-white pt-12 pb-4">
                        <div className="absolute bg-white top-0 right-0 pt-10">
                            <button
                                type="button"
                                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                                onClick={() => setOpen(false)}
                            >
                                <span className="sr-only">Close sidebar</span>
                                <XMarkIcon className="h-6 w-6 text-red-400 hover:text-red-700" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="flex flex-shrink-0 items-center justify-center px-4 mt-2 -mb-2">
                            <Link to="/notifications" title="Notifications" aria-label="Notifications" className="relative" onClick={handleLinkClick}>
                            <NotificationBadge />
                        </Link>
                        </div>
                        <nav className="mt-5 space-y-1 px-2">
                            <Link to="/" className="bg-gray-100 text-gray-900 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <HomeIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                Home
                            </Link>
                            <Link to="/section" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <GlobeAltIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                Marketplace
                            </Link>
                            <Link to="/profile" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <UserIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" />
                                Profile
                            </Link>
                            <Link to="/record" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <InformationCircleIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                Trade Status
                            </Link>
                            <Link to="/mywallet" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <FaWallet className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" />
                                Wallet
                            </Link>
                            <Link to="/datapad" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <FaBlog className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" />
                                DataPad
                            </Link>
                            <Link to="/report" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                <PhoneIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                Connect with us
                            </Link>
                            {user?.role === ROLE.ADMIN && (
                                <Link to="/admin-panel" className="text-gray-600 group flex items-center rounded-md px-2 py-2 text-base font-medium hover:bg-gray-200 hover:text-primary-500" onClick={handleLinkClick}>
                                    <Cog6ToothIcon className="mr-3 h-6 w-6 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                    Admin Panel
                                </Link>
                            )}
                        </nav>
                        <div className="mt-8 px-2">
                            <div className="relative">
                                <button
                                    type="button"
                                    className="group flex items-center rounded-md bg-gray-100 px-2 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    onClick={toggleTimezones}
                                >
                                    <GlobeAltIcon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary-500" aria-hidden="true" />
                                    {getSelectedTimezoneLabel() || 'Select Timezone'}
                                    <svg
                                        className={`ml-auto h-5 w-5 text-gray-400 transition-transform ${showTimezones ? 'rotate-180' : ''}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                {showTimezones && (
                                    <div className="mt-1 rounded-md bg-white shadow-lg">
                                        <ul className="max-h-48 scroll-py-1 overflow-y-auto rounded-md py-1 text-sm">
                                            {timezones.map((tz) => (
                                                <li key={tz.value}>
                                                    <button
                                                        onClick={() => handleTimezoneChange(tz.value)}
                                                        className={`group flex w-full items-center py-2 pl-3 pr-9 hover:bg-gray-100 hover:text-primary-500 ${timezone === tz.value ? 'text-primary-500' : 'text-gray-900'}`}
                                                    >
                                                        <span className="truncate">{tz.label}</span>
                                                        {timezone === tz.value && (
                                                            <span className="absolute right-4 text-primary-500">
                                                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 text-center">
                                <Clock format={'HH:mm:ss'} ticking={true} timezone={timezone} className="text-xl font-semibold text-gray-700" />
                                <Clock format={'dddd, MMMM Do YYYY'} ticking={true} timezone={timezone} className="text-sm text-gray-500" />
                            </div>
                            <div className="mt-6">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={loading}
                                >
                                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
                                </button>
                            </div>
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition.Root>
    );
};

export default SidePanel;