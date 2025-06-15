import { motion } from "framer-motion";
import {
  ShieldCheck,
  LockKeyhole,
  LogIn,
  UserPlus,
  RefreshCcw,
  ArrowRight,
  Star,
  TrendingUp,
  Zap,
  Globe,
  BookOpen,
  Headphones,
  CheckCircle,
  Menu,
  X,
  ChevronUp,
  LayoutDashboard 
} from "lucide-react";
import { useState, useEffect } from "react";
import './Header.css';
import { Link } from "react-router-dom";


export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 text-gray-900 font-sans"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Navigation Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
        variants={itemVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/home" className=" md:flex items-center font-bold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 tracking-wide">
                               <div className="logo-wrapper">
                                   <h1 className="logo-text font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">SXN</h1>
                                   <div className="logo-accent"></div>
                                </div>
                               </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
             <MobileNavLink href="/about-us">About</MobileNavLink>
                <MobileNavLink href="/terms">Terms</MobileNavLink>
                <MobileNavLink href="/privacy">Privacy</MobileNavLink>
                <MobileNavLink href="/contact-us">Contact</MobileNavLink>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <a href="/community-feed">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 flex items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </a>
                  <Button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                    onClick={() => setIsLoggedIn(false) }
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <a href="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Sign In
                    </Button>
                  </a>
                  <a href="/sign-up">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg">
                      Get Started
                    </Button>
                  </a>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

         

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div
              className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="px-4 py-6 space-y-4">
                <MobileNavLink href="/about-us">About</MobileNavLink>
                <MobileNavLink href="/terms">Terms</MobileNavLink>
                <MobileNavLink href="/privacy">Privacy</MobileNavLink>
                <MobileNavLink href="/contact-us">Contact</MobileNavLink>
                 {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 pt-4 space-y-2">
                   {isLoggedIn ? (
                      <>
                        <a href="/community-feed" className="block w-full">
                          <Button className="w-full justify-center bg-blue-600 text-white">Dashboard</Button>
                        </a>
                        <Button 
                          className="w-full justify-center bg-gray-200 text-gray-800"
                          onClick={() => setIsLoggedIn(false)}
                        >
                          Log Out
                        </Button>
                      </>
                    ) : (
                      <>
                        <a href="/login" className="block w-full">
                           <Button className="w-full justify-center bg-gray-600 text-gray-800">Sign In</Button>
                        </a>
                        <a href="/sign-up" className="block w-full">
                           <Button className="w-full justify-center bg-blue-600 text-white">Get Started</Button>
                        </a>
                      </>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="pt-16">
        <motion.section
          className="relative overflow-hidden py-20 lg:py-32"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <motion.div
                className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Star className="h-4 w-4 fill-current" />
                <span>Trusted by 10,000+ users worldwide</span>
              </motion.div>

              <motion.h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
                  Your Secure Hub for
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Digital Assets
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Trade gift cards, exchange crypto vouchers, and make seamless digital transactions with enterprise-grade security and instant processing.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                  <a href="/sign-up" className="w-full sm:w-auto">
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group">
                      <UserPlus className="mr-2 h-5 w-5" />
                      Start Trading Now
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>

                  <a href="/login" className="w-full sm:w-auto">
                    <Button className="bg-gray-800 hover:bg-black text-white rounded-xl w-full font-semibold tracking-wide shadow-lg px-8 py-6 text-base">
                      <LogIn className="mr-2 h-5 w-5" /> Sign In
                    </Button>
                  </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap justify-center items-center gap-6 mt-16 pt-8 border-t border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <TrustBadge icon={<ShieldCheck />} text="Bank-Level Security" />
                <TrustBadge icon={<Zap />} text="Instant Processing" />
                <TrustBadge icon={<CheckCircle />} text="24/7 Support" />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-20 bg-white"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Choose Secxion?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Experience the future of digital asset trading with our cutting-edge platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-green-500" />}
                title="Enterprise Security"
                description="Bank-level encryption, multi-factor authentication, and real-time fraud detection protect every transaction."
                features={["256-bit SSL encryption", "Multi-factor authentication", "Real-time monitoring"]}
              />
              <FeatureCard
                icon={<LockKeyhole className="h-8 w-8 text-blue-500" />}
                title="Privacy First"
                description="Your personal data and transaction history are protected with zero-knowledge architecture."
                features={["Zero-knowledge privacy", "Encrypted data storage", "GDPR compliant"]}
              />
              <FeatureCard
                icon={<RefreshCcw className="h-8 w-8 text-purple-500" />}
                title="Instant Exchanges"
                description="Automated matching system ensures lightning-fast trades with competitive rates."
                features={["Sub-second processing", "Competitive rates", "24/7 availability"]}
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8 text-orange-500" />}
                title="Global Marketplace"
                description="Access gift cards from 150+ brands across 50+ countries with instant delivery."
                features={["150+ brands", "50+ countries", "Instant delivery"]}
              />
              <FeatureCard
                icon={<BookOpen className="h-8 w-8 text-indigo-500" />}
                title="Transparent Terms"
                description="Clear, honest policies with no hidden fees. You always know what you're paying for."
                features={["No hidden fees", "Clear pricing", "Transparent policies"]}
              />
              <FeatureCard
                icon={<Headphones className="h-8 w-8 text-pink-500" />}
                title="24/7 Expert Support"
                description="Our dedicated team provides round-the-clock assistance for all your trading needs."
                features={["24/7 availability", "Expert support", "Multiple languages"]}
              />
            </div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
          variants={itemVariants}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Trusted by Thousands
              </h2>
              <p className="text-xl text-gray-600">
                Join our growing community of satisfied traders
              </p>

              {/* --- MODIFIED LINK --- */}
              {/* This link now directs to the community feed if logged in, or the login page if not. */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <a href={isLoggedIn ? "/community-feed" : "/login"} className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group">
                    {isLoggedIn ? 'Go to Feed' : 'Login to View Feed'}
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatsCard
                icon={<TrendingUp className="h-8 w-8 text-blue-500" />}
                value="$2.5M+"
                label="Trading Volume"
                description="Monthly transactions"
              />
              <StatsCard
                icon={<UserPlus className="h-8 w-8 text-green-500" />}
                value="10,000+"
                label="Active Users"
                description="Verified traders"
              />
              <StatsCard
                icon={<RefreshCcw className="h-8 w-8 text-purple-500" />}
                value="99.9%"
                label="Uptime"
                description="Platform reliability"
              />
              <StatsCard
                icon={<Star className="h-8 w-8 text-yellow-500" />}
                value="4.9/5"
                label="User Rating"
                description="Customer satisfaction"
              />
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600"
          variants={itemVariants}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of traders who trust Secxion for their digital asset needs. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/sign-up" className="w-full sm:w-auto">
                <Button className=" text-blue-600 rounded-xl px-8 py-6 text-lg font-semibold">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp className="h-6 w-6" />
        </motion.button>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold text-white">Secxion</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your trusted platform for secure digital asset trading. Built with enterprise-grade security and designed for everyone.
              </p>
              <div className="flex space-x-4">
                <SocialLink href="#" icon="𝕏" />
                <SocialLink href="#" icon="in" />
                <SocialLink href="#" icon="gh" />
              </div>
            </div>
            
            {/* Footer Links could be added here */}
            
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Secxion. All rights reserved. Proudly developed by{" "}
              <span className="text-white font-semibold">BMXII</span>.
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

// Custom Button Component
function Button({ children, className = "", variant = "default", ...props }) {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";
  
  const variants = {
    default: "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2",
    outline: "border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2",
    ghost: "hover:bg-gray-100 text-gray-600 px-4 py-2"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

// Component definitions
function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function MobileNavLink({ href, children }) {
  return (
    <a
      href={href}
      className="block text-gray-700 hover:text-gray-900 font-medium py-2 transition-colors"
    >
      {children}
    </a>
  );
}

function TrustBadge({ icon, text }) {
  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <span className="text-green-500">{icon}</span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}

function FeatureCard({ icon, title, description, features }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 group"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center space-x-2 text-sm text-gray-500">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function StatsCard({ icon, value, label, description }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-8 text-center"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-lg font-semibold text-gray-700 mb-1">{label}</div>
      <div className="text-sm text-gray-500">{description}</div>
    </motion.div>
  );
}

function SocialLink({ href, icon }) {
  return (
    <a
      href={href}
      className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors"
    >
      <span className="text-gray-400 hover:text-white text-sm font-bold">
        {icon}
      </span>
    </a>
  );
}
