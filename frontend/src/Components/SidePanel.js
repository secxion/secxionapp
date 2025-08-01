import React, { useState, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Dialog, Transition } from '@headlessui/react';
import {
  HomeIcon,
  GlobeAltIcon,
  UserIcon,
  InformationCircleIcon,
  WalletIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  ShoppingBagIcon,
  ClockIcon,
  XMarkIcon,
  ChevronDownIcon,
  CheckIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import Clock from 'react-live-clock';
import timezones from '../helpers/timeZones';
import './Header.css';
import LogoShimmer from "./LogoShimmer";

const SidePanel = ({ open, setOpen, handleLogout, loading, onCloseMenu }) => {
  const [timezone, setTimezone] = useState('Africa/Lagos');
  const [showTimezones, setShowTimezones] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const toggleTimezones = () => setShowTimezones(!showTimezones);
  const handleTimezoneChange = (newTimezone) => {
    setTimezone(newTimezone);
    setShowTimezones(false);
  };
  const getSelectedTimezoneLabel = () => {
    const selected = timezones.find((tz) => tz.value === timezone);
    return selected ? selected.label : '';
  };
  const handleLinkClick = () => {
    onCloseMenu?.();
    setOpen(false);
  };
  const handleLogoutClick = async () => {
    if (!loading) {
      handleLogout();
      setOpen(false);
      navigate('/login');
    }
  };

  const navigationItems = [
    { path: '/home', icon: HomeIcon, label: 'Home', gradient: 'from-blue-500 to-cyan-400' },
    { path: '/section', icon: ShoppingBagIcon, label: 'Marketplace', gradient: 'from-purple-500 to-pink-400' },
    { path: '/profile', icon: UserIcon, label: 'Profile', gradient: 'from-green-500 to-emerald-400' },
    { path: '/record', icon: InformationCircleIcon, label: 'Trade Status', gradient: 'from-orange-500 to-yellow-400' },
    { path: '/mywallet', icon: WalletIcon, label: 'Wallet', gradient: 'from-indigo-500 to-purple-400' },
    { path: '/datapad', icon: DocumentTextIcon, label: 'DataPad', gradient: 'from-teal-500 to-cyan-400' },
    { path: '/report', icon: ChatBubbleBottomCenterTextIcon, label: 'Connect with us', gradient: 'from-rose-500 to-pink-400' },
  ];

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 md:hidden" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform ease-in-out duration-500"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform ease-in-out duration-500"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="relative flex flex-col w-full max-w-sm h-full overflow-hidden bg-white text-black shadow-xl ">
            
            <div className="relative z-10 flex flex-col w-full h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-2 mt-6 pt-4 border-b border-gray-200">
                <button
                  type="button"
                  className="text-gray-500 hover:text-black transition-colors duration-200 glossy-text"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-8 w-8" />
                </button>

                <Link to= "/home" className="relative">
                           <div className=" flex py-1 flex-col justify-center">
                                                                          <div className="relative py-2  sm:mx-auto ">
                                                                              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform rounded-3xl border-4 border-yellow-700"></div>
                                                                              <div className="relative px-4 p-1.5 bg-white shadow-lg rounded-2xl sm:p-1.5 border-4 border-yellow-700">
                                                                                  <div className="">
                                                                                      <div className="grid grid-cols-1">                    
                                                                                          <LogoShimmer type="button" />
                                                                                      </div>
                                                                                  </div>
                                                                              </div>
                                                                          </div>
                                                                      </div>
                                      <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
                          
                        </Link>

                <button
                  onClick={handleLogoutClick}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-xs font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 glossy-text border-4 border-yellow-500" // Added bold yellow border and glossy-text
                >
                  <ArrowRightOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">
                {navigationItems.map(({ path, icon: Icon, label, gradient }) => (
                  <Link
                    key={label}
                    to={path}
                    onClick={handleLinkClick}
                    className="group flex items-center px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 border-4 border-yellow-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg" // Added bold yellow border
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-gray-800 group-hover:text-black font-medium text-sm transition-colors duration-200 glossy-text"> {/* Applied glossy-text */}
                      {label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Timezone Selector */}
              <div className="px-4 py-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={toggleTimezones}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 border-4 border-yellow-500 rounded-xl text-gray-800 hover:text-black transition-all duration-300 group" // Added bold yellow border
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 mr-3">
                      <GlobeAltIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium glossy-text"> {/* Applied glossy-text */}
                      {getSelectedTimezoneLabel() || 'Select Timezone'}
                    </span>
                  </div>
                  <ChevronDownIcon className={`h-5 w-5 text-gray-500 transform transition-transform duration-300 ${showTimezones ? 'rotate-180' : ''} group-hover:text-black glossy-text`} /> {/* Applied glossy-text */}
                </button>

                {showTimezones && (
                  <div className="mt-3 bg-gray-100 border-4 border-yellow-500 rounded-xl shadow-2xl max-h-48 overflow-y-auto"> {/* Added bold yellow border */}
                    <ul className="py-2">
                      {timezones.map((tz) => (
                        <li key={tz.value}>
                          <button
                            onClick={() => handleTimezoneChange(tz.value)}
                            className={`w-full text-left px-4 py-2 hover:bg-gray-200 transition-colors duration-200 text-sm ${
                              timezone === tz.value ? 'text-cyan-700 font-semibold bg-gray-200' : 'text-gray-800 hover:text-black'
                            } glossy-text`} // Applied glossy-text
                          >
                            <div className="flex items-center justify-between">
                              <span>{tz.label}</span>
                              {timezone === tz.value && <CheckIcon className="h-4 w-4 text-cyan-600 glossy-text" />} {/* Applied glossy-text */}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Clock Display */}
              <div className="px-4 py-6 text-center border-t border-gray-200">
                <div className="bg-gray-100 border-4 border-yellow-500 rounded-xl p-4"> {/* Added bold yellow border */}
                  <div className="flex items-center justify-center mb-2">
                    <ClockIcon className="h-5 w-5 text-cyan-600 mr-2 glossy-text" /> {/* Applied glossy-text */}
                    <span className="text-gray-600 text-xs uppercase tracking-wide font-medium glossy-text">Current Time</span> {/* Applied glossy-text */}
                  </div>
                  <Clock
                    format={'HH:mm:ss'}
                    ticking={true}
                    timezone={timezone}
                    className="text-2xl font-bold text-black mb-1 tabular-nums glossy-heading" // Applied glossy-heading
                  />
                  <Clock
                    format={'dddd, MMMM Do YYYY'}
                    ticking={true}
                    timezone={timezone}
                    className="text-sm text-gray-600 font-medium glossy-text" // Applied glossy-text
                  />
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
};

export default SidePanel;