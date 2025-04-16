import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BiBitcoin } from 'react-icons/bi';
import { FaChartBar } from 'react-icons/fa';

const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.2, duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

const buttonVariants = {
    hover: { scale: 1.05, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" },
    tap: { scale: 0.95 },
};

const Statistics = () => {
    return (
        <motion.div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 flex flex-col items-center justify-center"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="container mx-auto text-center">
                <motion.h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    Explore Financial Insights
                </motion.h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-lg mx-auto">
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <div className="p-4 rounded-full bg-yellow-500 text-white mb-4">
                            <BiBitcoin className="text-4xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Buy & Sell Crypto
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Dive into the world of cryptocurrencies. Trade seamlessly and securely.
                        </p>
                        <Link
                            to="/crypto"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
                        >
                            Go to Crypto Trading
                        </Link>
                    </motion.div>

                    {/* Statistics Section */}
                    <motion.div
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <div className="p-4 rounded-full bg-blue-500 text-white mb-4">
                            <FaChartBar className="text-4xl" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Detailed Statistics
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Analyze market trends, view your portfolio performance, and gain insights.
                        </p>
                        <Link
                            to="/stats"
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-md transition-colors duration-300"
                        >
                            View Statistics
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Statistics;