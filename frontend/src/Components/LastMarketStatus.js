// LastMarketStatus.js
import React, { useEffect, useState, useContext } from 'react';
import SummaryApi from '../common'; // Assuming SummaryApi is correctly path'd
import UserContext from "../Context"; // Assuming your UserContext is named 'UserContext' and located here
import { CircleCheck, CircleX, Loader, Clock, Info, Image } from 'lucide-react'; // Added Info and Image icons
import currencyData from '../helpers/currencyData'; // Import the currencyData helper

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
                const response = await fetch(SummaryApi.lastUserMarketStatus.url, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    credentials: "include",
                });

                // Check for non-OK responses before parsing JSON
                if (!response.ok) {
                    const errorText = await response.text(); // Read as text to see HTML or other non-JSON
                    console.error("Non-OK response for last market status:", response.status, errorText);
                    setError(`Failed to fetch last market status: ${response.status} ${response.statusText}. Check server logs for details.`);
                    setLastMarket(null);
                    setLoading(false);
                    return;
                }

                const dataResponse = await response.json();

                if (dataResponse.success) {
                    setLastMarket(dataResponse.data);
                } else {
                    setError(dataResponse.message || "Failed to fetch last market status.");
                    setLastMarket(null);
                }
            } catch (err) {
                console.error("Error fetching last market status:", err);
                setError("An error occurred while fetching data. Please try again.");
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

    // Helper to format currency using currencyData
    const formatCurrency = (amount, currencyCode = '') => {
        if (typeof amount !== 'number') return 'N/A';

        const options = {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        };

        // Find the currency symbol from currencyData
        const currencyInfo = currencyData.find(c => c.value === currencyCode);
        const symbol = currencyInfo ? currencyInfo.symbol : currencyCode; // Fallback to code if symbol not found

        return `${symbol} ${amount.toLocaleString(undefined, options)}`;
    };

    if (loading) {
        return (
            <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48 my-8">
                <Loader className="w-8 h-8 animate-spin text-yellow-500" />
                <p className="ml-3 text-lg text-gray-700">Loading last market status...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white border-4 border-red-500 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48 my-8 text-red-600">
                <CircleX className="w-6 h-6 mr-2" />
                <p>{error}</p>
            </div>
        );
    }

    if (!lastMarket) {
        return (
            <div className="bg-white border-4 border-gray-300 rounded-xl p-6 shadow hover:shadow-lg flex items-center justify-center h-48 my-8 text-gray-500">
                <Clock className="w-6 h-6 mr-2" />
                <p>No recent market activities found.</p>
            </div>
        );
    }

    const statusDisplay = getStatusDisplay(lastMarket.status);
    const lastUpdateDate = new Date(lastMarket.timestamp).toLocaleString();

    return (
        <section className="bg-white max-w-7xl mx-auto my-8 p-4 rounded-xl shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 glossy-heading mb-6 border-b pb-3">Last Market Activity</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Card: Core Product Info & Status */}
                <div className="bg-white border-4 border-yellow-500 rounded-xl p-6 shadow-md hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{lastMarket.productName || 'N/A'}</h3>
                    
                    <div className="text-sm text-gray-600 space-y-2 mb-4">
                        {/* Check if category/description are truthy before displaying, otherwise they will be 'N/A' */}
                        <p><strong>Category:</strong> {lastMarket.category ? lastMarket.category : 'N/A'}</p>
                        <p><strong>Description:</strong> {lastMarket.description ? lastMarket.description : 'N/A'}</p>
                        {lastMarket.cardcode && <p><strong>Card Code:</strong> {lastMarket.cardcode}</p>}
                    </div>

                    <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-gray-700">Total Amount:</span>
                            <span className="font-bold text-green-700">
                                {formatCurrency(lastMarket.totalAmount)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-lg">
                            <span className="text-gray-700">Calculated Amount:</span>
                            <span className="font-bold text-blue-700">
                                {formatCurrency(lastMarket.calculatedTotalAmount)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t pt-4 mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 text-base">Status:</span>
                            <span className={`font-semibold text-lg flex items-center ${statusDisplay.color}`}>
                                {statusDisplay.icon}
                                <span className="ml-2">{statusDisplay.text}</span>
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Last Update:</span>
                            <span>{lastUpdateDate}</span>
                        </div>

                        {lastMarket.status === 'CANCEL' && lastMarket.cancelReason && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                                <p className="font-medium flex items-center"><Info className="w-4 h-4 mr-2" />Cancel Reason:</p>
                                <p className="ml-6">{lastMarket.cancelReason}</p>
                            </div>
                        )}
                        {lastMarket.status === 'CANCEL' && lastMarket.crImage && lastMarket.crImage.length > 0 && (
                            <div className="mt-4">
                                <p className="font-medium flex items-center text-gray-700"><Image className="w-4 h-4 mr-2" />Cancellation Images:</p>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {lastMarket.crImage.map((img, idx) => (
                                        <img key={idx} src={img} alt={`Cancellation Proof ${idx + 1}`} 
                                             className="w-full h-auto object-cover rounded-md shadow-sm border border-gray-200 max-h-32" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Card: Pricing Details */}
                <div className="bg-white border-4 border-blue-500 rounded-xl p-6 shadow-md hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing Details</h3>
                    {lastMarket.pricing && lastMarket.pricing.length > 0 ? (
                        lastMarket.pricing.map((priceBlock, pbIndex) => (
                            <div key={pbIndex} className="mb-4 pb-4 border-b last:border-b-0 last:pb-0">
                                <p className="font-bold text-gray-700 text-base mb-2">
                                    Trade Currency: {priceBlock.currency || 'N/A'}
                                </p>
                                {priceBlock.faceValues && priceBlock.faceValues.length > 0 ? (
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {priceBlock.faceValues.map((fv, fvIndex) => (
                                            <li key={fvIndex} className="mb-1">
                                                Face Value: <span className="font-medium">{fv.faceValue || 'N/A'}</span>, Selling Price: <span className="font-medium">{formatCurrency(fv.sellingPrice, priceBlock.currency)}</span>
                                                {fv.description && <span className="text-gray-500 italic ml-2">({fv.description})</span>}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No face values specified for this currency.</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-base">No pricing information available.</p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default LastMarketStatus;