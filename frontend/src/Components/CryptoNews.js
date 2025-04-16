import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NEWSDATA_API_KEY = "pub_79311d3920908e08068a1c62c654a7e4c4394";
const NEWSDATA_API_BASE_URL = "https://newsdata.io/api/1/latest?";

const CryptoNews = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            setError(null);
            try {
                const apiUrl = `https://newsdata.io/api/1/latest?apikey=pub_79311d3920908e08068a1c62c654a7e4c4394`;
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Failed to fetch latest crypto news: ${errorData?.message || response.status}`);
                }
                const data = await response.json();
                setNews(data.results || []);
            } catch (err) {
                console.error('Error fetching latest crypto news:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
        const intervalId = setInterval(fetchNews, 5 * 60 * 1000); // Every 5 minutes
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <p>Loading latest crypto news...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Latest Cryptocurrency News
            </h2>
            {news.length > 0 ? (
                news.map((article, index) => (
                    <div key={index} className="mb-4 p-4 rounded-md bg-gray-100 dark:bg-gray-700">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            <a href={article.link} target="_blank" rel="noopener noreferrer">
                                {article.title}
                            </a>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{article.description?.substring(0, 150)}...</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                            Source: {article.source_id}, Published: {new Date(article.pubDate).toLocaleTimeString()}
                        </p>
                    </div>
                ))
            ) : (
                <p>No latest crypto news available.</p>
            )}
        </motion.div>
    );
};

export default CryptoNews;