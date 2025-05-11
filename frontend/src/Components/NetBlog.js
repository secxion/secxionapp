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
        <div className="container mx-auto mt-10 px-4 max-w-7xl">
            <div className="flex justify-end mb-8">
                <button
                    onMouseEnter={fetchCommunityFeedData}
                    onClick={handleCommunityFeedClick}
                    className="px-5 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    <span className="hidden sm:inline">Community</span> Feed
                </button>
            </div>

            {loadingFeed && <p className="text-sm text-gray-400 mt-1">Fetching community...</p>}
            {errorFeed && <p className="text-sm text-red-400 mt-1">Error loading feed data.</p>}

            {loadingBlogs ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                </div>
            ) : errorBlogs ? (
                <p className="text-red-400 text-center py-8">{errorBlogs}</p>
            ) : blogs.length > 0 ? (
                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map(blog => (
                        <motion.div
                            key={blog.id}
                            variants={blogCardVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-white/10 via-gray-800/20 to-gray-900/30 backdrop-blur-md border border-white/20 text-white hover:scale-[1.015] transition-all duration-300"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold line-clamp-2 neon-text">{blog.title}</h3>
                                    {blog.isActive && (
                                        <span className="flex items-center text-green-400 text-xs">
                                            <FaCircle className="mr-1 animate-pulse" /> Active
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-3">
                                    {blog.content || 'No content available.'}
                                </p>
                                <p className="text-xs text-gray-500 mt-3">
                                    Published {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
                                </p>
                                <button
                                    onClick={() => setSelectedBlog(blog)}
                                    className="mt-3 inline-block text-sm font-medium text-pink-400 hover:text-pink-300 transition-colors"
                                >
                                    Read More →
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center py-12">No blog posts available yet.</p>
            )}

            {selectedBlog && (
                <FullBlogDialog blog={selectedBlog} onClose={() => setSelectedBlog(null)} />
            )}
        </div>
    );
};

export default NetBlog;
