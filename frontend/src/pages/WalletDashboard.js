import { useState, useEffect, useCallback } from 'react';
import PaymentRequestForm from '../Components/PaymentRequestForm';
import BankAccountList from '../Components/BankAccountList';
import { useSelector } from 'react-redux';
import TransactionHistory from '../Components/TransactionHistory';
import WalletFooter from '../Components/WalletFooter';
import { FaWallet, FaHistory, FaUniversity, FaBars, FaSyncAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import SidePanel from '../Components/SidePanel';
import SummaryApi from '../common';

const WalletDashboard = () => {
    const { user } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('wallet');
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
    const [walletBalance, setWalletBalance] = useState(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [errorBalance, setErrorBalance] = useState('');
    const [showBalance, setShowBalance] = useState(false);

    const toggleSidePanel = () => {
        setIsSidePanelOpen(!isSidePanelOpen);
    };

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
            data.success ? setWalletBalance(data.balance) : setErrorBalance(data.message || 'Failed to fetch wallet balance.');
        } catch (err) {
            setErrorBalance('An unexpected error occurred while fetching wallet balance.');
            console.error("Error fetching wallet balance:", err);
        } finally {
            setIsLoadingBalance(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchWalletBalance();
        }
    }, [user, fetchWalletBalance]);

    const renderContent = () => {
        switch (activeTab) {
            case 'wallet':
                return (
                    <div className="fixed w-screen top-0 bottom-0 right-0 left-0 bg-white shadow border border-gray-200">
                        <div className="p-6">
                            <PaymentRequestForm fetchWalletBalance={fetchWalletBalance} walletBalance={walletBalance} />
                        </div>
                    </div>
                );
            case 'accounts':
                return (
                    <div className="w-full -mt-10">
                        <h3 className="font-semibold text-lg text-gray-800 py-1 px-6 border-b border-gray-200 flex items-center justify-center">
                            <FaUniversity className="flex mr-2 text-gray-600" /> Bank Accounts
                        </h3>
                        <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                            <BankAccountList />
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <nav className="fixed w-screen right-0 left-0 bg-white shadow border border-gray-200">
                        <h3 className="font-semibold px-4 w-screen text-xl text-gray-800 py-4 mt-6 border-b border-gray-200 flex items-center">
                            <FaHistory className="mr-2 right-0 left-0 text-gray-600 " /> Transaction History
                        </h3>
                        <div className="overflow-auto w-screen p-2 px-6 right-0 left-0" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                            <TransactionHistory />
                        </div>
                    </nav>
                );
            default:
                return null;
        }
    };
    return (
        <div className="flex flex-col bg-white mt-10 sm:mt-10 md:mt-10 ">
          <header className="fixed mt-8 left-0 top-0 w-full bg-white shadow-md border-b border-gray-200 p-4 z-40">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h2 className="text-sm font-semibold flex items-center">
            <FaWallet className="mr-2 text-blue-500" />
            <span className="text-gray-800">Balance:</span>
            <span className="ml-2 font-bold text-green-700">
              {isLoadingBalance ? (
                <svg
                  className="w-5 h-5 animate-spin text-indigo-500"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"
                  />
                </svg>
              ) : errorBalance ? (
                <span className="text-red-500 text-sm ml-2">{errorBalance}</span>
              ) : (
                <span>
                  {showBalance ? `₦${walletBalance?.toLocaleString()}` : '••••••••'}
                </span>
              )}
            </span>
          </h2>

          <div className="flex items-center gap-2 px-2">
            <button
              onClick={() => setShowBalance(!showBalance)}
              title={showBalance ? 'Hide balance' : 'Show balance'}
              className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition"
            >
              {showBalance ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>

            <button
              onClick={fetchWalletBalance}
              title="Refresh balance"
              className="p-2 rounded-md bg-indigo-100 hover:bg-indigo-200 text-indigo-600 transition"
            >
              <FaSyncAlt size={18} />
            </button>

            <button
              onClick={toggleSidePanel}
              className="md:hidden ml-1 text-gray-600 hover:text-blue-500 transition"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

            <SidePanel open={isSidePanelOpen} setOpen={setIsSidePanelOpen} />

            <main className={`flex-grow pt-20 transition-all duration-300 ${isSidePanelOpen ? 'ml-80' : ''}`}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                    {renderContent()}
                </div>
            </main>

            <WalletFooter activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default WalletDashboard;