import React, { useContext, useState, useMemo, useCallback, useEffect } from "react";
import { FcSearch } from "react-icons/fc";
import { PiUserSquare, PiBell } from "react-icons/pi"; // Import the notification bell icon
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import { setUserDetails } from "../store/userSlice";
import Context from "../Context";
import ROLE from "../common/role";

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Header = () => {
  const dispatch = useDispatch();
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const toggleMenuDisplay = useCallback(() => setMenuDisplay(prev => !prev), []);
  const toggleSidebarOpen = useCallback(() => setSidebarOpen(prev => !prev), []);
  const toggleSearchPanelOpen = useCallback(() => setSearchPanelOpen(prev => !prev), []);

  return (
    <nav className="h-16 bg-white shadow-lg fixed w-full z-50 border-b-2 border-gray-400 transition-all duration-300">
      <div className="h-full w-full container mx-auto flex items-center justify-between px-4">
        {user?._id && (
          <div className="flex items-center flex-shrink-0">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 md:h-12 md:w-12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 3l9 6.5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11z" fill="#4F46E5" />
                <rect x="10" y="14" width="4" height="6" fill="#FBBF24" />
                <path d="M3 9.5L12 3l9 6.5" stroke="#4F46E5" strokeWidth="2" />
              </svg>
            </Link>
          </div>
        )}
        {user?._id && (
          <div className="hidden md:flex items-center w-full max-w-sm relative">
            <input
              type="text"
              placeholder="Search Trade..."
              className="w-full px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-700 bg-gray-100 border border-gray-300 shadow-md transition duration-300"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <FcSearch size={22} />
            </div>
          </div>
        )}

        <div className="flex items-center gap-6">
          {user?._id && (
            <Link to="/notifications" className="relative cursor-pointer" title="Notifications" aria-label="Notifications">
              <PiBell size={28} className="text-gray-700 hover:text-blue-700 transition duration-200" />
              {/* You can add a notification badge here if you have unread notifications */}
              <span className="absolute -top-3 right-4 inline-flex items-center justify-center px-2 py-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                9+
              </span>
            </Link>
          )}

          {user?._id && (
            <div className="relative">
              <div className="cursor-pointer" onClick={toggleMenuDisplay} aria-expanded={menuDisplay}>
                {user?.profilePic ? (
                  <img
                    src={user?.profilePic}
                    className="w-10 h-10 object-cover rounded-lg border-2 border-gray-300 shadow-sm"
                    alt="Profile"
                  />
                ) : (
                  <PiUserSquare size={32} className="text-blue-700" />
                )}
              </div>

              {menuDisplay && (
                <div className="absolute top-12 right-0 w-48 bg-white shadow-md rounded-md overflow-hidden z-50 border border-gray-300">
                  {user?.role === ROLE.ADMIN && (
                    <Link
                      to="/admin-panel/all-products"
                      className="block px-4 py-2 hover:bg-gray-100"
                      onClick={toggleMenuDisplay}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={toggleMenuDisplay}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      toggleMenuDisplay();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    disabled={loading}
                  >
                    {loading ? "Logging out..." : "Logout"}
                  </button>
                </div>
              )}
            </div>
          )}

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

        {user?._id && (
          <button
            className="lg:hidden text-gray-700 text-2xl"
            onClick={toggleSidebarOpen}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
      </div>

      {user?._id && (
        <button
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-4 rounded-full shadow-lg md:hidden border border-gray-300"
          onClick={toggleSearchPanelOpen}
          aria-label="Toggle search panel"
        >
          <FcSearch size={28} />
        </button>
      )}

      {searchPanelOpen && (
        <div
          className="fixed bottom-0 left-0 w-full bg-white shadow-lg p-4 z-50 md:hidden transition-transform transform translate-y-0 border-t border-gray-300"
        >
          <button
            className="absolute top-4 right-6 z-50 text-gray-700 text-2xl bg-white rounded-full p-6 shadow-md"
            onClick={toggleSearchPanelOpen}
            aria-label="Close search panel"
          >
            ✕
          </button>
          <div className="flex items-center w-full relative mt-6">
            <input
              type="text"
              placeholder="Search Trade..."
              className="w-full px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-blue-700 bg-gray-100 border border-gray-300 shadow-md transition duration-300"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer">
              <FcSearch size={22} />
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && user?._id && (
        <div className="fixed top-0 left-0 w-3/4 h-full bg-white z-50 border-r border-gray-400 transition-transform transform translate-x-0 shadow-lg">
          <div className="p-6">
            <button
              onClick={toggleSidebarOpen}
              className="text-gray-700 text-2xl mb-4"
              aria-label="Close menu"
            >
              ✕
            </button>
            <nav className="mt-4">
              <Link
                to="/home"
                className="block text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={toggleSidebarOpen}
              >
                Home
              </Link>
              <Link
                to="/notifications"
                className="block text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
                onClick={toggleSidebarOpen}
              >
                Notifications
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebarOpen();
                }}
                className="block text-gray-700 py-3 px-4 rounded-lg text-left w-full hover:bg-gray-200 transition duration-200"
                disabled={loading}
              >
                {loading ? "Logging out..." : "Logout"}
              </button>
            </nav>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;