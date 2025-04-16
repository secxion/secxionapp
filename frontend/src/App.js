import { lazy, Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";
import Context from "./Context";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetailsAPI, fetchMarketDataAPI, fetchBlogsAPI, fetchWalletBalanceAPI } from "./services/apiService";
import "./styles/Loader.css";

function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

const Header = lazy(() => import("./Components/Header"));
const Net = lazy(() => import("./Components/Net"));

function Loader() {
    return (
        <div className="loader-container">
            <div className="loader"></div>
            <p className="loading-text">Loading, please wait...</p>
        </div>
    );
}

function App() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        setViewportHeight(); 
        window.addEventListener('resize', setViewportHeight); 

        return () => {
            window.removeEventListener('resize', setViewportHeight);
        };
    }, []);

    const { refetch: fetchUserDetails, isLoading: isUserLoading } = useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            dispatch(setLoading(true));
            const res = await fetchUserDetailsAPI();
            dispatch(setLoading(false));

            if (res.success) {
                dispatch(setUserDetails(res.data));
                return res.data;
            } else {
                dispatch(setUserDetails(null));
                return null;
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: marketData, refetch: fetchMarketData, isLoading: isMarketLoading } = useQuery({
        queryKey: ["marketData"],
        queryFn: fetchMarketDataAPI,
        staleTime: 5 * 60 * 1000,
    });

    const { data: walletBalance, refetch: fetchWalletBalance, isLoading: isWalletLoading } = useQuery({
        queryKey: ["walletBalance"],
        queryFn: fetchWalletBalanceAPI,
        staleTime: 5 * 60 * 1000,
    });

    const { data: blogs, refetch: fetchBlogs, isLoading: isBlogsLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: fetchBlogsAPI,
        staleTime: 5 * 60 * 1000,
    });

    if (isUserLoading || isMarketLoading || isBlogsLoading || isWalletLoading) {
        return <Loader />;
    }

    return (
        <Context.Provider value={{ fetchUserDetails, fetchMarketData, marketData, user, fetchBlogs, blogs, walletBalance, fetchWalletBalance }}>
            <div className="fixed top-0 left-0 w-full h-full bg-white overflow-y-auto">
                <Suspense fallback={<Loader />}>
                    {user && <Net blogs={blogs} fetchBlogs={fetchBlogs} />}
                    <main className="h-full w-full pt-1 mt-6">
                        {user && <Header />}
                        <div className="h-full w-full">
                            <Outlet />
                        </div>
                    </main>
                </Suspense>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </Context.Provider>
    );
}

export default App;
