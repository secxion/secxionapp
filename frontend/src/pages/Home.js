import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaWallet, FaUser, FaStore, FaBook, FaClipboardList } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import HomeFooter from '../Components/HomeFooter';
import NetBlog from '../Components/NetBlog';
import giftCardImages from '../helper/heroimages';
import './Home.css';
import { useSelector } from "react-redux";
import { PiUserSquare } from "react-icons/pi";

const menuItems = [
    { label: "Marketplace", path: "/section", color: "bg-gradient-to-r from-blue-500 to-purple-500", icon: <FaStore className="text-4xl md:text-5xl text-black" /> },
    { label: "Transaction Record", path: "/record", color: "bg-gradient-to-r from-green-500 to-teal-500", icon: <FaClipboardList className="text-4xl md:text-5xl text-black" /> },
    { label: "Wallet", path: "/mywallet", color: "bg-gradient-to-r from-yellow-500 to-orange-500", icon: <FaWallet className="text-4xl md:text-5xl text-black" /> },
    { label: "Profile", path: "/profile", color: "bg-gradient-to-r from-red-500 to-pink-500", icon: <FaUser className="text-4xl md:text-5xl text-black" /> },
    { label: "Data Pad", path: "/datapad", color: "bg-gradient-to-r from-gray-300 to-gray-400", icon: <FaBook className="text-4xl md:text-5xl text-black" /> },
    { label: "Contact Support", path: "/report", color: "bg-gradient-to-r from-indigo-500 to-indigo-600", icon: <IoChatbubbleEllipsesOutline className="text-4xl md:text-5xl text-black" /> },
];

const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
    whileHover: { scale: 1.04, boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.15)", transition: { duration: 0.2 } },
};

const Home = () => {
    const blogSectionRef = useRef(null);
    const menuSectionRef = useRef(null);
    const [isBlogVisible, setIsBlogVisible] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showMenuButton, setShowMenuButton] = useState(false);
    const { user } = useSelector((state) => state.user);

    const scrollToBlogSection = () => {
        blogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        setIsBlogVisible(true);
        setShowMenuButton(true);
    };

    const scrollToMenuSection = () => {
        menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
        setIsBlogVisible(false);
        setShowMenuButton(false);
    };

    useEffect(() => {
        const imageInterval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % giftCardImages.length);
        }, 5000);
        return () => clearInterval(imageInterval);
    }, []);


    const currentImage = giftCardImages[currentImageIndex];

    return (
        <div className="container home-container space-y-4">
            {/* Hero Section */}
            <div
                className="hero-section"
                style={{ backgroundImage: `url(${currentImage.url})` }}
            >
                <div className="hero-overlay" aria-hidden="true" />
                <div className="hero-content">
                    <motion.div
                        className="welcome-dialog"
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 30 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                            <div className="text-center">
                                <h1 className="hero-title">
                                Welcome To Secxion
                                </h1>
                                <p className="hero-description">
                                    Your Trusted Platform To Redeem Your Giftcards for Cash
                                </p>
                                <Link
                                    to="/section"
                                    className="hero-button"
                                >
                                    Marketplace
                                </Link>
                            </div>
                        
                    </motion.div>
                </div>
            </div>

            {/* Menu Grid Section */}
            <div ref={menuSectionRef} className={` menu-section ${showMenuButton ? 'menu-section-small' : ''}`}>
                {menuItems.map((item, index) => (
                    <motion.div
                        key={index}
                        variants={cardVariants}
                        initial="initial"
                        animate="animate"
                        whileHover="whileHover"
                        className={`menu-item ${item.color} ${showMenuButton ? 'menu-item-small' : ''}`}
                    >
                        <Link to={item.path} className="menu-link" aria-label={item.label}>
                            <div className="icon-container">
                                {item.icon}
                            </div>
                            <span className="menu-label">{item.label}</span>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Blog Section */}
            <div ref={blogSectionRef} className={`blog-section ${isBlogVisible ? 'visible' : ''}`}>
                <h2 className="blog-header">
                    Latest Insights
                </h2>
                <NetBlog />
            </div>

            {/* Footer */}
            <HomeFooter
                onBlogClick={scrollToBlogSection}
                onMenuClick={scrollToMenuSection}
                isBlogVisible={isBlogVisible}
            />
        </div>
    );
};

export default Home;
