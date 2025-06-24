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
  Bars3Icon,
  ArrowRightOnRectangleIcon,
  BellIcon
} from '@heroicons/react/24/outline';
import Clock from 'react-live-clock';
import timezones from '../helpers/timeZones';
import NotificationBadge from "../helper/NotificationBadge";
import './Header.css';

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
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-300"
          enterFrom="-translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-100"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-full"
        >
          <Dialog.Panel className="relative flex flex-col w-full max-w-sm h-full overflow-hidden">
            {/* Animated Geometric Background */}
            <div className="absolute inset-0 bg-slate-500">
              {/* Animated shapes */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute top-20 -right-10 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-rose-600/20 rounded-full blur-lg animate-bounce" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-1/2 -left-8 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-600/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 right-4 w-28 h-28 bg-gradient-to-r from-emerald-400/20 to-teal-600/20 rounded-full blur-xl animate-bounce" style={{animationDelay: '3s'}}></div>
                
                {/* Geometric shapes */}
                <div className="absolute top-1/4 left-1/2 w-16 h-16 border border-white/10 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
                <div className="absolute bottom-1/3 left-1/4 w-12 h-12 border border-purple-400/20 rotate-12 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-gradient-to-r from-pink-400/30 to-purple-600/30 transform rotate-45 animate-pulse" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              {/* Overlay for content readability */}
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-10 border-b border-white/10">
                <button
                  type="button"
                  className="text-white/70 hover:text-white transition-colors duration-200"
                  onClick={() => setOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>

                <Link to="/notifications" title="Notifications" aria-label="Notifications" onClick={handleLinkClick}>
                  <div className="relative h-6 w-6 text-white/70 hover:text-white transition-colors duration-200">
                    <NotificationBadge />
                  </div>
                </Link>

                <Link to="/home" onClick={handleLinkClick} className="flex items-center">
                  <div className="logo-wrapper">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                      SXN
                    </h1>
                    <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full mt-1"></div>
                  </div>
                </Link>

                <button
                  onClick={handleLogoutClick}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white text-sm font-medium py-2 px-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
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
                    className="group flex items-center px-4 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
                  >
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r ${gradient} mr-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-white/90 group-hover:text-white font-medium text-sm transition-colors duration-200">
                      {label}
                    </span>
                  </Link>
                ))}
              </nav>

              {/* Timezone Selector */}
              <div className="px-4 py-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={toggleTimezones}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl text-white/90 hover:text-white transition-all duration-300 group"
                >
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 mr-3">
                      <GlobeAltIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">
                      {getSelectedTimezoneLabel() || 'Select Timezone'}
                    </span>
                  </div>
                  <ChevronDownIcon 
                    className={`h-5 w-5 text-white/60 transform transition-transform duration-300 ${showTimezones ? 'rotate-180' : ''} group-hover:text-white/80`}
                  />
                </button>

                {showTimezones && (
                  <div className="mt-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-48 overflow-y-auto">
                    <ul className="py-2">
                      {timezones.map((tz) => (
                        <li key={tz.value}>
                          <button
                            onClick={() => handleTimezoneChange(tz.value)}
                            className={`w-full text-left px-4 py-2 hover:bg-white/10 transition-colors duration-200 text-sm ${
                              timezone === tz.value 
                                ? 'text-cyan-300 font-semibold bg-white/5' 
                                : 'text-white/80 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{tz.label}</span>
                              {timezone === tz.value && (
                                <CheckIcon className="h-4 w-4 text-cyan-300" />
                              )}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Time Display */}
              <div className="px-4 py-6 text-center border-t border-white/10">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-center mb-2">
                    <ClockIcon className="h-5 w-5 text-cyan-400 mr-2" />
                    <span className="text-white/60 text-xs uppercase tracking-wide font-medium">Current Time</span>
                  </div>
                  <Clock
                    format={'HH:mm:ss'}
                    ticking={true}
                    timezone={timezone}
                    className="text-2xl font-bold text-white mb-1 tabular-nums"
                  />
                  <Clock
                    format={'dddd, MMMM Do YYYY'}
                    ticking={true}
                    timezone={timezone}
                    className="text-sm text-white/60 font-medium"
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