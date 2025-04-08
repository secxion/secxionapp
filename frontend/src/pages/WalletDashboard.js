import React, { useContext, useEffect, useState } from 'react';
import Context from '../Context';
import PaymentRequestForm from '../Components/PaymentRequestForm';
import BankAccountList from '../Components/BankAccountList';
import { useSelector } from 'react-redux';
import TransactionHistory from '../Components/TransactionHistory';
import { FaWallet, FaSyncAlt, FaHistory, FaUniversity, FaMoneyBill } from 'react-icons/fa'; 

const WalletDashboard = () => {
    const { walletBalance, fetchWalletBalance } = useContext(Context);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [errorBalance, setErrorBalance] = useState('');
    const { user } = useSelector((state) => state.user);

    const handleRefreshBalance = () => {
        setLoadingBalance(true);
        setErrorBalance('');
        fetchWalletBalance()
            .catch((error) => setErrorBalance("Failed to fetch balance. 😥"))
            .finally(() => setLoadingBalance(false));
    };

    useEffect(() => {
        if (fetchWalletBalance) {
            handleRefreshBalance();
        } else {
            console.warn("fetchWalletBalance is undefined!");
        }
    }, [fetchWalletBalance]);

    return (
        <div className="min-h-screen min-w-screen mt-10 bg-gradient-to-br from-gray-200 to-gray-300 py-6 sm:py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="bg-indigo-600 text-white py-5 px-6 sm:px-10">
                        <h2 className="text-2xl font-semibold flex items-center">
                            <FaWallet className="mr-3" /> Wallet Dashboard
                        </h2>
                        <p className="mt-1 text-md opacity-80">Welcome back, {user.name}! 👋</p>
                    </div>

                    <div className="p-6 sm:p-10">
                        <div className="bg-indigo-100 rounded-md p-5 mb-6 border border-indigo-200 flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-lg text-indigo-700 flex items-center">
                                    <FaWallet className="mr-2" /> Current Balance
                                </h3>
                                {loadingBalance ? (
                                    <p className="text-xl font-bold text-gray-600 mt-2">
                                        <svg className="w-6 h-6 animate-spin inline-block mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
                                        </svg>
                                    </p>
                                ) : errorBalance ? (
                                    <p className="text-red-500 mt-2">{errorBalance}</p>
                                ) : (
                                    <p className="text-3xl font-bold text-indigo-700 mt-2">
                                        {walletBalance && walletBalance.balance !== undefined
                                            ? `₦${walletBalance.balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                            : "₦0.00"}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={handleRefreshBalance}
                                className={`inline-flex items-center px-4 py-2 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loadingBalance ? 'cursor-not-allowed' : ''}`}
                                disabled={loadingBalance}
                            >
                                <FaSyncAlt className="mr-2" /> Refresh
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white shadow rounded-md p-6 border border-gray-200">
                                <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
                                    <FaHistory className="mr-2 text-gray-600" /> Transaction History
                                </h3>
                                <TransactionHistory />
                            </div>

                            <div className="bg-white shadow rounded-md p-6 border border-gray-200">
                                <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
                                    <FaUniversity className="mr-2 text-gray-600" /> Bank Accounts
                                </h3>
                                <BankAccountList />
                            </div>
                        </div>

                        <div className="bg-white shadow rounded-md p-6 mt-8 border border-gray-200">
                            <h3 className="font-semibold text-xl text-gray-800 mb-4 flex items-center">
                                <FaMoneyBill className="mr-2 text-gray-600" /> Request Payment
                            </h3>
                            <PaymentRequestForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletDashboard;