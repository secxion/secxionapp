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
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
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
            const response = await fetch(SummaryApi.getApprovedPosts.url, { credentials: "include" });
            if (!response.ok) throw new Error('Failed to fetch community posts');
            const data = await response.json();
            setCommunityFeedData(data.data);
        } catch (err) {
            setErrorFeed(err.message);
        } finally {
            setLoadingFeed(false);
        }
    };

    const handleCommunityFeedClick = () => {
        window.open('/community-feed');
    };

    return (
        <div className="container mt-4 px-4">
            <div className="flex justify-end mb-6">
                <button
                    onMouseEnter={fetchCommunityFeedData}
                    onClick={handleCommunityFeedClick}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 neon-glow"
                >
                    <span className="hidden sm:inline">Community</span> Feed
                </button>
            </div>

            {loadingFeed && <p className="text-sm text-gray-500 mt-1">Fetching community...</p>}
            {errorFeed && <p className="text-sm text-red-500 mt-1">Error loading feed data.</p>}

            {loadingBlogs ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
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
                                className="backdrop-blur-xl bg-white/10 dark:bg-gray-800/30 border border-white/20 shadow-lg rounded-2xl overflow-hidden transition-all hover:scale-[1.01] hover:shadow-xl"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white neon-text line-clamp-2">{blog.title}</h3>
                                        {blog.isActive && (
                                            <span className="inline-flex items-center text-green-400 text-sm">
                                                <FaCircle className="mr-1 animate-pulse" /> Active
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-300 text-sm line-clamp-3">{blog.content || 'No content available.'}</p>
                                    {blog.createdAt && (
                                        <p className="text-gray-400 text-xs mt-2">
                                            Published {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setSelectedBlog(blog)}
                                        className="text-pink-400 hover:underline text-xs mt-2 font-semibold"
                                    >
                                        Read More
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400 text-center py-8">No blog posts available yet.</p>
                )
            )}

            {selectedBlog && (
                <FullBlogDialog blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
            )}
        </div>
    );
};

export default NetBlog;
