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

const AnimatedGeometricBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const generateLines = () => {
    const lines = [];
    const numLines = 15;
    
    for (let i = 0; i < numLines; i++) {
      const startX = Math.random() * dimensions.width;
      const startY = Math.random() * dimensions.height;
      const endX = Math.random() * dimensions.width;
      const endY = Math.random() * dimensions.height;
      
      lines.push({
        id: i,
        startX,
        startY,
        endX,
        endY,
        animationDelay: Math.random() * 8,
        duration: 4 + Math.random() * 6
      });
    }
    return lines;
  };

  const generateDots = () => {
    const dots = [];
    const numDots = 25;
    
    for (let i = 0; i < numDots; i++) {
      dots.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: 2 + Math.random() * 6,
        animationDelay: Math.random() * 5,
        duration: 3 + Math.random() * 4
      });
    }
    return dots;
  };

  const generateCircles = () => {
    const circles = [];
    const numCircles = 12;
    
    for (let i = 0; i < numCircles; i++) {
      circles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: 20 + Math.random() * 60,
        animationDelay: Math.random() * 6,
        duration: 5 + Math.random() * 8
      });
    }
    return circles;
  };

  const lines = generateLines();
  const dots = generateDots();
  const circles = generateCircles();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg width="100%" height="100%" className="absolute inset-0">
        {lines.map((line) => (
          <motion.line
            key={line.id}
            x1={line.startX}
            y1={line.startY}
            x2={line.endX}
            y2={line.endY}
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            opacity="0.4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0.3, 0],
              opacity: [0, 0.6, 0.8, 0]
            }}
            transition={{
              duration: line.duration,
              delay: line.animationDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Animated dots */}
        {dots.map((dot) => (
          <motion.circle
            key={dot.id}
            cx={dot.x}
            cy={dot.y}
            r={dot.size}
            fill="url(#dotGradient)"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 0.8, 0],
              opacity: [0, 0.8, 0.6, 0]
            }}
            transition={{
              duration: dot.duration,
              delay: dot.animationDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Animated circles */}
        {circles.map((circle) => (
          <motion.circle
            key={circle.id}
            cx={circle.x}
            cy={circle.y}
            r={circle.size}
            fill="none"
            stroke="url(#circleGradient)"
            strokeWidth="2"
            opacity="0.3"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1, 1.2, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.5, 0.3, 0]
            }}
            transition={{
              duration: circle.duration,
              delay: circle.animationDelay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a16207" stopOpacity="0.8" /> {/* Darker Yellow/Orange */}
            <stop offset="50%" stopColor="#facc15" stopOpacity="0.6" /> {/* Yellow */}
            <stop offset="100%" stopColor="#1f2937" stopOpacity="0.4" /> {/* Dark Gray */}
          </linearGradient>
          <radialGradient id="dotGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eab308" stopOpacity="0.9" /> {/* Strong Yellow */}
            <stop offset="100%" stopColor="#4b5563" stopOpacity="0.3" /> {/* Gray */}
          </radialGradient>
          <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fcd34d" stopOpacity="0.6" /> {/* Light Yellow */}
            <stop offset="50%" stopColor="#1f2937" stopOpacity="0.4" /> {/* Dark Gray */}
            <stop offset="100%" stopColor="#92400e" stopOpacity="0.3" /> {/* Dark Orange */}
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0">
        {[...Array(10)].map((_, i) => {
          const size = 15 + Math.random() * 30;
          return (
            <motion.div
              key={`triangle-${i}`}
              className="absolute"
              style={{
                left: `${Math.random() * 95}%`,
                top: `${Math.random() * 95}%`,
                width: 0,
                height: 0,
                borderLeft: `${size}px solid transparent`,
                borderRight: `${size}px solid transparent`,
                borderBottom: `${size * 1.2}px solid rgba(252, 211, 77, 0.4)`, // Yellowish
              }}
              animate={{
                rotate: [0, 120, 240, 360],
                scale: [1, 1.3, 0.8, 1],
                opacity: [0.3, 0.7, 0.4, 0.3],
                x: [0, 20, -10, 0],
                y: [0, -15, 10, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          const size = 20 + Math.random() * 40;
          return (
            <motion.div
              key={`square-${i}`}
              className="absolute border-2 opacity-30"
              style={{
                left: `${Math.random() * 90}%`,
                top: `${Math.random() * 90}%`,
                width: `${size}px`,
                height: `${size}px`,
                borderColor: `rgba(252, 211, 77, 0.5)`, // Yellowish
              }}
              animate={{
                rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
                scale: [1, 1.4, 0.6, 1],
                opacity: [0.3, 0.8, 0.2, 0.3],
                borderRadius: ["0%", "25%", "50%", "25%", "0%"],
              }}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => {
          const size = 25 + Math.random() * 35;
          return (
            <motion.div
              key={`hexagon-${i}`}
              className="absolute opacity-40"
              style={{
                left: `${Math.random() * 88}%`,
                top: `${Math.random() * 88}%`,
                width: `${size}px`,
                height: `${size}px`,
                background: `linear-gradient(45deg, rgba(252, 211, 77, 0.4), rgba(245, 158, 11, 0.4))`, // Yellow to Orange
                clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)',
              }}
              animate={{
                rotate: [0, 60, 120, 180, 240, 300, 360],
                scale: [1, 1.5, 0.8, 1.2, 1],
                opacity: [0.4, 0.8, 0.3, 0.6, 0.4],
              }}
              transition={{
                duration: 12 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 6,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => {
          const centerX = Math.random() * window.innerWidth;
          const centerY = Math.random() * window.innerHeight;
          const radius = 50 + Math.random() * 100;
          
          return (
            <motion.div
              key={`orbit-${i}`}
              className="absolute w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-700 rounded-full opacity-60" // Yellow gradient
              style={{
                left: centerX,
                top: centerY,
              }}
              animate={{
                x: [
                  radius * Math.cos(0),
                  radius * Math.cos(Math.PI / 2),
                  radius * Math.cos(Math.PI),
                  radius * Math.cos(3 * Math.PI / 2),
                  radius * Math.cos(2 * Math.PI),
                ],
                y: [
                  radius * Math.sin(0),
                  radius * Math.sin(Math.PI / 2),
                  radius * Math.sin(Math.PI),
                  radius * Math.sin(3 * Math.PI / 2),
                  radius * Math.sin(2 * Math.PI),
                ],
                scale: [1, 1.5, 1, 0.5, 1],
              }}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const menuItems = [
  {
    label: "Market",
    path: "/section",
    color: "bg-gradient-to-r from-yellow-600 to-yellow-800", // Updated gradient
    icon: <FaStore className="text-3xl sm:text-4xl md:text-5xl text-gray-900" />, // Icon color for dark background
  },
  {
    label: "Transaction Record",
    path: "/record",
    color: "bg-gradient-to-r from-gray-700 to-gray-900", // Updated gradient
    icon: <FaClipboardList className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" />, // Icon color for dark background
  },
  {
    label: "Wallet",
    path: "/mywallet",
    color: "bg-gradient-to-r from-yellow-600 to-yellow-800", // Updated gradient
    icon: <FaWallet className="text-3xl sm:text-4xl md:text-5xl text-gray-900" />, // Icon color for dark background
  },
  {
    label: "Profile",
    path: "/profile",
    color: "bg-gradient-to-r from-gray-700 to-gray-900", // Updated gradient
    icon: <FaUser className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" />, // Icon color for dark background
  },
  {
    label: "Data Pad",
    path: "/datapad",
    color: "bg-gradient-to-r from-yellow-600 to-yellow-800", // Updated gradient
    icon: <FaBook className="text-3xl sm:text-4xl md:text-5xl text-gray-900" />, // Icon color for dark background
  },
  {
    label: "Contact Support",
    path: "/report",
    color: "bg-gradient-to-r from-gray-700 to-gray-900", // Updated gradient
    icon: (
      <IoChatbubbleEllipsesOutline className="text-3xl sm:text-4xl md:text-5xl text-yellow-400" /> // Icon color for dark background
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

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="relative min-h-screen bg-gray-950"> {/* Main background set to dark */}
      <AnimatedGeometricBackground />
      
      <main className="relative z-10 container mx-auto px-2 sm:px-4 lg:px-6 space-y-6 sm:space-y-8 text-gray-100 min-h-screen"> {/* Text color set to light */}
        <header
          className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[70vh] min-h-[350px] sm:min-h-[400px] mt-20 sm:mt-24 bg-cover bg-center rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-500 ease-in-out shadow-lg overflow-hidden" // Removed 'hero-section' class
          style={{ backgroundImage: `url(${currentImage.url})` }}
        >
          <div className="absolute inset-0 bg-black/70 rounded-lg sm:rounded-xl" /> {/* Replaced 'hero-overlay' with Tailwind */}
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto"> {/* Replaced 'hero-content' with Tailwind */}
            <motion.div
              className="mt-4 sm:mt-6" // Removed 'hero-button-container'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/section"
                className="inline-block font-press-start bg-yellow-500 text-gray-900 border-2 border-yellow-700 px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 text-xs sm:text-sm uppercase shadow-[2px_2px_0_#a16207] hover:bg-yellow-600 hover:shadow-[4px_4px_0_#854d0e] transition-all duration-200 animate-pulseGlow focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2" // Removed 'hero-button' class
              >
                <span className="block sm:hidden">Market</span>
                <span className="hidden sm:block">Market</span>
              </Link>
            </motion.div>
          </div>
        </header>

        {/* Toggle Button - Updated colors */}
        <div className="flex justify-center px-2">
          <button
            onClick={() => setShowBlog(!showBlog)}
            className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold shadow-md transition duration-300 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 backdrop-blur-sm"
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6 text-gray-100 break-words"> {/* Text color set to light */}
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
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 md:px-6 pb-20 sm:pb-24" // Removed 'menu-grid' class
            >
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="whileHover"
                  className={`rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg cursor-pointer ${item.color} transition-all duration-300 min-h-[120px] sm:min-h-[140px] md:min-h-[160px] flex flex-col items-center justify-center hover:shadow-xl backdrop-blur-sm`} // Removed 'menu-card' class
                >
                  <Link
                    to={item.path}
                    className="flex flex-col items-center gap-2 sm:gap-3 text-gray-100 w-full h-full justify-center focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-lg" // Removed 'menu-link' class
                  >
                    <div className="flex-shrink-0"> {/* Removed 'menu-icon-container' class */}
                      {item.icon}
                    </div>
                    <span className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-wide leading-tight text-center break-words max-w-full overflow-hidden"> {/* Removed 'menu-label' class and text-shadow */}
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
    </div>
  );
};

export default Home;
