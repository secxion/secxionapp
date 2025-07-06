import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { useDispatch } from "react-redux";
import { clearState, setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(null);
    const dispatch = useDispatch();

   useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
        try {
            const parsedUser = JSON.parse(storedUser);

            // Check token validity before restoring state
            if (!isTokenExpired(storedToken)) {
                setUser(parsedUser);
                setToken(storedToken);
            } else {
                // Clear expired/invalid session
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Error parsing user/token:", error);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }

    setLoading(false);
}, [isTokenExpired]);


    const getAuthHeaders = useCallback(() => {
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    }, [token]);

   const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setWalletBalance(null);
    dispatch(clearState()); // better than setUserDetails(null)

    // Force redirect
    window.location.href = '/login';
}, [dispatch]);


    // Check if token is expired
    const isTokenExpired = useCallback((token) => {
        if (!token) return true;
        
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            return payload.exp < currentTime;
        } catch (error) {
            console.error("Error checking token expiry:", error);
            return true;
        }
    }, []);

    // Enhanced API call wrapper with auto-logout on token expiry
    const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
        if (!token || isTokenExpired(token)) {
            console.warn("Token expired or missing, logging out...");
            logout();
            return null;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...getAuthHeaders(),
                    ...options.headers,
                },
                credentials: "include",
            });

            // Check for 401 Unauthorized or 403 Forbidden (token expired/invalid)
            if (response.status === 401 || response.status === 403) {
                console.warn("Authentication failed, logging out...");
                logout();
                return null;
            }

            return response;
        } catch (error) {
            console.error("Request failed:", error);
            throw error;
        }
    }, [token, isTokenExpired, logout, getAuthHeaders]);

    const fetchUserDetails = useCallback(async () => {
        if (!token) return;
        
        try {
            const response = await makeAuthenticatedRequest(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
            });

            if (!response) return; // Already handled logout in makeAuthenticatedRequest

            const data = await response.json();
            if (response.ok && data && data._id) {
                setUser(data);
                dispatch(setUserDetails(data));
            } else {
                console.warn("Failed to fetch user details");
                logout();
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
            logout();
        }
    }, [makeAuthenticatedRequest, dispatch, token, logout]);

    const fetchWalletBalance = useCallback(async () => {
        if (!token && !user?._id) return;
        
        try {
            let url = SummaryApi.walletBalance.url;
            let requestOptions = {
                method: SummaryApi.walletBalance.method,
            };

            if (!token) {
                url = `${url}?userId=${user._id}`;
                requestOptions.headers = { "Content-Type": "application/json" };
            }

            const response = token 
                ? await makeAuthenticatedRequest(url, requestOptions)
                : await fetch(url, { ...requestOptions, credentials: "include" });

            if (!response) return; // Already handled logout in makeAuthenticatedRequest

            const data = await response.json();
            if (response.ok && data.success) {
                setWalletBalance(data.balance);
            } else {
                setWalletBalance(null);
                console.warn("Wallet fetch failed:", data.message);
                
                // If it's an auth error, logout
                if (response.status === 401 || response.status === 403) {
                    logout();
                }
            }
        } catch (error) {
            console.error("Error fetching wallet:", error);
            setWalletBalance(null);
        }
    }, [token, user, makeAuthenticatedRequest, logout]);

    // Periodic token validation
    useEffect(() => {
        if (!token) return;

        const validateToken = () => {
            if (isTokenExpired(token)) {
                console.warn("Token expired during session, logging out...");
                logout();
            }
        };

        // Check token every 5 minutes
        const interval = setInterval(validateToken, 5 * 60 * 1000);
        
        // Also check on window focus (when user returns to tab)
        const handleFocus = () => {
            validateToken();
        };
        
        window.addEventListener('focus', handleFocus);
        
        return () => {
            clearInterval(interval);
            window.removeEventListener('focus', handleFocus);
        };
    }, [token, isTokenExpired, logout]);

    useEffect(() => {
        if (token || user) {
            fetchWalletBalance();
        }
        setLoading(false);
    }, [token, user, fetchWalletBalance]);

    const login = async (userData, userToken) => {
        if (!userData || !userToken) {
            console.error("Missing user or token in login()");
            return;
        }

        // Validate token before storing
        if (isTokenExpired(userToken)) {
            console.error("Cannot login with expired token");
            return;
        }

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);
        setUser(userData);
        setToken(userToken);
        dispatch(setUserDetails(userData));
        fetchWalletBalance();
    };

    const isLoggedIn = !!user && !!token && !isTokenExpired(token);

    return (
        <Context.Provider value={{
            user,
            token,
            login,
            logout,
            getAuthHeaders,
            fetchUserDetails,
            isLoggedIn,
            loading,
            walletBalance,
            fetchWalletBalance,
            makeAuthenticatedRequest, // Expose this for other components to use
        }}>
            {children}
        </Context.Provider>
    );
};

export const useAuth = () => useContext(Context);

export default Context;