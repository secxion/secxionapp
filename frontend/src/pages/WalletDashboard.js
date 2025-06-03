import React, { useState } from 'react';
import PaymentRequestForm from '../Components/PaymentRequestForm';
import BankAccountList from '../Components/BankAccountList';
import { useSelector } from 'react-redux';
import TransactionHistory from '../Components/TransactionHistory';
import { Link } from "react-router-dom";
import WalletFooter from '../Components/WalletFooter';
import { FaWallet, FaHistory, FaUniversity, FaMoneyBill, FaBars } from 'react-icons/fa';
import SidePanel from '../Components/SidePanel';


const WalletDashboard = () => {
    const { user } = useSelector((state) => state.user);
    const [activeTab, setActiveTab] = useState('wallet');
    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); 

    const toggleSidePanel = () => {
        setIsSidePanelOpen(!isSidePanelOpen);
    };

    const handleCloseSidePanel = () => {
        setIsSidePanelOpen(false);
    };

    const handleNavigation = (tab) => {
        setActiveTab(tab);
        handleCloseSidePanel();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'wallet':
                return (
                    <div className="fixed w-screen top-0 bottom-0 right-0 left-0 bg-white shadow border border-gray-200">
                            <div className="p-6">
                                <PaymentRequestForm />
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
            <header className="fixed left-0 w-full bg-white shadow-md border-b border-gray-200 z-50">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <h2 className="text-sm font-semibold flex items-center">
                        <FaWallet className="mr-2 text-blue-500" />
                        <span className="text-gray-800">Wallet</span>
                    </h2>
                    <Link to="/" className="hidden minecraft-font text-[14px] md:flex items-center font-extrabold text-transparent text-2xl bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mr-4 tracking-wide">
                        SXN
                    </Link>
                        <Link to={'/profile'} className="mr-4 text-gray-700 hover:text-blue-500 transition-colors">
                    Hi, {user.name}! 👋</Link>
                        <button onClick={toggleSidePanel} className="md:hidden">
                            <FaBars className="text-gray-600 hover:text-blue-500 transition-colors" />
                    </button>
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