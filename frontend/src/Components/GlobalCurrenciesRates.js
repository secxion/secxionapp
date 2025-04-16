import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CURRENCY_API_KEY = "yaQ4dGsiNpDbxalqplxeXZZIG7X7g3tchrrJ";
const CURRENCY_API_BASE_URL = "https://currencyapi.net/api/v1/rates?";

const GlobalCurrenciesRates = () => {
    const [rates, setRates] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const baseCurrency = 'USD';
    const targetCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

    useEffect(() => {
        const fetchRates = async () => {
            setLoading(true);
            setError(null);
            try {
                const symbols = targetCurrencies.join(',');
                const apiUrl = `${CURRENCY_API_BASE_URL}key=${CURRENCY_API_KEY}&output=JSON&base=${baseCurrency}&symbols=${symbols}`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch currency rates: ${errorData?.message || response.status}`);
                }
                const data = await response.json();
                setRates(data.rates || {});
            } catch (err) {
                console.error('Error fetching currency rates:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRates();
        const intervalId = setInterval(fetchRates, 60 * 60 * 1000); // Hourly
        return () => clearInterval(intervalId);
    }, [baseCurrency, targetCurrencies]);

    if (loading) return <p>Loading currency rates...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <span className="mr-2">Global Currency Rates</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">(Updated Hourly)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(rates).map(([currency, rate]) => (
                    <div key={currency} className="bg-gray-100 dark:bg-gray-700 rounded-md p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">{baseCurrency} to {currency}</p>
                        <p className="text-lg font-semibold text-blue-500">{rate}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default GlobalCurrenciesRates;