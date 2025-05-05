import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ROLE from "../common/role";
import { Dialog, Transition } from '@headlessui/react';
import {
  XMarkIcon,
  HomeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PhoneIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/solid';
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

  const toggleTimezones = () => setShowTimezones(!showTimezones);
  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    setShowTimezones(false);
  };
  const getSelectedTimezoneLabel = () => {
    const selected = timezones.find((tz) => tz.value === timezone);
    return selected ? selected.label : '';
  };
  const handleLinkClick = () => onCloseMenu?.();

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 md:hidden" onClose={() => setOpen(false)}>
        <Transition.Child
          as={React.Fragment}
          enter="transition duration-300 ease-in-out transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transition duration-200 ease-in-out transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="relative flex w-screen max-w-md flex-col border-r border-gray-300 bg-gradient-to-b from-white via-gray-50 to-white shadow-2xl pt-12 pb-4 rounded-r-xl">
            {/* Close Button */}
            <div className="absolute top-0 right-0 pt-10 pr-4">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-red-100 transition"
                onClick={() => setOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-red-400 hover:text-red-600" aria-hidden="true" />
              </button>
            </div>

            {/* Notification */}
            <div className="flex justify-center px-4 mt-2">
              <Link to="/notifications" onClick={handleLinkClick}>
                <NotificationBadge />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="mt-6 space-y-2 px-4">
              {[
                { to: "/", icon: HomeIcon, label: "Home" },
                { to: "/section", icon: GlobeAltIcon, label: "Marketplace" },
                { to: "/profile", icon: UserIcon, label: "Profile" },
                { to: "/record", icon: InformationCircleIcon, label: "Trade Status" },
                { to: "/mywallet", icon: FaWallet, label: "Wallet" },
                { to: "/datapad", icon: FaBlog, label: "DataPad" },
                { to: "/report", icon: PhoneIcon, label: "Connect with us" },
                ...(user?.role === ROLE.ADMIN
                  ? [{ to: "/admin-panel", icon: Cog6ToothIcon, label: "Admin Panel" }]
                  : [])
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleLinkClick}
                  className="group flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-200 hover:bg-blue-100 hover:border-blue-300 hover:text-blue-600 transition shadow-sm"
                >
                  <Icon className="h-6 w-6 text-gray-400 group-hover:text-blue-500" />
                  {label}
                </Link>
              ))}
            </nav>

            {/* Timezone Section */}
            <div className="mt-8 px-4">
              <button
                onClick={toggleTimezones}
                className="w-full flex items-center justify-between rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
              >
                <span className="flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5 text-gray-500" />
                  {getSelectedTimezoneLabel() || 'Select Timezone'}
                </span>
                <svg
                  className={`h-5 w-5 text-gray-500 transform transition-transform ${showTimezones ? 'rotate-180' : ''}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {showTimezones && (
                <ul className="mt-2 max-h-48 overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
                  {timezones.map((tz) => (
                    <li key={tz.value}>
                      <button
                        onClick={() => handleTimezoneChange(tz.value)}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                          timezone === tz.value ? 'text-blue-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        {tz.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Clock Display */}
              <div className="mt-6 text-center border border-gray-200 rounded-md py-4 shadow-sm bg-white">
                <Clock
                  format="HH:mm:ss"
                  ticking
                  timezone={timezone}
                  className="text-2xl font-bold text-gray-800"
                />
                <Clock
                  format="dddd, MMMM Do YYYY"
                  ticking
                  timezone={timezone}
                  className="text-sm text-gray-500 mt-1"
                />
              </div>

              {/* Logout Button */}
              <div className="mt-6">
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-md border border-red-600 bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 text-white font-medium shadow-md hover:from-red-600 hover:to-red-800 transition"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  Logout
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
