import React from 'react';
import { MdClose } from 'react-icons/md';
import { motion } from 'framer-motion';

const FullBlogDialog = ({ blog, onClose }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full p-6 relative shadow-lg overflow-y-auto max-h-[90vh]"
                onClick={e => e.stopPropagation()}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
                >
                    <MdClose size={24} />
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{blog.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{blog.content || 'No content available.'}</p>
            </motion.div>
        </motion.div>
    );
};

export default FullBlogDialog;
