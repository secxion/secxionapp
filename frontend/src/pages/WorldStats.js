import React from 'react';
import { motion } from 'framer-motion';
import CryptoGlobalMarketData from '../Components/CryptoGlobalMarketData';
import CryptoNews from '../Components/CryptoNews';

const containerVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { delay: 0.2, duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
};

const WorldStats = () => {
    return (
        <motion.div
            className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
        >
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
                    Global Financial Statistics
                </h1>


                <CryptoGlobalMarketData />

                <CryptoNews />

            </div>
        </motion.div>
    );
};

export default WorldStats;