import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaUser,
  FaStore,
  FaBook,
  FaClipboardList,
} from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import HomeFooter from "../Components/HomeFooter";
import NetBlog from "../Components/NetBlog";
import giftCardImages from "../helper/heroimages";
import "./Home.css";

const menuItems = [
  {
    label: "Marketplace",
    path: "/section",
    color: "bg-gradient-to-r from-blue-500 to-purple-500",
    icon: <FaStore className="text-4xl md:text-5xl text-black" />,
  },
  {
    label: "Transaction Record",
    path: "/record",
    color: "bg-gradient-to-r from-green-500 to-teal-500",
    icon: <FaClipboardList className="text-4xl md:text-5xl text-black" />,
  },
  {
    label: "Wallet",
    path: "/mywallet",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500",
    icon: <FaWallet className="text-4xl md:text-5xl text-black" />,
  },
  {
    label: "Profile",
    path: "/profile",
    color: "bg-gradient-to-r from-red-500 to-pink-500",
    icon: <FaUser className="text-4xl md:text-5xl text-black" />,
  },
  {
    label: "Data Pad",
    path: "/datapad",
    color: "bg-gradient-to-r from-gray-300 to-gray-400",
    icon: <FaBook className="text-4xl md:text-5xl text-black" />,
  },
  {
    label: "Contact Support",
    path: "/report",
    color: "bg-gradient-to-r from-indigo-500 to-indigo-600",
    icon: (
      <IoChatbubbleEllipsesOutline className="text-4xl md:text-5xl text-black" />
    ),
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
  whileHover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const Home = () => {
  const blogSectionRef = useRef(null);
  const menuSectionRef = useRef(null);
  const [isBlogVisible, setIsBlogVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMenuButton, setShowMenuButton] = useState(false);

  const scrollToBlogSection = () => {
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsBlogVisible(true);
    setShowMenuButton(true);
  };

  const scrollToMenuSection = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    setIsBlogVisible(false);
    setShowMenuButton(false);
  };

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % giftCardImages.length
      );
    }, 6000);
    return () => clearInterval(imageInterval);
  }, []);

  const currentImage = giftCardImages[currentImageIndex];

  return (
    <main className="container home-container space-y-6">
      {/* Hero Section */}
      <header
        className="hero-section tv-screen mt-20 md:mt-28 px-4 text-center"
        style={{ backgroundImage: `url(${currentImage.url})` }}
      >
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <motion.div
            className="welcome-dialog"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="minecraft-font hero-title text-4xl md:text-6xl font-bold text-white animate-neon1">
              Welcome To Secxion
            </h1>
            <p className="hero-description text-2xl md:text-4xl italic text-white animate-neon2">
              Your Trusted Platform To Redeem Giftcards for Cash
            </p>
            <div className="hero-button-container mt-4">
              <Link
                to="/section"
                className="hero-button animate-pulseGlow"
                aria-label="Go to Marketplace"
              >
                Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Menu Grid Section */}
      <section
        ref={menuSectionRef}
        className={`menu-section text-white text-2xl border-b-4 pb-1 border-cyan-400 ${
          showMenuButton ? "menu-section-small" : ""
        }`}
      >
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="whileHover"
            className={`menu-item ${item.color} ${
              showMenuButton ? "menu-item-small" : ""
            }`}
          >
            <Link
              to={item.path}
              className="menu-link"
              aria-label={`Go to ${item.label}`}
            >
              <div className="icon-container">{item.icon}</div>
              <span className="menu-label">{item.label}</span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Blog Section */}
      <section
        ref={blogSectionRef}
        className={`blog-section ${isBlogVisible ? "visible" : ""}`}
      >
        <h2 className="blog-header minecraft-font">Latest Insights</h2>
        <NetBlog />
      </section>

      {/* Footer */}
      <HomeFooter
        onBlogClick={scrollToBlogSection}
        onMenuClick={scrollToMenuSection}
        isBlogVisible={isBlogVisible}
      />
    </main>
  );
};

export default Home;
