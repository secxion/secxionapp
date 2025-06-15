import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    label: "Market",
    path: "/section",
    color: "bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-700 dark:to-purple-800",
    icon: <FaStore className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />,
  },
  {
    label: "Transaction Record",
    path: "/record",
    color: "bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-700 dark:to-teal-800",
    icon: <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />,
  },
  {
    label: "Wallet",
    path: "/mywallet",
    color: "bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-600 dark:to-orange-600",
    icon: <FaWallet className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />,
  },
  {
    label: "Profile",
    path: "/profile",
    color: "bg-gradient-to-r from-red-500 to-pink-500 dark:from-red-600 dark:to-pink-700",
    icon: <FaUser className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />,
  },
  {
    label: "Data Pad",
    path: "/datapad",
    color: "bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800",
    icon: <FaBook className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />,
  },
  {
    label: "Contact Support",
    path: "/report",
    color: "bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-700 dark:to-indigo-900",
    icon: (
      <IoChatbubbleEllipsesOutline className="text-3xl sm:text-4xl md:text-5xl text-black dark:text-white" />
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
  const menuSectionRef = useRef(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBlog, setShowBlog] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % giftCardImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const currentImage = giftCardImages[currentImageIndex];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <main className="container mx-auto px-2 sm:px-4 lg:px-6 space-y-6 sm:space-y-8 dark:text-white min-h-screen">
      {/* Hero Section */}
      <header
        className="hero-section relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[70vh] min-h-[350px] sm:min-h-[400px] mt-20 sm:mt-24 bg-cover bg-center rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out shadow-lg overflow-hidden"
        style={{ backgroundImage: `url(${currentImage.url})` }}
      >
        <div className="hero-overlay absolute inset-0 bg-black/60 rounded-lg sm:rounded-xl" />
        <div className="hero-content relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
          <motion.h1
            className="hero-title text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white dark:text-cyan-400 drop-shadow-lg animate-neon1 leading-tight break-words"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block sm:hidden">
              {truncateText("Welcome To Secxion", 18)}
            </span>
            <span className="hidden sm:block">
              Welcome To Secxion
            </span>
          </motion.h1>
          <motion.p
            className="hero-description text-sm sm:text-lg md:text-xl lg:text-3xl italic text-white dark:text-cyan-200 mt-2 sm:mt-4 animate-neon2 leading-relaxed break-words px-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="block sm:hidden text-center">
              {truncateText("Your Trusted Platform To Redeem Giftcards for Cash", 35)}
            </span>
            <span className="hidden sm:block md:hidden text-center">
              Your Trusted Platform To Redeem<br />Giftcards for Cash
            </span>
            <span className="hidden md:block">
              Your Trusted Platform To Redeem Giftcards for Cash
            </span>
          </motion.p>
          <motion.div
            className="hero-button-container mt-4 sm:mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/section"
              className="hero-button inline-block font-press-start bg-yellow-400 dark:bg-yellow-500 text-black border-2 border-black dark:border-yellow-600 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm uppercase shadow-[2px_2px_0_#333] hover:bg-yellow-500 dark:hover:bg-yellow-600 hover:shadow-[4px_4px_0_#111] transition-all duration-200 animate-pulseGlow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
            >
              <span className="block sm:hidden">Market</span>
              <span className="hidden sm:block">Market</span>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Toggle Button */}
      <div className="flex justify-center px-2">
        <button
          onClick={() => setShowBlog(!showBlog)}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-md transition duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2"
        >
          {showBlog ? "Show Menu" : "Show Blog"}
        </button>
      </div>

      {/* Blog Section */}
      <AnimatePresence mode="wait">
        {showBlog && (
          <motion.section
            key="blog"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="px-2 sm:px-4 md:px-6 pb-16 sm:pb-20"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 dark:text-white break-words">
              <span className="block sm:hidden">Latest News</span>
              <span className="hidden sm:block">Latest Insights</span>
            </h2>
            <div className="max-w-7xl mx-auto">
              <NetBlog limit={4} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Menu Section */}
      <AnimatePresence mode="wait">
        {!showBlog && (
          <motion.section
            key="menu"
            ref={menuSectionRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6 }}
            className="menu-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-6 pb-20 sm:pb-24"
          >
            {menuItems.map((item, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="whileHover"
                className={`menu-card rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg cursor-pointer ${item.color} transition-all duration-300 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-center hover:shadow-xl`}
              >
                <Link
                  to={item.path}
                  className="menu-link flex flex-col items-center gap-2 sm:gap-3 text-white w-full h-full justify-center focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-lg"
                >
                  <div className="menu-icon-container flex-shrink-0">
                    {item.icon}
                  </div>
                  <span className="menu-label text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide leading-tight text-center break-words max-w-full overflow-hidden">
                    <span className="block sm:hidden">
                      {truncateText(item.label, 12)}
                    </span>
                    <span className="hidden sm:block md:hidden">
                      {truncateText(item.label, 15)}
                    </span>
                    <span className="hidden md:block lg:hidden">
                      {truncateText(item.label, 18)}
                    </span>
                    <span className="hidden lg:block">
                      {item.label}
                    </span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-auto">
        <HomeFooter
          onBlogClick={() => {
            setShowBlog(true);
            scrollToSection(menuSectionRef);
          }}
          onMenuClick={() => {
            setShowBlog(false);
            scrollToSection(menuSectionRef);
          }}
          isBlogVisible={showBlog}
        />
      </div>
    </main>
  );
};

export default Home;