import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import { FaSyncAlt, FaEye, FaEyeSlash } from 'react-icons/fa';

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
    const [showBalance, setShowBalance] = useState(true);

    const MIN_REQUEST_AMOUNT = 1000;

    const fetchBankAccounts = useCallback(async () => {
        if (!user?.id && !user?._id) {
            setErrorBankAccounts('User authentication details not found.');
            return;
        }

        setIsLoadingBankAccounts(true);
        setErrorBankAccounts('');
        try {
            const response = await fetch(SummaryApi.getBankAccounts.url, {
                method: SummaryApi.getBankAccounts.method,
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                setBankAccounts(data.data);
            } else {
                setErrorBankAccounts(data.message || 'Failed to fetch bank accounts.');
            }
        } catch (err) {
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
            setErrorBalance('An unexpected error occurred while fetching wallet balance.');
        } finally {
            setIsLoadingBalance(false);
            setLoadingBalance(false);
        }
    }, [user]);

    const handleRefreshBalance = () => {
        setLoadingBalance(true);
        setErrorBalance('');
        fetchWalletBalance().finally(() => setLoadingBalance(false));
    };

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

    const formatAmount = (value) => {
        const num = value.replace(/\D/g, '');
        return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    const handleAmountChange = (e) => {
        const rawValue = e.target.value;
        const numericOnly = rawValue.replace(/,/g, '').replace(/[^\d]/g, '');
        if (!numericOnly) {
            setAmount('');
            return;
        }
        setAmount(formatAmount(numericOnly));
    };

    const handleWithdrawAll = () => {
        if (walletBalance !== null) {
            setAmount(formatAmount(walletBalance.toString()));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const parsedAmount = parseFloat(amount.replace(/,/g, ''));
        if (!parsedAmount || parsedAmount <= 0) {
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
            const response = await fetch(SummaryApi.createPayment.url, {
                method: SummaryApi.createPayment.method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.message || 'Payment request submitted successfully! 🎉');
                setSuccessMessage(data.message);
                setAmount('');
                setSelectedBankAccount('');
                fetchWalletBalance();
            } else {
                toast.error(data.message || 'Failed to submit payment request. 😥');
                setError(data.message);
            }
        } catch (err) {
            setError('An unexpected error occurred while submitting the request. ⚠️');
            toast.error('An unexpected error occurred while submitting the request. 🤕');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10 -mt-12">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            )}

            <div className="fixed w-screen right-0 left-0 top-3 mt-20 bg-indigo-100 p-2 border-b border-gray-400 flex items-center justify-between z-40 px-4">
                <div className="flex items-center gap-3">
                    <p className='text-md font-semibold text-gray-800'>Balance:</p>
                    {isLoadingBalance ? (
                        <svg className="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z" />
                        </svg>
                    ) : errorBalance ? (
                        <p className="text-red-500 text-sm">{errorBalance}</p>
                    ) : (
                        <p className="text-lg font-bold text-indigo-700">
                            {showBalance ? `₦${walletBalance?.toLocaleString()}` : '••••••••'}
                        </p>
                    )}
                </div>
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-indigo-700 hover:text-indigo-900"
                        title={showBalance ? "Hide Balance" : "Show Balance"}
                    >
                        {showBalance ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                        type="button"
                        onClick={handleRefreshBalance}
                        className={`text-indigo-700 hover:text-indigo-900 ${loadingBalance ? 'cursor-not-allowed' : ''}`}
                        disabled={loadingBalance}
                        title="Refresh Balance"
                    >
                        <FaSyncAlt />
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="amount" className="block font-medium text-gray-700">
                    Amount to Withdraw (Minimum ₦{MIN_REQUEST_AMOUNT.toLocaleString()})
                </label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₦</span>
                    <input
                        type="text"
                        id="amount"
                        className="w-full p-3 pl-10 pr-24 mt-1 border rounded-lg bg-gray-50 shadow-sm"
                        placeholder={`${MIN_REQUEST_AMOUNT.toLocaleString()}.00`}
                        value={amount}
                        onChange={handleAmountChange}
                        required
                    />
                    <button
                        type="button"
                        onClick={handleWithdrawAll}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-indigo-600 font-semibold hover:underline text-sm"
                    >
                        All
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="paymentMethod" className="block font-medium text-gray-700">    
                    Payment Method
                </label>
                <select
                    id="paymentMethod"
                    value={paymentMethod}
                    className="p-3 border rounded-lg bg-gray-50 text-gray-800 font-semibold"
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
                    value={selectedBankAccount}
                    onChange={(e) => setSelectedBankAccount(e.target.value)}
                    onFocus={handleBankAccountFocus}
                    className="mt-1 block w-full py-2 px-3 border bg-white rounded-md shadow-sm"
                    required
                >
                    <option value="">Select a bank account 🏦</option>
                    {isLoadingBankAccounts ? (
                        <option disabled>Loading accounts...</option>
                    ) : errorBankAccounts ? (
                        <option disabled>{errorBankAccounts}</option>
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
                    className={`inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={loading || bankAccounts.length === 0 || isLoadingBankAccounts}
                >
                    {loading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z" />
                        </svg>
                    ) : (
                        'Submit Request'
                    )}
                </button>
            </div>
        </form>
    );
};

export default PaymentRequestForm;
