import { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
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


        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);

                setUser(parsedUser);
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.warn("⚠️ No token found, but user exists.");
                }
            } catch (error) {
                console.error("Error parsing stored user data:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
        } else {
            console.warn("No user found in local storage.");
        }

        setLoading(false);
    }, []);

    const getAuthHeaders = useCallback(() => {
        const headers = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        return headers;
    }, [token]);

    const fetchUserDetails = useCallback(async () => {
        if (!token) return;

        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Failed to fetch user details:", response.status);
                setUser(null);
                dispatch(setUserDetails(null));
                return;
            }

            const data = await response.json();
            setUser(data);
            dispatch(setUserDetails(data));

        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
            dispatch(setUserDetails(null));
        }
    }, [getAuthHeaders, dispatch, token]);

    const fetchWalletBalance = useCallback(async () => {
        if (!token && !user) {
            console.warn("⚠️ No token or user available. Cannot fetch wallet balance.");
            return;
        }
            try {
            let url = SummaryApi.walletBalance.url;
            let headers = { "Content-Type": "application/json" };
    
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } else if (user?._id) {
                url = `${SummaryApi.walletBalance.url}?userId=${user._id}`;
            }
    
            const response = await fetch(url, {
                method: SummaryApi.walletBalance.method,
                headers,
                credentials: "include",
            });
    
            if (!response.ok) {
                console.error("Failed to fetch wallet balance:", response.status);
                setWalletBalance(null);
                return;
            }
    
            const data = await response.json();
            if (data.success) {
                setWalletBalance(data.balance);
            } else {
                console.error("Failed to fetch wallet balance:", data.message);
                setWalletBalance(null);
            }
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
            setWalletBalance(null);
        }
    }, [token, user, setWalletBalance]);
    ;

    useEffect(() => {
        if (token || user) {
            fetchWalletBalance();
        }
        setLoading(false);
    }, [token, user, fetchWalletBalance]);

    const login = async (userData, userToken) => {
        if (!userData) {
            console.error("⚠️ Cannot log in without user!");
            return;
        }

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);
        setUser(userData);
        setToken(userToken);

        fetchWalletBalance();
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        dispatch(setUserDetails(null));
    };

    const isLoggedIn = !!user && !!token;

    return (
        <Context.Provider value={{
            user, token, login, logout, getAuthHeaders, 
            fetchUserDetails, isLoggedIn, loading, 
            walletBalance, fetchWalletBalance
        }}>
            {children}
        </Context.Provider>
    );
};

export default Context;
