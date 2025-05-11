import { createContext, useState, useEffect, useCallback, useContext } from "react";
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
                }
            } catch (error) {
                console.error("Error parsing user/token:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
            }
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

            const data = await response.json();

            if (response.ok && data && data._id) {
                setUser(data);
                dispatch(setUserDetails(data));
            } else {
                console.warn("Failed to fetch user details");
                setUser(null);
                dispatch(setUserDetails(null));
            }

        } catch (error) {
            console.error("Error fetching user details:", error);
            setUser(null);
            dispatch(setUserDetails(null));
        }
    }, [getAuthHeaders, dispatch, token]);

    const fetchWalletBalance = useCallback(async () => {
        if (!token && !user?._id) return;

        try {
            let url = SummaryApi.walletBalance.url;
            let headers = { "Content-Type": "application/json" };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } else {
                url = `${url}?userId=${user._id}`;
            }

            const response = await fetch(url, {
                method: SummaryApi.walletBalance.method,
                headers,
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setWalletBalance(data.balance);
            } else {
                setWalletBalance(null);
                console.warn("Wallet fetch failed:", data.message);
            }

        } catch (error) {
            console.error("Error fetching wallet:", error);
            setWalletBalance(null);
        }
    }, [token, user]);

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

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userToken);

        setUser(userData);
        setToken(userToken);

        dispatch(setUserDetails(userData));
        fetchWalletBalance();
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
        setWalletBalance(null);
        dispatch(setUserDetails(null));
    };

    const isLoggedIn = !!user && !!token;

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
            fetchWalletBalance
        }}>
            {children}
        </Context.Provider>
    );
};

export const useAuth = () => useContext(Context);

export default Context;
