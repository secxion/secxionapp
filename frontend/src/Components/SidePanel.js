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

const SidePanel = ({ open, setOpen, handleLogout, loading }) => {
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

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setOpen}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-100 pr-10">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-200 sm:duration-200"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200 sm:duration-200"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-80 max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-800 shadow-xl justify-between">
                    <div className="flex-shrink-0 px-4 py-6 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
                          <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">S E C X I O N</span>
                        </Link>
                        <button
                          type="button"
                          className="-m-2.5 rounded-md p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      <nav className="space-y-6">
                        <div className="space-y-1">
                          <div className="space-y-1">
                            <Link
                              to="/home"
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300"
                              onClick={() => setOpen(false)}
                            >
                              <HomeIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                              Home
                            </Link>
                            <Link
                              to="/report"
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300"
                              onClick={() => setOpen(false)}
                            >
                              <InformationCircleIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                              Get In Touch
                            </Link>
                           
                          </div>
                        </div>
                        <div className="space-y-1">
                          <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Account</h3>
                          <div className="space-y-1">
                            <Link
                              to="/mywallet"
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300"
                              onClick={() => setOpen(false)}
                            >
                              <FaWallet className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />                              
                              Wallet
                            </Link>
                            <Link
                              to="/profile"
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300"
                              onClick={() => setOpen(false)}
                            >
                              <UserIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                              My Profile
                            </Link>
                            {useSelector((state) => state.user.user)?.role === ROLE.ADMIN && (
                              <Link
                                to="/admin-panel/all-products"
                                className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300"
                                onClick={() => setOpen(false)}
                              >
                                <Cog6ToothIcon className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                                Admin Panel
                              </Link>
                            )}
                            <button
                              onClick={() => {
                                handleLogout();
                                setOpen(false);
                              }}
                              className="group flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 text-gray-600 dark:text-gray-300 w-full text-left"
                              disabled={loading}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 dark:text-gray-500"
                                viewBox="0 0 24 24"
                              >
                                  <path
                                    fill="currentColor"
                                    d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9Z"
                                  />
                                </svg>
                                {loading ? "Logging out..." : "Logout"}
                              </button>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <h3 className="px-3 text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</h3>
                            <div className="px-3 py-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400 dark:text-gray-500">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <Clock format={'HH:mm:ss'} ticking={true} timezone={timezone} className="text-sm text-gray-600 dark:text-gray-300" />
                              </div>
                              <div className="relative">
                                <div onClick={toggleTimezones} className="cursor-pointer text-xs text-gray-500 dark:text-gray-400">
                                  {getSelectedTimezoneLabel() || 'Select Timezone'}
                                  <svg className="w-3 h-3 inline-block ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </div>
                                {showTimezones && (
                                  <div className="absolute left-0 mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-md z-10 overflow-y-auto max-h-40">
                                    {timezones.map((tz) => (
                                      <div
                                        key={tz.value}
                                        onClick={() => handleTimezoneChange(tz.value)}
                                        className="px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
                                      >
                                        {tz.label}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </nav>
                      </div>
                      <div className="py-6 px-4 sm:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        <p className="mb-2">© 2025 SecXion, Inc.</p>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  };
  export default SidePanel;