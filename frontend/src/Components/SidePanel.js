import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ROLE from "../common/role";
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  PhoneIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';
import { PiUserSquare as UserIcon } from "react-icons/pi";
import { FaBlog, FaWallet } from 'react-icons/fa';
import Clock from 'react-live-clock';
import timezones from '../helpers/timeZones';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faBars, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
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
          enter="ease-in-out duration-300 transform"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="ease-in-out duration-300 transform"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="relative flex w-screen max-w-md flex-col bg-white pt-6 pb-4 overflow-y-auto">
            {/* Top Bar */}
            <div className="absolute left-0 w-full flex justify-between items-center bg-white px-4 py-9 shadow-sm">
              
              
              <button
                type="button"
                            className="text-gray-500 hover:text-blue-600 md:hidden"
                onClick={() => setOpen(false)}
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </button>

              <Link to="/notifications" title="Notifications" aria-label="Notifications" onClick={handleLinkClick}>
                <NotificationBadge />
              </Link>

              <div className="">
              <button
                onClick={handleLogout}
                className=" items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </button>
            </div>
            </div>

            {/* Logout at Top */}
            <div className="mt-14 px-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-red-700"
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Logout
              </button>
            </div>

            {/* Navigation */}
            <nav className="mt-4 space-y-2 px-3">
              {[
                { path: '/', icon: <HomeIcon className="h-5 w-5" />, label: 'Home' },
                { path: '/section', icon: <GlobeAltIcon className="h-5 w-5" />, label: 'Marketplace' },
                { path: '/profile', icon: <UserIcon className="h-5 w-5" />, label: 'Profile' },
                { path: '/record', icon: <InformationCircleIcon className="h-5 w-5" />, label: 'Trade Status' },
                { path: '/mywallet', icon: <FaWallet className="h-5 w-5" />, label: 'Wallet' },
                { path: '/datapad', icon: <FaBlog className="h-5 w-5" />, label: 'DataPad' },
                { path: '/report', icon: <PhoneIcon className="h-5 w-5" />, label: 'Connect with us' },
                ...(user?.role === ROLE.ADMIN
                  ? [{
                      path: '/admin-panel',
                      icon: <Cog6ToothIcon className="h-5 w-5" />,
                      label: 'Admin Panel',
                    }]
                  : []),
              ].map(({ path, icon, label }) => (
                <Link
                  key={label}
                  to={path}
                  onClick={handleLinkClick}
                  className="group flex items-center border border-gray-200 rounded-md px-3 py-2 bg-white text-gray-700 hover:bg-gray-100 hover:text-primary-500 transition-all text-[12px] minecraft-font"
                >
                  <span className="mr-3 text-gray-400 group-hover:text-primary-500">{icon}</span>
                  {label}
                </Link>
              ))}
            </nav>

            {/* Timezone Selector */}
            <div className="mt-6 px-4">
              <button
                type="button"
                className="group flex w-full items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 hover:text-primary-500"
                onClick={toggleTimezones}
              >
                <GlobeAltIcon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-primary-500" />
                {getSelectedTimezoneLabel() || 'Select Timezone'}
                <svg
                  className={`ml-auto h-5 w-5 text-gray-400 transition-transform ${showTimezones ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </button>

              {showTimezones && (
                <div className="mt-1 rounded-md bg-white shadow">
                  <ul className="max-h-48 overflow-y-auto py-1 text-sm">
                    {timezones.map((tz) => (
                      <li key={tz.value}>
                        <button
                          onClick={() => handleTimezoneChange(tz.value)}
                          className={`group flex w-full items-center py-2 px-3 hover:bg-gray-100 ${timezone === tz.value ? 'text-primary-500 font-semibold' : 'text-gray-900'}`}
                        >
                          {tz.label}
                          {timezone === tz.value && (
                            <svg className="ml-auto h-5 w-5 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Clock */}
            <div className="mt-4 text-center">
              <Clock format={'HH:mm:ss'} ticking={true} timezone={timezone} className="text-lg font-semibold text-gray-700" />
              <Clock format={'dddd, MMMM Do YYYY'} ticking={true} timezone={timezone} className="text-sm text-gray-500" />
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SidePanel;
