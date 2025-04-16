import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const COINGECKO_API_KEY = "CG-iSMa1XGbtJKXzHSY5hxf71fd";
const COINGECKO_API_BASE_URL = "https://pro-api.coingecko.com/api/v3/global";

const CryptoGlobalMarketData = () => {
    const [globalData, setGlobalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGlobalData = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `https://api.coingecko.com/api/v3/simple/supported_vs_currencies`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch global crypto data: ${errorData?.message || response.status}`);
                }
                const data = await response.json();
                setGlobalData(data.data);
            } catch (err) {
                console.error('Error fetching global crypto data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGlobalData();
        const intervalId = setInterval(fetchGlobalData, 10 * 60 * 1000); // Every 10 minutes
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <p>Loading global crypto market data...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!globalData) return <p>No global crypto market data available.</p>;

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Global Cryptocurrency Market Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Cryptocurrencies</p>
                    <p className="text-lg font-semibold text-blue-500">{globalData.active_cryptocurrencies}</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Markets</p>
                    <p className="text-lg font-semibold text-green-500">{globalData.markets}</p>
                </div>
                {globalData.total_market_cap && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Market Cap (USD)</p>
                        <p className="text-lg font-semibold text-indigo-500">${globalData.total_market_cap.usd?.toLocaleString()}</p>
                    </div>
                )}
                {globalData.total_volume && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Volume (USD)</p>
                        <p className="text-lg font-semibold text-purple-500">${globalData.total_volume.usd?.toLocaleString()}</p>
                    </div>
                )}
                {globalData.market_cap_change_percentage_24h_usd !== undefined && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Market Cap Change (24h USD)</p>
                        <p className={`text-lg font-semibold ${globalData.market_cap_change_percentage_24h_usd >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {globalData.market_cap_change_percentage_24h_usd?.toFixed(2)}%
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CryptoGlobalMarketData;