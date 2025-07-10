import { AnimatePresence, motion } from "framer-motion";
import { SiEthereum } from 'react-icons/si';

import {
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Zap,
  Globe,
  Headphones,
  Menu,
  X,
  ChevronUp,
  LayoutDashboard,
  Gift,
  Bitcoin,
  CreditCard,
  Wrench,
  Shapes,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Smartphone,
  Code,
  Settings,
  Star,
  CheckCircle,
  ArrowUpRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import HiRateSlider from "../Components/HiRateSlider";
import LogoShimmer from "../Components/LogoShimmer";


const Button = ({ children, className = "", variant = "default", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = {
    // Updated button variants for black and yellow theme
    default: "bg-yellow-600 hover:bg-yellow-700 text-gray-900 focus:ring-yellow-500",
    ghost: "bg-transparent hover:bg-gray-800 text-gray-100 focus:ring-yellow-500",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-100 focus:ring-yellow-500"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Navigation Components
const NavLink = ({ href, children }) => (
  <a href={href} className="text-gray-300 hover:text-yellow-400 font-medium transition-colors">
    {children}
  </a>
);

const MobileNavLink = ({ href, children }) => (
  <a href={href} className="block py-2 text-gray-100 hover:text-yellow-400 font-medium transition-colors">
    {children}
  </a>
);

// Enhanced Service Card Component
const ServiceCard = ({ icon, title, description, highlight }) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-800 relative overflow-hidden h-full"> {/* Updated background and border */}
        {highlight && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-600 to-yellow-800 text-gray-900 text-xs font-bold px-3 py-1 rounded-full"> {/* Updated highlight tag */}
            POPULAR
          </div>
        )}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500 opacity-50"></div> {/* Updated decorative element */}
        <div className="relative z-10">
          <div className="mb-6 inline-block p-4 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl group-hover:from-gray-700 group-hover:to-gray-600 transition-all duration-300"> {/* Updated icon background */}
            {icon}
          </div>
          <h3 className="text-2xl font-bold text-gray-100 mb-4">{title}</h3> {/* Updated text color */}
          <p className="text-gray-300 leading-relaxed text-lg">{description}</p> {/* Updated text color */}
        </div>
      </div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-gray-900 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-800 h-full"> {/* Updated background and border */}
        <div className="flex items-start mb-4">
          <div className="p-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg mr-4 flex-shrink-0"> {/* Updated icon background */}
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">{title}</h3> {/* Updated text color */}
            <p className="text-gray-300 text-sm leading-relaxed">{description}</p> {/* Updated text color */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// How It Works Step Component
const StepCard = ({ number, title, description, icon }) => {
  return (
    <motion.div
      className="relative text-center group"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-800"> {/* Updated background and border */}
        <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-yellow-800 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl mx-auto mb-4"> {/* Updated number circle */}
          {number}
        </div>
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-100 mb-3">{title}</h3> {/* Updated text color */}
        <p className="text-gray-300 leading-relaxed">{description}</p> {/* Updated text color */}
      </div>
    </motion.div>
  );
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currencies, setCurrencies] = useState([
    { name: 'BTC', price: '68,450.50', change: '+2.15%' },
    { name: 'ETH', price: '3,550.75', change: '-0.50%' },
    { name: 'USD/NGN', price: '1,450.20', change: '+0.10%' },
    { name: 'EUR/USD', price: '1.0855', change: '-0.25%' },
    { name: 'SOL', price: '150.80', change: '+5.75%' },
    { name: 'DOGE', price: '0.162', change: '+3.20%' },
  ]);

  useEffect(() => {
    const updateCurrencies = () => {
      setCurrencies(prev => prev.map(currency => ({
        ...currency,
        price: (parseFloat(currency.price.replace(',', '')) * (0.98 + Math.random() * 0.04)).toLocaleString('en-US', {
          minimumFractionDigits: currency.name === 'DOGE' ? 3 : 2,
          maximumFractionDigits: currency.name === 'DOGE' ? 3 : 2
        }),
        change: `${Math.random() > 0.5 ? '+' : ''}${(Math.random() * 10 - 5).toFixed(2)}%`
      })));
    };

    const interval = setInterval(updateCurrencies, 5000);
    return () => clearInterval(interval);
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
      }
    }
  };

  return (
    <motion.div
      // Main background gradient changed to black and dark gray
      className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 mt-10 text-gray-100 font-sans relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Geometric Background Elements - Updated colors for black theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-gray-700/30 rotate-45 animate-spin [animation-duration:20s]"></div>
        <div className="absolute top-1/4 right-20 w-20 h-20 bg-gradient-to-r from-yellow-900/40 to-yellow-800/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 border-4 border-gray-700/30 rounded-full animate-bounce [animation-duration:3s]"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-yellow-700/20 rounded-full"></div> {/* Updated border color */}
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-yellow-800/30 to-yellow-700/30 transform rotate-12 animate-pulse"></div> {/* Updated background */}
      </div>
      {/* Navigation Header */}
      
      <motion.header
        className="fixed top-0 h-24 left-0 right-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-700/10" // Updated background and border
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center space-x-4">
                                   
               <a href="/" className="relative">
                  <div className=" flex py-1 flex-col justify-center">
                                                                <div className="relative py-2  sm:mx-auto ">
                                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform rounded-3xl border-4 border-yellow-700"></div>
                                                                    <div className="relative px-4 p-1.5 bg-white shadow-lg rounded-2xl sm:p-1.5 border-4 border-yellow-700">
                                                                        <div className="">
                                                                            <div className="grid grid-cols-1">                    
                                                                                <LogoShimmer type="button" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                 <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
               </a>

               <div className="md:hidden flex items-center space-x-2">
                 <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                 <p className="text-yellow-400 text-sm font-mono tracking-wider">
                   System Design in Progress<span className="animate-blink">_</span>
                 </p>
              </div>
            
             </div>      
                   
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <NavLink href="/about-us">About</NavLink>
              <NavLink href="/terms">Terms</NavLink>
              <NavLink href="/privacy">Privacy</NavLink>
              <NavLink href="/contact-us">Contact</NavLink>
            </nav>

    

            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 flex items-center">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button 
                    className="bg-gray-800 hover:bg-gray-700 text-gray-100"
                    onClick={() => setIsLoggedIn(false)}
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="text-gray-300 hover:text-yellow-400">
                    <a href="/login">Sign In</a>
                  </Button>
                  <Button className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900 shadow-lg"> {/* Updated button gradient */}
                    <a href="/sign-up">Get Started</a>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors text-yellow-400" // Updated text color
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
    {isMenuOpen && (
      <motion.div
        key="mobile-menu"
        className="absolute top-full left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-md rounded-b-xl overflow-hidden"
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.1, ease: 'easeOut' } }}
        exit={{ opacity: 0, y: 0, transition: { duration: 0.1, ease: 'easeIn' } }}
      >
        <div className="px-4 py-6 space-y-4">
          <MobileNavLink href="/about-us">About</MobileNavLink>
          <MobileNavLink href="/terms">Terms</MobileNavLink>
          <MobileNavLink href="/privacy">Privacy</MobileNavLink>
          <MobileNavLink href="/contact-us">Contact</MobileNavLink>

          <div className="border-t border-gray-700 pt-4 space-y-3"> {/* Updated border */}
            {isLoggedIn ? (
              <Button
                className="w-full bg-gray-800 hover:bg-gray-700 text-gray-100"
                onClick={() => setIsLoggedIn(false)}
              >
                Log Out
              </Button>
            ) : (
              <>
                <a href="/login" className="block">
                  <Button variant="ghost" className="w-full text-gray-100 hover:text-yellow-400">
                    Sign In
                  </Button>
                </a>
                <a href="/sign-up" className="block">
                  <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900"> {/* Updated button gradient */}
                    Get Started
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </motion.div>
    )}

              <div className="hidden lg:flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-yellow-400 text-sm font-mono tracking-wider">
                System Design in Progress<span className="animate-blink">_</span>
              </p>
            </div>

  </AnimatePresence>
  
  <div className="mt-8">
    <HiRateSlider />
  </div>

   
      </motion.header>

      <main className=" relative z-10 mt-16 md:mt-24 lg:mt-2">
        {/* Hero Section */}
        <motion.section
          className="relative overflow-hidden py-10 lg:py-32"
        >
          <div className="absolute inset-0 bg-grid-gray-900 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div> {/* Updated grid background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-900/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div> {/* Updated blur circles */}
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-yellow-800/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div> {/* Updated blur circles */}
            <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-yellow-700/30 rounded-full filter blur-3xl opacity-50 animate-pulse"></div> {/* Updated blur circles */}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-5xl mx-auto">
              <motion.h1
                className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
<div className="hidden lg:flex md:flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <p className="text-yellow-400 text-sm font-mono tracking-wider">
                                      System Design in Progress<span className="animate-blink">_</span>
                                    </p>
                                  </div>
                <span className="bg-gradient-to-r from-gray-100 via-yellow-400 to-yellow-600 bg-clip-text text-transparent"> {/* Updated text gradient */}
                Welcome to secxion
                </span>

                <br />
                
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Instantly Sell your unused gift cards and other digital assets for Ethereum or cash through online payment.
                Need live build custom digital tools and scripts for your specific needs and tasks?
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                  <Button className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900 rounded-xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"> {/* Updated button gradient */}
                    <a href="/login">Login</a>
                  </Button>
                  <span className="text-gray-400">|</span> {/* Divider color adjusted */}
                <Button className="bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900 rounded-xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 group"> {/* Updated button gradient */}
                  <UserPlus className="mr-2 h-5 w-5" />
                  <a href="/sign-up">Create an Account</a>
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                className="flex flex-wrap justify-center items-center gap-6 text-sm text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-yellow-500" /> {/* Updated icon color */}
                  Bank-Grade Security
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" /> {/* Updated icon color */}
                  Instant Transactions
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-yellow-500" /> {/* Updated icon color */}
                  24/7 Support
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section id="services" className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden"> {/* Updated background */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 right-10 w-24 h-24 border-2 border-yellow-700 transform rotate-45"></div> {/* Updated border color */}
            <div className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-br from-yellow-800 to-yellow-700 rounded-full opacity-50"></div> {/* Updated background */}
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4"> {/* Updated text color */}
                Our Core Services
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto"> {/* Updated text color */}
                We provide secure, fast, and reliable services to help you maximize the value of your digital assets
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard
                icon={<Gift className="h-12 w-12 text-yellow-500" />} 
                title="Gift Card Exchange"
                description="Sell your unused gift cards from major retailers for Ethereum or cash. We offer competitive rates and support 50+ popular gift card brands."
                highlight={true}
              />
              <ServiceCard
                icon={<SiEthereum className="h-12 w-12 text-yellow-500" />} 
                title="Ethereum Trading"
                description="Securely buy, sell, and store Ethereum with our user-friendly platform. Real-time market rates and instant transactions."
              />
              <ServiceCard
                icon={<Smartphone className="h-12 w-12 text-yellow-500" />}
                title="Bank Transfer Payments"
                description="Receive your payments directly to your bank account, get Instant credit on payment request, secure, and reliable transfer services with no limited transactions"
              />
              <ServiceCard
                icon={<Code className="h-12 w-12 text-yellow-500" />} 
                title="Custom Development"
                description="Struggling with off-the-shelf tools or bad scripts? At Secxion, we specialize in crafting custom software solutions designed precisely for your unique needs. Our expert developers in the LiveScript department build robust, reliable tools and scripts, ensuring 100% ownership and full functionality. We understand the frustration of failed tasks, restrictive protocols, and unmet expectations – that's why over 400 users trust Secxion for excellent, dependable results. Create a free Secxion account today and use 'LIVESCRIPT' to submit your custom development request. Let us build the perfect solution to empower your success."
              />
              <ServiceCard
                icon={<Wrench className="h-12 w-12 text-yellow-500" />}
                title="Open Source Tools"
                description="Access and customize powerful open-source tools. We help you integrate and modify existing solutions for your needs."
              />
              
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section className="py-24 bg-gray-950 relative overflow-hidden"> {/* Updated background */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4"> {/* Updated text color */}
                Why Choose Secxion?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto"> {/* Updated text color */}
                Built with security, speed, and user experience at the forefront
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard
                icon={<ShieldCheck className="h-8 w-8 text-yellow-500" />} 
                title="Bank-Level Security"
                description="Your transactions and data are protected with multi-layer encryption, cold storage, and real-time fraud monitoring."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-yellow-500" />} 
                title="Lightning-Fast Processing"
                description="Complete transactions in minutes, not hours. Our optimized system ensures quick verification and instant payouts."
              />
              <FeatureCard
                icon={<Globe className="h-8 w-8 text-yellow-500" />}
                title="Global Accessibility"
                description="Access our services from anywhere in the world. Support for multiple currencies and payment methods."
              />
              <FeatureCard
                icon={<Headphones className="h-8 w-8 text-yellow-500" />} 
                title="24/7 Expert Support"
                description="Our dedicated support team is always available to help with any questions or issues you may encounter."
              />
              <FeatureCard
                icon={<CheckCircle className="h-8 w-8 text-yellow-500" />} 
                title="Transparent Pricing"
                description="No hidden fees or surprise charges. Our transparent pricing structure ensures you know exactly what you'll receive."
              />
              <FeatureCard
                icon={<Shapes className="h-8 w-8 text-yellow-500" />} 
                title="Flexible Solutions"
                description="From gift card exchanges to custom tool development, we adapt our services to meet your specific needs."
              />
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section className="py-24 bg-gradient-to-r from-black via-gray-900 to-gray-800 relative overflow-hidden"> {/* Updated background */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-gray-900/80 to-gray-800/80"></div> {/* Updated background */}
          </div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-6"> {/* Updated text color */}
              Ready to Start Trading?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"> {/* Updated text color */}
              Join thousands of users who trust Secxion for their gift card exchanges and custom development needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 rounded-xl px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200"> {/* Updated button colors */}
                <a href="/sign-up" className="flex items-center">
                  Create Free Account
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 rounded-xl px-8 py-4 text-lg font-semibold"> {/* Updated button colors */}
                <a href="/contact-us">Contact Sales</a>
              </Button>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-600 to-yellow-800 hover:from-yellow-700 hover:to-yellow-900 text-gray-900 p-3 rounded-full shadow-lg z-50" 
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

      <footer className="bg-gray-950 text-gray-400 py-16 relative overflow-hidden">
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 animate-pulse"></div>
  </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
      
      {/* Branding Section */}
      <div className="md:col-span-1">
        <div className="flex items-center space-x-3 mb-6">
          <div className="italic underline text-green-600 text-sm animate-fade-in">signature:</div>
          <div className="relative">
            <h1 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
              SXN
            </h1>
            <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-full"></div>
          </div>
        </div>
        <Link to="/contact-us" className="text-sm text-gray-300 hover:text-yellow-400 transition duration-300">
          Send us a direct message
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
        
        <div>
          <h3 className="font-semibold text-gray-100 mb-4 uppercase tracking-wide">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/about-us" className="hover:text-yellow-400 transition duration-300">About Us</a></li>
            <li><a href="/terms" className="hover:text-yellow-400 transition duration-300">Terms of Service</a></li>
            <li><a href="/privacy" className="hover:text-yellow-400 transition duration-300">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100 mb-4 uppercase tracking-wide">Social</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://t.me/secxion" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">Telegram: @secxion</a></li>
            <li><a href="https://facebook.com/secxion" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">Facebook: @secxion</a></li>
            <li><a href="https://dev.to/secxion" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">Dev: @secxion</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-100 mb-4 uppercase tracking-wide">More</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="https://twitch.tv/secxion" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">Twitch: @secxion</a></li>
            <li><a href="https://x.com/secxion" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">X / Twitter: @secxion</a></li>
            <li><a href="https://instagram.com/secxionapp" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition duration-300">Instagram: @secxionapp</a></li>
          </ul>
        </div>
      </div>
    </div>

    {/* Footer Bottom Line */}
    <div className="border-t border-gray-700 mt-12 pt-6 text-center text-sm">
      <p className="text-gray-500">
        © {new Date().getFullYear()} <span className="text-yellow-500 font-semibold">Secxion</span>. All Rights Reserved. Built with ❤️ by{" "}
        <a
          href="https://bmxii.org"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-yellow-400 hover:underline"
        >
          BMXII.org
        </a>.
      </p>
    </div>
  </div>
</footer>



     {/* Custom Styles */}
      <style jsx>{`
        @keyframes animate-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: animate-scroll 30s linear infinite;
        }
        @keyframes blink {
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </motion.div>
  );
}