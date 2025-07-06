import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Info, FileText, Mail, User, UserPlus, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LogoShimmer from './LogoShimmer';

const Navigation = ({ currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Define all navigation items
  const allNavItems = [
    { id: 'home', name: '/', href: '/', icon: Home },
    { id: 'about', name: 'About Us', href: '/about-us', icon: Info },
    { id: 'privacy', name: 'Privacy', href: '/privacy', icon: Shield },
    { id: 'terms', name: 'Terms', href: '/terms', icon: FileText },
    { id: 'contact', name: 'Contact', href: '/contact-us', icon: Mail },
    { id: 'signin', name: 'Sign In', href: '/login', icon: User },
    { id: 'dashboard', name: 'Create Account', href: '/sign-up', icon: UserPlus }
  ];

  // Filter out the current page from navigation items
  const navItems = allNavItems.filter(item => item.id !== currentPage);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center">
            <a href="/" className="relative">
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
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
            
            </a>
          </div>
            {/* <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secxion
            </span> */}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link
                      key={item.id}
                      to={item.href}
                      onClick={closeMenu}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navigation;