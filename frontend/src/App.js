import { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
// import "react-toastify/dist/ReactToastify.css";
// import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserDetails, setLoading } from "./store/userSlice";
import Context from "./Context";
import { useQuery } from "@tanstack/react-query";
import { fetchUserDetailsAPI, fetchMarketDataAPI, fetchBlogsAPI, fetchWalletBalanceAPI } from "./services/apiService";
import "./styles/Loader.css";

const Header = lazy(() => import("./Components/Header"));
const Footer = lazy(() => import("./Components/Footer"));
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
    const location = useLocation();

    const hiddenFooterRoutes = ["/report", "/notifications", "/mywallet", "/contact-us", "/admin-panel/anonymous-report", "/admin-panel/users-datapad", "/admin-panel/users-market", "/product-category", "/datapad", "/login", "/sign-up", "/admin-panel/all-products", "/admin-panel/all-users", "/admin-panel/users-market", "/admin-panel/users-wallet", "/admin-panel/system-blog", "/admin-panel/admin-report", "/admin-panel/analytics", "/admin-panel/settings"];

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

    const shouldHideFooter = hiddenFooterRoutes.includes(location.pathname) || location.pathname.startsWith("/chat/");

    return (
        <Context.Provider value={{ fetchUserDetails, fetchMarketData, marketData, user, fetchBlogs, blogs, walletBalance, fetchWalletBalance }}>
            <Suspense fallback={<Loader />}>
                {user && <Net blogs={blogs} fetchBlogs={fetchBlogs} />}
                <main className="min-h-[calc(100vh-120px)] pt-1 mt-6">
                    {user && <Header />}
                    <Outlet />
                </main>
                {!shouldHideFooter && <Footer />}
            </Suspense>
            {/* <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            /> */}
        </Context.Provider>
    );
}

export default App;