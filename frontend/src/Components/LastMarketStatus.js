import React, { useEffect, useState, useContext } from 'react';
import SummaryApi from '../common'; // Assuming SummaryApi is correctly path'd
import UserContext from "../Context";
import { CircleCheck, CircleX, Loader, Clock } from 'lucide-react'; // Icons for status

// You'll need to define a new API endpoint in SummaryApi for this:
// Example in common/index.js (hypothetical):
// lastUserMarketStatus: { url: "/api/user/last-market-status", method: "GET" },
// This API should ideally return the *single latest* user product/market entry.

const LastMarketStatus = () => {
    const [lastMarket, setLastMarket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext); // Get user from context

    useEffect(() => {
        const fetchLastMarketStatus = async () => {
            if (!user?._id) {
                setError("User not logged in.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                // IMPORTANT: Replace SummaryApi.lastUserMarketStatus.url with your actual API endpoint
                // This endpoint should fetch the single latest user product/market entry for the logged-in user.
                // If you don't have such an API, you'd fetch all user products and sort/pick the latest here.
                const response = await fetch(SummaryApi.lastUserMarketStatus.url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include",
                });

                const dataResponse = await response.json();

                if (dataResponse.success) {
                    setLastMarket(dataResponse.data); // Assuming data.data holds the last product object
                } else {
                    setError(dataResponse.message || "Failed to fetch last market status.");
                    setLastMarket(null);
                }
            } catch (err) {
                console.error("Error fetching last market status:", err);
                setError("An error occurred while fetching data.");
                setLastMarket(null);
            } finally {
                setLoading(false);
            }
        };

        fetchLastMarketStatus();

        // Optional: Refresh status every X seconds (e.g., every 30 seconds)
        const interval = setInterval(fetchLastMarketStatus, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval); // Clean up on unmount
    }, [user]); // Rerun if user changes

    // Helper to get status icon and color
    const getStatusDisplay = (status) => {
        switch (status) {
            case 'DONE':
                return { icon: <CircleCheck className="w-5 h-5 text-green-600" />, text: 'Completed', color: 'text-green-600' };
            case 'PROCESSING':
                return { icon: <Loader className="w-5 h-5 text-blue-600 animate-spin" />, text: 'Processing', color: 'text-blue-600' };
            case 'CANCEL':
                return { icon: <CircleX className="w-5 h-5 text-red-600" />, text: 'Cancelled', color: 'text-red-600' };
            default:
                return { icon: <Clock className="w-5 h-5 text-gray-500" />, text: 'Unknown', color: 'text-gray-500' };
        }
    };

    if (loading) {
        return (
            <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48">
                <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                <p className="ml-3 text-lg text-gray-700">Loading last market status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border-4 border-red-500 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48 text-red-600">
                <CircleX className="w-6 h-6 mr-2" />
                <p>{error}</p>
            </div>
        );
    }

    if (!lastMarket) {
        return (
            <div className="bg-white border-4 border-gray-300 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48 text-gray-500">
                <Clock className="w-6 h-6 mr-2" />
                <p>No recent market activities found.</p>
            </div>
        );
    }

    const statusDisplay = getStatusDisplay(lastMarket.status);
    const lastTradeDate = new Date(lastMarket.timestamp).toLocaleString();

    return (
        <section className="bg-white max-w-7xl mx-auto mt-8"> {/* Added mt-8 for spacing */}
            <h2 className="text-2xl font-bold text-black glossy-heading mb-6">Last Market Status</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow hover:shadow-lg">
                    <p className="text-gray-600 text-sm glossy-text mb-2">Last Product/Trade</p>
                    <h3 className="text-xl font-semibold text-black mb-1">{lastMarket.productName}</h3>
                    <p className="text-sm text-gray-700 mb-4">{lastMarket.description}</p>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Status:</span>
                        <span className={`font-semibold text-lg flex items-center ${statusDisplay.color}`}>
                            {statusDisplay.icon}
                            <span className="ml-2">{statusDisplay.text}</span>
                        </span>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Amount:</span>
                        <span className="font-semibold text-lg text-black">
                            {lastMarket.totalAmount ? `${lastMarket.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Last Update:</span>
                        <span>{lastTradeDate}</span>
                    </div>

                    {lastMarket.status === 'CANCEL' && lastMarket.cancelReason && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                            <p className="font-medium">Cancel Reason:</p>
                            <p>{lastMarket.cancelReason}</p>
                        </div>
                    )}
                </div>

                {/* You can add another card here if you want to display something else,
                    or just remove the grid-cols-2 if only one card is needed. */}
                <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow hover:shadow-lg flex flex-col justify-center items-center">
                   <p className="text-gray-600 text-lg glossy-text text-center mb-4">
                       "Your most recent transaction's status at a glance."
                   </p>
                   <p className="text-gray-500 text-sm text-center">
                       This card provides a quick overview of your last market activity.
                   </p>
                </div>

            </div>
        </section>
    );
};

export default LastMarketStatus;