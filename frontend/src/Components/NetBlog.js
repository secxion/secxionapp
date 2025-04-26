import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { formatDistanceToNow } from 'date-fns';
import { FaCircle } from 'react-icons/fa';
import { motion } from "framer-motion";
import FullBlogDialog from './FullBlogDialog'; 

const blogCardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeInOut" },
};

const NetBlog = () => {
    const [blogs, setBlogs] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [errorBlogs, setErrorBlogs] = useState(null);
    const [communityFeedData, setCommunityFeedData] = useState(null);
    const [loadingFeed, setLoadingFeed] = useState(false);
    const [errorFeed, setErrorFeed] = useState(null);
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoadingBlogs(true);
            setErrorBlogs(null);
            try {
                const response = await fetch(SummaryApi.getBlogs.url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setBlogs(data);
            } catch (e) {
                setErrorBlogs(e.message);
            } finally {
                setLoadingBlogs(false);
            }
        };

        fetchBlogs();
    }, []);

    const fetchCommunityFeedData = async () => {
        setLoadingFeed(true);
        setErrorFeed(null);
        try {
            const response = await fetch(SummaryApi.getApprovedPosts.url, {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Failed to fetch community posts');
            }
            const data = await response.json();
            setCommunityFeedData(data.data);
        } catch (err) {
            setErrorFeed(err.message);
        } finally {
            setLoadingFeed(false);
        }
    };

    const handleCommunityFeedClick = () => {
        window.open('/community-feed', '_blank');
    };

    return (
        <div className="container mt-6">
            <div className="flex justify-end mb-4">
                <button
                    onMouseEnter={fetchCommunityFeedData}
                    onClick={handleCommunityFeedClick}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 shadow-sm transition-colors duration-300"
                >
                    <span className="hidden sm:inline">Community</span> Feed
                </button>
            </div>

            {loadingFeed && <p className="text-sm text-gray-500 mt-1"></p>}
            {errorFeed && <p className="text-sm text-red-500 mt-1">Error loading feed data.</p>}

            {loadingBlogs ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
                </div>
            ) : errorBlogs ? (
                <p className="text-red-500 text-center py-8">{errorBlogs}</p>
            ) : (
                blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map(blog => (
                            <motion.div
                                key={blog.id}
                                variants={blogCardVariants}
                                initial="initial"
                                animate="animate"
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-200 line-clamp-2">{blog.title}</h3>
                                        {blog.isActive && (
                                            <span className="inline-flex items-center text-green-500 text-sm">
                                                <FaCircle className="mr-1" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">{blog.content || 'No content available.'}</p>
                                    {blog.createdAt && (
                                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                                            Published {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setSelectedBlog(blog)} // Set the selected blog
                                        className="text-indigo-600 hover:underline text-xs mt-2"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">No blog posts available yet.</p>
                )
            )}

            {/* Full Blog Modal */}
            {selectedBlog && (
                <FullBlogDialog blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
            )}
        </div>
    );
};

export default NetBlog;
