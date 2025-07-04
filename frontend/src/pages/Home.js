import React, { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Wallet, 
  User, 
  Store, 
  Book, 
  ClipboardList, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  MessageCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from "lucide-react";
import SummaryApi from '../common';
import giftCardImages from "../helper/heroimages";
import HomeFooter from "../Components/HomeFooter";
import NetBlog from "../Components/NetBlog";

const menuItems = [
  {
    label: "Market",
    path: "/section",
    color: "bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200",
    icon: <Store className="w-10 h-10 text-blue-600" />,
    description: "Explore marketplace"
  },
  {
    label: "Transaction Record",
    path: "/record",
    color: "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200",
    icon: <ClipboardList className="w-10 h-10 text-green-600" />,
    description: "View transaction history"
  },
  {
    label: "Wallet",
    path: "/mywallet",
    color: "bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200",
    icon: <Wallet className="w-10 h-10 text-purple-600" />,
    description: "Manage your assets"
  },
  {
    label: "Profile",
    path: "/profile",
    color: "bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200",
    icon: <User className="w-10 h-10 text-orange-600" />,
    description: "Account settings"
  },
  {
    label: "Data Pad",
    path: "/datapad",
    color: "bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200",
    icon: <Book className="w-10 h-10 text-teal-600" />,
    description: "Access your data"
  },
  {
    label: "Contact Support",
    path: "/report",
    color: "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200",
    icon: <MessageCircle className="w-10 h-10 text-red-600" />,
    description: "Get help and support"
  },
];

const Home = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const menuSectionRef = useRef(null);
  
  // Hero carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [heroImages, setHeroImages] = useState([]);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Wallet balance state
  const [walletBalance, setWalletBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [errorBalance, setErrorBalance] = useState('');
  const [showBalance, setShowBalance] = useState(true);
  
  // Ethereum balance state (from context or similar)
  const [ethBalance, setEthBalance] = useState(0);
  const [ethRate, setEthRate] = useState(0);
  
  // Transaction history state
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [errorTransactions, setErrorTransactions] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [visibleTransactions, setVisibleTransactions] = useState(3);
  const [showAll, setShowAll] = useState(false);
  
  // Refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

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

  

  // Navigation handler
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Wallet balance API
  const fetchWalletBalance = useCallback(async () => {
    if (!user?.id && !user?._id) return;

    setIsLoadingBalance(true);
    setErrorBalance('');
    try {
      const response = await fetch(`${SummaryApi.getWalletBalance.url}/${user._id || user.id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();
      if (data.success) {
        setWalletBalance(data.balance || 0);
      } else {
        setErrorBalance(data.message || 'Failed to fetch wallet balance.');
      }
    } catch (err) {
      setErrorBalance('An unexpected error occurred while fetching wallet balance.');
      console.error("Error fetching wallet balance:", err);
    } finally {
      setIsLoadingBalance(false);
    }
  }, [user]);

  // Transaction history API
  const fetchTransactions = useCallback(async (currentStatusFilter) => {
    if (!user?.id && !user?._id) {
      console.warn('User not found in Redux. Cannot fetch transactions.');
      setErrorTransactions('User authentication details not found.');
      return;
    }

    setLoadingTransactions(true);
    setErrorTransactions('');
    try {
      let url = `${SummaryApi.transactions.url}`;
      const userId = user?.id || user?._id;
      url += `?userId=${userId}`;

      if (currentStatusFilter && currentStatusFilter !== 'all') {
        url += `&status=${currentStatusFilter}`;
      }

      console.log('Fetching transactions from:', url);
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Transactions data:', data);
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      } else {
        setErrorTransactions(data.message || 'Failed to fetch transactions.');
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setErrorTransactions('An unexpected error occurred while fetching transactions.');
    } finally {
      setLoadingTransactions(false);
    }
  }, [user]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    setLastUpdated(null);
    
    try {
      await Promise.all([
        fetchWalletBalance(),
        fetchTransactions(statusFilter)
      ]);
      setLastUpdated(new Date().toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchWalletBalance, fetchTransactions, statusFilter]);

  // Initialize data on component mount
  useEffect(() => {
    if (user) {
      fetchWalletBalance();
      fetchTransactions(statusFilter);
    }
  }, [user, fetchWalletBalance, fetchTransactions, statusFilter]);


  // Calculate portfolio stats
  const portfolioValue = walletBalance + (ethBalance * ethRate);
  const portfolioGrowth = portfolioValue > 0 ? ((portfolioValue - walletBalance) / walletBalance * 100).toFixed(1) : 0;
  const recentTransactionCount = transactions.filter(t => {
    const transactionDate = new Date(t.createdAt || t.timestamp);
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return transactionDate >= dayAgo;
  }).length;

  // Update quick stats with real data
  const quickStats = [
    { 
      label: "Portfolio Value", 
      value: `₦${portfolioValue.toLocaleString()}`, 
      change: portfolioGrowth > 0 ? `+${portfolioGrowth}%` : `${portfolioGrowth}%`, 
      positive: portfolioGrowth >= 0 
    },
    
    { 
      label: "Recent Transactions", 
      value: recentTransactionCount.toString(), 
      change: `${transactions.length} total`, 
      positive: recentTransactionCount > 0 
    },
  ];

  const formatTransactionStatus = (status) => {
    const statusMap = {
      'pending': 'Pending',
      'approved-processing': 'Processing',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'approved-processing': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };


  const filteredMenuItems = menuItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedTransactions = showAll ? transactions : transactions.slice(0, visibleTransactions);

  const handleViewMore = () => {
    setShowAll(true);
    setVisibleTransactions(transactions.length);
  };

  const handleCloseViewMore = () => {
    setShowAll(false);
    setVisibleTransactions(3);
  };


  return (
    <div className="relative bg-white shadow-sm border-b border-gray-200 top-0 z-10 w-full px-4 py-10 space-y-12">
        {/* Hero Section */}
       <header
          className="relative w-full h-[65vh] min-h-[320px] mt-16 bg-cover bg-center flex items-center justify-center shadow-xl rounded-3xl overflow-hidden"
          style={{ backgroundImage: `url(${currentImage.url})` }}
        >
          <div className="absolute inset-0" />
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.div
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link to="/section" className="inline-block bg-yellow-500 text-white border-2 border-yellow-600 px-6 py-3 uppercase font-semibold text-sm rounded-full shadow-lg hover:bg-yellow-600 transition duration-200">
                Market
              </Link>
            </motion.div>
          </div>
        </header>

      {/* Quick Stats */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Overview</h2>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-1">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="p-2 text-gray-400 hover:text-gray-600"
                title={showBalance ? "Hide Balance" : "Show Balance"}
              >
                {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
              <button
                onClick={refreshAllData}
                disabled={isRefreshing}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                title="Refresh Data"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          
          {errorBalance && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errorBalance}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {showBalance ? stat.value : "••••••"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center ${
                      stat.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {stat.positive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {stat.change}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Grid */}
      <section ref={menuSectionRef} className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Access
            </h2>
            <p className="text-lg text-gray-600">
              Navigate to your features
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMenuItems.map((item, index) => (
              <div
                key={index}
                className={`${item.color} rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group`}
                onClick={() => handleNavigation(item.path)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {item.label}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Recent Activity
              </h2>
              <p className="text-lg text-gray-600">
                Your latest transactions and activities
              </p>
            </div>
            <button 
              onClick={() => handleNavigation('/record')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View All Trade Status→
            </button>
          </div>
          
          {loadingTransactions ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          ) : errorTransactions ? (
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <p className="text-red-700">Error loading transactions: {errorTransactions}</p>
              <button 
                onClick={() => fetchTransactions(statusFilter)}
                className="mt-2 text-red-600 hover:text-red-800 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : transactions.length === 0 ? (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">No transactions found</p>
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                {displayedTransactions.map((transaction, index) => (
                  <div key={transaction._id || index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wallet className="text-blue-600 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {transaction.type || 'Transaction'} #{transaction._id?.slice(-8) || 'N/A'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Unknown date'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        transaction.type === 'credit' || transaction.amount > 0 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {transaction.type === 'credit' || transaction.amount > 0 ? '+' : '-'}
                        ₦{Math.abs(transaction.amount || 0).toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                        {formatTransactionStatus(transaction.status || 'pending')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {transactions.length > 3 && (
                <div className="mt-4 text-center">
                  {!showAll ? (
                    <button
                      onClick={handleViewMore}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View More ({transactions.length - visibleTransactions} more)
                    </button>
                  ) : (
                    <button
                      onClick={handleCloseViewMore}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Show Less
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <NetBlog />
        </div>
      </section>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};

export default Home;