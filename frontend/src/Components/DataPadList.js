import React from "react";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { motion } from "framer-motion"; 

const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const DataPadList = ({ onOpen, dataPads, setDataPads }) => {
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this data?")) return;

        try {
            const response = await fetch(`${SummaryApi.deleteData.url}/${id}`, {
                method: SummaryApi.deleteData.method,
                credentials: "include",
            });

            const responseData = await response.json();
            if (responseData.success) {
                toast.success("Data deleted successfully! 🗑️");
                setDataPads((prev) => prev.filter((item) => item._id !== id));
            } else {
                toast.error(responseData.message || "Failed to delete data.");
            }
        } catch (error) {
            console.error("Error deleting data:", error);
            toast.error("Error deleting data.");
        }
    };

    return (
      <div className="container overflow-x-hidden space-y-4 overflow-y-auto max-h-[calc(100vh-160px)] p-2">
            {dataPads.map((dataPad) => (
                <motion.div
                    key={dataPad._id}
                    className="bg-white dark:bg-gray-700 rounded-lg shadow-md cursor-pointer transition-shadow duration-200 hover:shadow-lg"
                    onClick={() => onOpen(dataPad)} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="p-4">
                        {/* Title */}
                        <h4 className="font-semibold text-lg truncate text-gray-800 dark:text-gray-100">{dataPad.title}</h4>

                        {/* Created Date */}
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            Created on: {formatDate(dataPad.createdAt)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-end mt-3">
                            <motion.button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click when deleting
                                    handleDelete(dataPad._id);
                                }}
                                className="text-red-500 hover:text-red-600 focus:outline-none transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <MdDelete className="mr-1" /> Delete
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default DataPadList;