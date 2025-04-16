import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaSyncAlt } from 'react-icons/fa';

const PaymentRequestForm = () => {
    const { user } = useSelector((state) => state.user);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [selectedBankAccount, setSelectedBankAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [SuccessMessage, setSuccessMessage] = useState('');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
    const [errorBankAccounts, setErrorBankAccounts] = useState('');
    const [walletBalance, setWalletBalance] = useState(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [errorBalance, setErrorBalance] = useState('');
    const [shouldRefreshAccounts, setShouldRefreshAccounts] = useState(false);



    const handleRefreshBalance = () => {
        setLoadingBalance(true);
        setErrorBalance('');
        fetchWalletBalance()
            .catch((error) => setErrorBalance("Failed to fetch balance. 😥"))
            .finally(() => setLoadingBalance(false));
    };


    const MIN_REQUEST_AMOUNT = 1000;

    const fetchBankAccounts = useCallback(async () => {
        if (!user?.id && !user?._id) {
            console.warn('User not found. Cannot fetch bank accounts.');
            setErrorBankAccounts('User authentication details not found.');
            return;
        }

        setIsLoadingBankAccounts(true);
        setErrorBankAccounts('');
        try {
            const response = await fetch(
                SummaryApi.getBankAccounts.url,
                {
                    method: SummaryApi.getBankAccounts.method,
                    credentials: 'include',
                }
            );
            const data = await response.json();
            if (data.success) {
                setBankAccounts(data.data);
            } else {
                setErrorBankAccounts(data.message || 'Failed to fetch bank accounts.');
            }
        } catch (err) {
            console.error('Error fetching bank accounts:', err);
            setErrorBankAccounts('An unexpected error occurred while fetching bank accounts.');
        } finally {
            setIsLoadingBankAccounts(false);
            setShouldRefreshAccounts(false);
        }
    }, [user]);

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
                setWalletBalance(data.balance);
            } else {
                setErrorBalance(data.message || 'Failed to fetch wallet balance.');
            }
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
            setErrorBalance('An unexpected error occurred while fetching wallet balance.');
        } finally {
            setIsLoadingBalance(false);
        }
    }, [user]);

    useEffect(() => {
        if (fetchWalletBalance) {
            handleRefreshBalance();
        } else {
            console.warn("fetchWalletBalance is undefined!");
        }
    }, [fetchWalletBalance]);

    useEffect(() => {
        if (user) {
            fetchBankAccounts();
            fetchWalletBalance();
        }
    }, [user, fetchBankAccounts, fetchWalletBalance]);

    useEffect(() => {
        if (shouldRefreshAccounts) {
            fetchBankAccounts();
        }
    }, [shouldRefreshAccounts, fetchBankAccounts]);

    const handleBankAccountFocus = () => {
        setShouldRefreshAccounts(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const parsedAmount = parseFloat(amount);

        if (!amount || parsedAmount <= 0) {
            setError('Please enter a valid amount. 💰');
            setLoading(false);
            return;
        }

        if (parsedAmount < MIN_REQUEST_AMOUNT) {
            setError(`Minimum request amount is ₦${MIN_REQUEST_AMOUNT.toLocaleString()}. 🚫`);
            setLoading(false);
            return;
        }

        if (walletBalance !== null && parsedAmount > walletBalance) {
            setError(`Amount exceeds your current wallet balance of ₦${walletBalance.toLocaleString()}. 😥`);
            setLoading(false);
            return;
        }

        if (!selectedBankAccount) {
            setError('Please select a bank account. 🏦');
            setLoading(false);
            return;
        }

        const payload = {
            amount: parsedAmount,
            paymentMethod,
            bankAccountId: selectedBankAccount,
        };

        try {
            const response = await fetch(
                SummaryApi.createPayment.url,
                {
                    method: SummaryApi.createPayment.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (data.success) {
                setSuccessMessage(data.message || 'Payment request submitted successfully! ✅');
                toast.success(data.message || 'Payment request submitted successfully! 🎉'); 
                setAmount('');
                setSelectedBankAccount('');
                fetchWalletBalance();
            } else {
                setError(data.message || 'Failed to submit payment request. ❌');
                toast.error(data.message || 'Failed to submit payment request. 😥'); 
            }
        } catch (err) {
            console.error('Error submitting payment request:', err);
            setError('An unexpected error occurred while submitting the request. ⚠️');
            toast.error('An unexpected error occurred while submitting the request. 🤕'); 
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 -mt-12">
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline">{error}</span>
            </div>}            
            <div className="fixed w-screen right-0 left-0 top-0 mt-14 bg-indigo-100 p-2 border-b border-gray-400 flex items-center justify-between z-40">
            <p className='text-md pt-3 text-gray-800 font-bold'>Balance: </p>
            {isLoadingBalance && loadingBalance ? (              
                                <>
                    <p className="text-sm font-bold text-gray-600">
                    <svg className="w-6 h-6 animate-spin inline-block mr-2 mt-3 text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
                        </svg>
                </p></>
              
            ) : errorBalance ? (
                <p className="text-red-500 mt-2">{errorBalance}</p>
            ) : walletBalance !== null && (
                <p className="text-lg font-bold text-indigo-700 mt-0 pt-3">
                                                   
                    ₦{walletBalance.toLocaleString()}
                                                 
                </p>
                
            )}
            <button
                 onClick={handleRefreshBalance}
                        className={`items-center pt-3 text-md font-medium text-indigo-700 ${loadingBalance ? 'cursor-not-allowed' : ''}`}
                                                    disabled={loadingBalance}
                                                >
                                                    <FaSyncAlt className="mr-2" />
                                                </button>
                                                </div>                               
              
             <div>      
                <label htmlFor="amount" 
                className="block font-medium text-gray-700 mt-4">
                    Amount to Withdraw (Minimum ₦{MIN_REQUEST_AMOUNT.toLocaleString()})
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₦</span>
                    </div>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        className='w-full p-3 pl-10 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 shadow-sm'
                        placeholder={`${MIN_REQUEST_AMOUNT.toLocaleString()}.00`}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className='mt-4'>
                <label htmlFor="paymentMethod" 
                className="block font-medium text-gray-700 mt-4">
                    Payment Method
                </label>
                <select
                    id="paymentMethod"
                    name="paymentMethod"
                    className='p-3 border rounded-lg bg-gray-50 text-gray-800 font-semibold'
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                >
                    <option>Bank Transfer</option>
                </select>
            </div>
            <div>
                <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">
                    Select Bank Account
                </label>
                <select
                    id="bankAccount"
                    name="bankAccount"
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                    onFocus={handleBankAccountFocus}
                    required
                >
                    <option value="">Select a bank account 🏦</option>
                    {isLoadingBankAccounts ? (
                        <option disabled>
                            <svg className="w-6 h-6 animate-spin inline-block mr-2 text-gray-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
                            </svg>
                            Loading accounts...
                        </option>
                    ) : errorBankAccounts ? (
                        <option disabled className="text-red-500">{errorBankAccounts}</option>
                    ) : bankAccounts.length > 0 ? (
                        bankAccounts.map((account) => (
                            <option key={account._id} value={account._id}>
                                {account.accountNumber} ({account.bankName}) - {account.accountHolderName}
                            </option>
                        ))
                    ) : (
                        <option disabled>No bank accounts added yet. ➕</option>
                    )}
                </select>
            </div>
            <div>
                <button
                    type="submit"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading || bankAccounts.length === 0 || isLoadingBankAccounts}
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z"></path>
                        </svg>
                    ) : (
                        'Request Payment'
                    )}
                </button>
    
          
            </div>
        </form>
    );
};

export default PaymentRequestForm;