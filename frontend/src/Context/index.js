import { createContext, useState, useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";
import SummaryApi from "../common";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [walletBalance, setWalletBalance] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        setLoading(false);
    }, []);

    const getAuthHeaders = useCallback(() => {
        return {
            "Content-Type": "application/json",
        };
       
    }, []);

    const fetchUserDetails = useCallback(async () => {
        try {
            const response = await fetch(SummaryApi.current_user.url, {
                method: SummaryApi.current_user.method,
                headers: getAuthHeaders(),
                credentials: "include",
            });

            if (!response.ok) {
                console.error("Failed to fetch user details:", response.status);
                dispatch(setUserDetails(null));
                return;
            }

            const data = await response.json();
            dispatch(setUserDetails(data));

        } catch (error) {
            console.error("Error fetching user details:", error);
            dispatch(setUserDetails(null));
        }
    }, [getAuthHeaders, dispatch]);

    const fetchWalletBalance = useCallback(async () => {
        try {
            const response = await fetch(SummaryApi.walletBalance.url, {
                method: SummaryApi.walletBalance.method,
                headers: getAuthHeaders(),
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