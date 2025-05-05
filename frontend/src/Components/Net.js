import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
        <div className="net-container fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
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
    const [transitionClass, setTransitionClass] = useState("translate-x-0");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [isMobile, setIsMobile] = useState(false);

    const checkIsMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 768);
    }, []);

    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);
        return () => window.removeEventListener('resize', checkIsMobile);
    }, [checkIsMobile]);

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
            setTransitionClass("translate-x-1/2 opacity-0");
            setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % blogs.length);
                setTransitionClass("translate-x-0 opacity-100");
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

        return () => resetTimeout();
    }, [blogs]);

    const currentBlog = blogs && blogs.length > 0 ? blogs[currentIndex] : null;

    return (
        <div className="net-container fixed top-0 left-0 w-full bg-gradient-to-r from-purple-600 to-blue-500 shadow-md h-10 md:h-12 px-4 md:px-6 flex items-center font-mono text-white transition-all duration-300">
            <span className="text-xs md:text-sm font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full px-2 py-1 mr-2 tracking-wider">
                BLOGs:
            </span>

            <div className="flex-grow relative h-6 overflow-hidden flex items-center">
                {loading ? (
                    <span className="text-sm font-semibold animate-pulse">Loading...</span>
                ) : currentBlog ? (
                    <span className={`absolute transition-transform duration-300 ease-in-out whitespace-nowrap ${transitionClass}`}>
                        <span
                            className="font-bold cursor-pointer hover:underline mr-2"
                            onClick={() => handleBlogClick(currentBlog)}
                        >
                            {currentBlog.title}
                        </span>

                        <span
                            className={`inline text-sm ${isMobile ? "truncate max-w-[70%]" : ""} cursor-pointer`}
                            onClick={() => handleBlogClick(currentBlog)}
                        >
                            <ArrowRight className="inline w-4 h-4 text-blue-300 mr-1" />
                            {isMobile
                                ? currentBlog.content.length > 40
                                    ? `${currentBlog.content.substring(0, 40)}...`
                                    : currentBlog.content
                                : currentBlog.content}
                        </span>
                    </span>
                ) : (
                    <span className="italic text-sm">No news available.</span>
                )}
            </div>

            {/* Dialog */}
            <CustomDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                title={selectedBlog?.title}
                description={selectedBlog?.content}
            />
        </div>
    );
};

export default Net;
