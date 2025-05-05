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
// ... [same imports as before, unchanged] ...

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
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
  
    const toggleMobileMenu = useCallback(() => setMobileMenuOpen((prev) => !prev), []);
    const toggleSearchPanelOpen = useCallback(() => setSearchPanelOpen((prev) => !prev), []);
    const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);
  
    return (
      <>
         <header className="header-spa left-0 right-0 top-0 pt-6 mb-4 inset-0 bg-black/70 backdrop-blur-sm fixed w-full z-50 border border-white/20 shadow-md transition-all duration-300 flex items-center justify-between px-6 sm:px-6 lg:px-8">
         <div className="w-full mx-auto flex items-center justify-between px-4 md:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMobileMenu}
                className="text-gray-300 hover:text-white md:hidden"
                aria-expanded={mobileMenuOpen}
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </button>
  
              <Link to="/" className="text-blue-500 text-lg font-semibold tracking-wide glow-blue">
                Secxion
              </Link>
            </div>
  
            <div className="hidden md:flex items-center bg-gray-100 border border-blue-400 rounded-md px-3 py-1 w-64 lg:w-72">
              <FcSearch className="text-gray-500 h-4 w-4 mr-2" />
              <input
                type="text"
                placeholder="Search gift cards..."
                className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
  
            <nav className="hidden md:flex items-center gap-3 text-sm font-medium">
              <Link
                to="/record"
                className="px-2 py-1 border border-cyan-500 text-cyan-300 hover:bg-cyan-800 hover:text-white rounded transition"
              >
                Trade Status
              </Link>
              <Link
                to="/mywallet"
                className="px-2 py-1 border border-pink-500 text-pink-300 hover:bg-pink-700 hover:text-white rounded transition"
              >
                Wallet
              </Link>
              <Link
                to="/datapad"
                className="px-2 py-1 border border-yellow-500 text-yellow-300 hover:bg-yellow-600 hover:text-black rounded transition"
              >
                DataPad
              </Link>
              {user?.role === ROLE.ADMIN && (
                <Link
                  to="/admin-panel"
                  className="px-2 py-1 border border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-white rounded transition"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/notifications"
                className="px-2 py-1 border border-emerald-500 text-emerald-300 hover:bg-emerald-700 hover:text-white rounded relative"
                title="Notifications"
              >
                <NotificationBadge />
              </Link>
              {user?._id && (
                <button
                  onClick={handleLogout}
                  disabled={loading}
                  className="px-2 py-1 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white rounded transition flex items-center"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                  Logout
                </button>
              )}
            </nav>
  
            <button
              onClick={toggleSearchPanelOpen}
              className="md:hidden text-gray-300 hover:text-white"
            >
              <BiSearch className="h-5 w-5" />
            </button>
          </div>
  
          <SearchPanelMobile
            open={searchPanelOpen}
            setOpen={setSearchPanelOpen}
            search={search}
            setSearch={setSearch}
            handleSearch={() => {
              if (search.trim()) {
                navigate(`/search?q=${encodeURIComponent(search)}`);
                setSearchPanelOpen(false);
              }
            }}
          />
  
          <SidePanel
            open={mobileMenuOpen}
            setOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
            loading={loading}
            onCloseMenu={closeMobileMenu}
          />
        </header>
      </>
    );
  };
  
  export default Header;
  
  