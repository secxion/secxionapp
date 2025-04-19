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
                    <>
                        <div className="fixed w-screen top-0 bottom-0 right-0 left-0 bg-white shadow border border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-800 py-4 mt-28 px-6 border-b border-gray-200 flex items-center">
                                <FaMoneyBill className="mr-2 text-gray-600" /> Request Payment
                            </h3>
                            <div className="p-6">
                                <PaymentRequestForm />
                            </div>
                        </div>
                    </>
                );
            case 'accounts':
                return (
                    <div className="fixed w-screen -mt-10 top-0 bottom-0 right-0 left-0 bg-white shadow border border-gray-200">
                            <h3 className="font-semibold text-lg text-gray-800 pt-9 py-2 mt-24 px-6 border-b border-gray-200 flex items-center">
                            <FaUniversity className="mr-2 text-gray-600" /> Bank Accounts
                        </h3>
                        <div className="overflow-auto " style={{ maxHeight: 'calc(100vh - 300px)' }}> 
                            <BankAccountList />
                        </div>
                    </div>
                );
            case 'history':
                return (
                    <nav className="fixed w-screen right-0 left-0 bg-white shadow border border-gray-200">
                        <h3 className="font-semibold px-4 w-screen text-xl text-gray-800 py-2 border-b border-gray-200 flex items-center">
                            <FaHistory className="mr-2 right-0 left-0 text-gray-600" /> Transaction History
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
                <div className="bg-white overflow-y-auto min-h-screen relative">
                <nav className="h-14 -mt-0 pb-4 bg-gray-50 fixed w-full z-50 border-b border-t border-gray-400 transition-all duration-300 flex items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="w-full mx-auto flex items-center justify-between px-4">
                <h2 className=" mt-3 text-lg font-semibold flex items-center">
                        <FaWallet className="mr-2" /> 
                        <p className='text-sm text-gray-700'>Wallet Dashboard</p>
                    </h2>
                    <Link to={'/profile'} className="text-md font-bold text-gray-600 mt-3 -mr-4">Hi, {user.name}! 👋</Link>
                    <button onClick={toggleSidePanel} className="text-gray-600 focus:outline-none mr-4 mt-3">
                        <FaBars className="h-6 w-6" />
                    </button>
                    </div>
            </nav>

            <SidePanel open={isSidePanelOpen} setOpen={setIsSidePanelOpen} />

            
            <div className={`max-w-7xl mx-auto px-4 py-8 mt-20 transition-all duration-200 ${isSidePanelOpen ? 'ml-80' : ''}`}>
                {renderContent()}
            </div>

            <WalletFooter activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
};

export default WalletDashboard;