import { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(null);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user); // Get user from Redux
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn); // Get isLoggedIn from Redux

    useEffect(() => {
        console.log("Context: isLoggedIn state on mount:", isLoggedIn);
        setLoading(false);
    }, [isLoggedIn]);

    const getAuthHeaders = useCallback(() => {
        return {
            "Content-Type": "application/json",
        };
    }, []);

    const fetchUserDetails = useCallback(async () => {
        try {
            console.log("Context: Fetching user details...");
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                headers: getAuthHeaders(),
                credentials: "include",
            });

            console.log("Context: fetchUserDetails response status:", response.status);

            if (!response.ok) {
                console.error("Context: Failed to fetch user details:", response.status);
                dispatch(setUserDetails(null));
                return;
            }

            const data = await response.json();
            console.log("Context: User details fetched successfully:", data);
            dispatch(setUserDetails(data));

        } catch (error) {
            console.error("Context: Error fetching user details:", error);
            dispatch(setUserDetails(null));
        }
    }, [getAuthHeaders, dispatch]);

    const fetchWalletBalance = useCallback(async () => {
        try {
            console.log("Context: Fetching wallet balance...");
            const response = await fetch(SummaryApi.walletBalance.url, {
                method: SummaryApi.walletBalance.method,
                headers: getAuthHeaders(),
                credentials: "include",
            });

            console.log("Context: fetchWalletBalance response status:", response.status);

            if (!response.ok) {
                console.error("Context: Failed to fetch wallet balance:", response.status);
                setWalletBalance(null);
                return;
            }

            const data = await response.json();
            console.log("Context: Wallet balance fetched:", data);
            if (data.success) {
                setWalletBalance(data.balance);
            } else {
                console.error("Context: Failed to fetch wallet balance:", data.message);
                setWalletBalance(null);
            }
        } catch (error) {
            console.error("Context: Error fetching wallet balance:", error);
            setWalletBalance(null);
        }
    }, [getAuthHeaders, setWalletBalance]);

    useEffect(() => {
        fetchWalletBalance();
    }, [fetchWalletBalance]);

    return (
        <Context.Provider value={{
            getAuthHeaders,
            fetchUserDetails,
            loading,
            walletBalance,
            fetchWalletBalance
        }}>
            {children}
        </Context.Provider>
    );
};

export default Context;