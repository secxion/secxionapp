import React, { useState, useEffect } from "react";
import UploadData from "../Components/UploadData";
import DataPadList from "../Components/DataPadList";
import { useSelector } from "react-redux";
import SummaryApi from "../common";
import { motion, AnimatePresence } from "framer-motion";

const DataPad = () => {
    const { user } = useSelector((state) => state.user);
    const [editingDataPad, setEditingDataPad] = useState(null);
    const [dataPads, setDataPads] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) fetchDataPads();
    }, [user]);

    const fetchDataPads = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(SummaryApi.allData.url, {
                method: SummaryApi.allData.method,
                credentials: "include",
            });
            const data = await response.json();
            if (data.success) {
                setDataPads(data.data.filter((item) => item.userId === user?.id || item.userId === user?._id));
            }
        } catch (error) {
            console.error("Error fetching Data:", error);
        }
        setIsLoading(false);
    };

    const onOpen = (dataPad) => {
        setEditingDataPad(dataPad);
        setIsUploadOpen(true);
    };

    const closeUpload = () => {
        setIsUploadOpen(false);
        setEditingDataPad(null);
        fetchDataPads();
    };

    return (
        <motion.div
            className="fixed inset-0 bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="overflow-x-hidden min-h-screen w-screen mt-16 flex flex-col md:flex-row p-4 md:p-6">
                {/* Upload Form */}
                <AnimatePresence>
                    {isUploadOpen && (
                        <motion.div
                            key="uploadModal"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center"
                            onClick={(e) => { if (e.target === e.currentTarget) closeUpload(); }} // Close on backdrop click
                        >
                            <UploadData
                                editingDataPad={editingDataPad}
                                setEditingDataPad={setEditingDataPad}
                                closeUpload={closeUpload}
                                refreshData={fetchDataPads}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Notes List */}
                <main className="w-full flex-1">
                    
                    <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                        <div className="p-4">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                                    <p className="mt-3 text-gray-600 dark:text-gray-400">Fetching your data...</p>
                                </div>
                            ) : dataPads.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10">
                                    <span role="img" aria-label="empty" className="text-4xl mb-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-500 dark:text-gray-400">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.932 3.374h14.74c1.716 0 2.802-1.874 1.932-3.374M12 9.75a3 3 0 00-3 3 3 0 003 3 3 0 003-3 3 0 00-3-3z" />
                                        </svg>
                                    </span>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">No data available yet.</p>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsUploadOpen(true)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                    >
                                        <span role="img" aria-label="plus">➕</span> Add New Data
                                    </motion.button>
                                </div>
                            ) : (
                                <DataPadList onOpen={onOpen} dataPads={dataPads} setDataPads={setDataPads} />
                            )}
                        </div>
                    </div>
                </main>

                {/* Floating Create Button */}
                {dataPads.length > 0 && !isLoading && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsUploadOpen(true)}
                        className="fixed bottom-5 bg-blue-500 text-white px-5 py-3 rounded-full shadow-lg left-1/2 -translate-x-1/2 p-2 rounded-full hover:bg-blue-600 font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                        <span role="img" aria-label="plus">➕</span> New Data
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};

export default DataPad;