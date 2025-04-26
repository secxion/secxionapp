import React, { useContext, useState, useMemo, useCallback, useEffect } from "react";
import { FcSearch } from "react-icons/fc";
import { PiUserSquare } from "react-icons/pi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import { useDebounce } from "../hooks/useDebounce";
import NotificationBadge from "../helper/NotificationBadge";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SidePanel from "./SidePanel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import ROLE from "../common/role";
import SummaryApi from "../common";
import { BiSearch } from 'react-icons/bi';
import './Header.css';

// ===============================
// Search Panel Component (Mobile)
// ===============================
const SearchPanelMobile = ({ open, setOpen, search, setSearch, handleSearch }) => {
    return (
        <Transition.Root show={open} as={React.Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setOpen}>
                <Transition.Child
                    as={React.Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-x-0 bottom-0 flex max-w-full">
                            <Transition.Child
                                as={React.Fragment}
                                enter="transform transition ease-in-out duration-200 sm:duration-200"
                                enterFrom="translate-y-full"
                                enterTo="translate-y-0"
                                leave="transform transition ease-in-out duration-200 sm:duration-200"
                                leaveFrom="translate-y-0"
                                leaveTo="translate-y-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-full max-w-md">
                                    <div className="bg-gray-200 py-4 shadow-lg rounded-t-lg">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Search
                                                </Dialog.Title>
                                                <div className="ml-3 h-7 flex items-center">
                                                    <button
                                                        type="button"
                                                        className="rounded-md text-red-500 hover:text-red-800 focus:outline-none focus:ring-indigo-500"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-10 px-4 sm:px-6">
                                        <div className="relative rounded-md shadow-sm">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                                <BiSearch className="h-5 w-5" aria-hidden="true" />
                                            </div>
                                            <input
                                                type="text"
                                                name="search"
                                                id="search"
                                                className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-8 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                                placeholder="Search Trade..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && search.trim()) {
                                                        handleSearch();
                                                        setOpen(false);
                                                    }
                                                }}
                                            />
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
const Header = () => {
    const dispatch = useDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchPanelOpen, setSearchPanelOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.user);
    const { token } = useContext(Context);
    const navigate = useNavigate();
    const searchInput = useLocation();

    const searchQuery = useMemo(() => {
        const URLSearch = new URLSearchParams(searchInput.search);
        return URLSearch.get("q") || "";
    }, [searchInput]);

    const [search, setSearch] = useState(searchQuery);
    const debouncedSearch = useDebounce(search, 300);

    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/search?q=${encodeURIComponent(debouncedSearch)}`);
        }
    }, [debouncedSearch, navigate]);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.logout_user.url, {
                method: SummaryApi.logout_user.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                dispatch(setUserDetails(null));
                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [dispatch, navigate, token]);

    const toggleMobileMenu = useCallback(() => setMobileMenuOpen(prev => !prev), []);
    const toggleSearchPanelOpen = useCallback(() => setSearchPanelOpen(prev => !prev), []);

    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

    return (
        <>
            <header className="left-0 right-0 top-0 pt-6 mb-4 header-spa bg-white fixed w-full z-50 border-b-gray-500 border-t-black shadow-md transition-all duration-300 flex items-center justify-between px-6 sm:px-6 lg:px-8">
                <div className="w-full mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                    </button>

                    {/* Logo / Brand */}
                    <Link to="/" className="font-bold text-xl text-primary-500 mr-4">
                        Secxion
                    </Link>

                    {/* Search Bar (Desktop) */}
                    <div className="hidden md:flex items-center rounded-md bg-gray-100 px-4 py-2 w-72 lg:w-80">
                        <FcSearch className="h-5 w-5 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search gift cards..."
                            className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Navigation Links (Desktop) */}
                    <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                        <Link to="/record" className="text-gray-600 hover:text-primary-500 transition duration-300">Trade status</Link>
                        <Link to="/mywallet" className="text-gray-600 hover:text-primary-500 transition duration-300">Wallet</Link>
                        <Link to="/datapad" className="text-gray-600 hover:text-primary-500 transition duration-300">DataPad</Link>
                        {user?.role === ROLE.ADMIN && (
                            <Link to="/admin-panel" className="text-gray-600 hover:text-primary-500 transition duration-300">Admin</Link>
                        )}
                    </nav>

                    {/* User Actions (Desktop) */}
                    <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
                        <Link to="/notifications" title="Notifications" aria-label="Notifications" className="relative">
                            <NotificationBadge />
                        </Link>
                        {user?._id && (
                                <button
                                    onClick={handleLogout}
                                    className="hidden md:flex items-center justify-center bg-transparent group"
                                    title="Logout"
                                    aria-label="Logout"
                                    disabled={loading}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="12" r="10" fill="#1E293B" />
                                        <path
                                            d="M8 12h8m-3-3l3 3-3 3"
                                            stroke="#F43F5E"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <circle cx="12" cy="12" r="2" fill="#FACC15" />
                                    </svg>
                                </button>
                            )}
                    </div>

                    {/* Mobile Search Button */}
                    <button
                        onClick={toggleSearchPanelOpen}
                        className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 ml-4"
                    >
                        <BiSearch className="h-6 w-6" />
                    </button>
                </div>
                {/* Mobile Search Panel */}
                <SearchPanelMobile open={searchPanelOpen} setOpen={setSearchPanelOpen} search={search} setSearch={setSearch} handleSearch={() => {
                    if (search.trim()) {
                        navigate(`/search?q=${encodeURIComponent(search)}`);
                        setSearchPanelOpen(false);
                    }
                }} />
                {/* Mobile Menu / SidePanel */}
                <SidePanel open={mobileMenuOpen} setOpen={setMobileMenuOpen} handleLogout={handleLogout} loading={loading} onCloseMenu={closeMobileMenu} />
            </header>
        </>
    );
};

export default Header;