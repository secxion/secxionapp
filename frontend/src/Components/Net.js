import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react"; // Import the icon
import "./Net.css";

// ===============================
// Custom Dialog Component
// ===============================
const CustomDialog = ({ open, onOpenChange, children, title, description }) => {
    const dialogRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dialogRef.current && !dialogRef.current.contains(event.target) && open) {
                onOpenChange(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, onOpenChange]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && open) {
                onOpenChange(false);
            }
        };

        if (open) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [open, onOpenChange]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                ref={dialogRef}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                {title && <h2 id="dialog-title" className="text-lg font-semibold mb-2">{title}</h2>}
                {description && <p id="dialog-description" className="text-gray-600 mb-4">{description}</p>}
                {children}
                <button
                    onClick={() => onOpenChange(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Close
                </button>
            </motion.div>
        </div>
    );
};

const Net = ({ blogs }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [transitionClass, setTransitionClass] = useState("blog-content");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    // Function to determine if it's a mobile screen
    const checkIsMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    // Check on initial load and resize
    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [checkIsMobile]);

    // Function to handle fetching and displaying the full blog content in a dialog
    const handleBlogClick = (blog) => {
        setSelectedBlog(blog);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const resetTimeout = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        const nextBlog = () => {
            resetTimeout();
            setTransitionClass("blog-content slide-out");
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
                setTransitionClass("blog-content slide-in");
                timeoutRef.current = setTimeout(nextBlog, 10000);
            }, 300);
        };

        if (blogs && blogs.length > 0) {
            setLoading(true);
            timeoutRef.current = setTimeout(() => {
                setLoading(false);
                nextBlog();
            }, 500);
        }

        return () => {
            resetTimeout();
        };
    }, [blogs]);

    const currentBlog = blogs && blogs.length > 0 ? blogs[currentIndex] : null;

    return (
        <div className="net-container">
            <span className="net-label">BLOGs:</span>
            <div className="blog-wrapper">
                {loading ? (
                    <span className="loading-text">Loading...</span>
                ) : currentBlog ? (
                    <React.Fragment>
                        <span className={transitionClass}>
                            <span
                                className="blog-title cursor-pointer hover:underline"
                                onClick={() => handleBlogClick(currentBlog)}
                            >
                                {currentBlog.title} <></>

                                <span
                                className={isMobile ? "blog-text mobile-blog-text" : "blog-text"}
                                onClick={() => handleBlogClick(currentBlog)}
                            >
                                <ArrowRight className="inline-block w-4 h-4 mr-1 text-blue-400" />
                                <></>
                                {isMobile ? (
                                    currentBlog.content.length > 20 ? (
                                        <>
                                            {currentBlog.content.substring(0, 40)}...
                                        </>
                                    ) : (
                                        currentBlog.content
                                    )
                                ) : (
                                    currentBlog.content
                                )}
                            </span>

                            </span>
                            

                        </span>
                    </React.Fragment>
                ) : (
                    <span className="no-blogs-message">No news available.</span>
                )}
            </div>

            {/* Dialog for Full Blog Content */}
            <CustomDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedBlog?.title}
                description={selectedBlog?.content}
            >
            </CustomDialog>
        </div>
    );
};

export default Net;

