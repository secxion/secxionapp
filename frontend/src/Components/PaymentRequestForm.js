import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const PaymentRequestForm = () => {
    const { user } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [selectedBankAccount, setSelectedBankAccount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isLoadingBankAccounts, setIsLoadingBankAccounts] = useState(false);
    const [errorBankAccounts, setErrorBankAccounts] = useState('');
    const [walletBalance, setWalletBalance] = useState(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);
    const [shouldRefreshAccounts, setShouldRefreshAccounts] = useState(false);

    const MIN_REQUEST_AMOUNT = 1000;

    const fetchBankAccounts = useCallback(async () => {
        if (!user?._id && !user?.id) return;

        setIsLoadingBankAccounts(true);
        setErrorBankAccounts('');
        try {
            const response = await fetch(SummaryApi.getBankAccounts.url, {
                method: SummaryApi.getBankAccounts.method,
                credentials: 'include',
            });
            const data = await response.json();
            data.success
                ? setBankAccounts(data.data)
                : setErrorBankAccounts(data.message || 'Failed to fetch bank accounts.');
        } catch {
            setErrorBankAccounts('An unexpected error occurred while fetching bank accounts.');
        } finally {
            setIsLoadingBankAccounts(false);
            setShouldRefreshAccounts(false);
        }
    }, [user]);

    const fetchWalletBalance = useCallback(async () => {
        if (!user?._id && !user?.id) return;

        setIsLoadingBalance(true);
        setError('');
        try {
            const response = await fetch(`${SummaryApi.getWalletBalance.url}/${user._id || user.id}`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            data.success
                ? setWalletBalance(data.balance)
                : setError(data.message || 'Failed to fetch wallet balance.');
        } catch {
            setError('An unexpected error occurred while fetching wallet balance.');
        } finally {
            setIsLoadingBalance(false);
        }
    }, [user]);

    useEffect(() => {
        if (user) {
            fetchBankAccounts();
            fetchWalletBalance();
        }
    }, [user, fetchBankAccounts, fetchWalletBalance]);

    useEffect(() => {
        if (shouldRefreshAccounts) fetchBankAccounts();
    }, [shouldRefreshAccounts, fetchBankAccounts]);

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/[^\d]/g, '');
        const formatted = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setAmount(formatted);
        setError('');
    };

    const handleWithdrawAll = () => {
        if (walletBalance !== null) {
            setAmount(walletBalance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
            setError('');
        }
    };

    const handlePaymentMethodChange = (e) => {
        const selected = e.target.value;
        setPaymentMethod(selected);
        if (selected === 'Ethereum') navigate("/eth");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        const parsedAmount = parseFloat(amount.replace(/,/g, ''));

        if (!parsedAmount || parsedAmount < MIN_REQUEST_AMOUNT) {
            setError(`❌ Minimum request amount is ₦${MIN_REQUEST_AMOUNT.toLocaleString()}`);
            setLoading(false);
            return;
        }

        if (parsedAmount > walletBalance) {
            setError(`❌ Amount exceeds your wallet balance of ₦${walletBalance.toLocaleString()}`);
            setLoading(false);
            return;
        }

        if (!selectedBankAccount) {
            setError('❌ Please select a bank account.');
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
                toast.success(data.message || '✅ Payment request submitted!');
                setSuccessMessage(data.message);
                setAmount('');
                setSelectedBankAccount('');
                fetchWalletBalance();
            } else {
                setError(data.message || '❌ Payment request failed.');
                toast.error(data.message);
            }
        } catch {
            setError('❌ An unexpected error occurred.');
            toast.error('Request failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-20 mx-auto px-4 mt-20 max-w-2xl">
            <div className="bg-white shadow-lg rounded-xl p-6 space-y-8">

                {error && (
                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md border border-red-300">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md border border-green-300">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="amount" className="block font-medium text-gray-700 mb-1">
                            Amount to Withdraw
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₦</span>
                            <input
                                id="amount"
                                type="text"
                                className="w-full pl-10 pr-20 py-2 text-blue-700 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                placeholder="Enter amount"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                            <button
                                type="button"
                                onClick={handleWithdrawAll}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-600 text-sm hover:underline"
                            >
                                All
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="paymentMethod" className="block text-gray-700 font-medium mb-1">
                            Payment Method
                        </label>
                        <select
                            id="paymentMethod"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            className="w-full p-2 border rounded-md bg-gray-100 text-gray-700"
                        >
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Ethereum">Ethereum</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="bankAccount" className="block text-gray-700 font-medium mb-1">
                            Bank Account
                        </label>
                        <select
                            id="bankAccount"
                            value={selectedBankAccount}
                            onChange={(e) => setSelectedBankAccount(e.target.value)}
                            onFocus={() => setShouldRefreshAccounts(true)}
                            className="w-full py-2 px-3 text-blue-700 border rounded-md shadow-sm"
                        >
                            <option value="">Select a bank account</option>
                            {isLoadingBankAccounts ? (
                                <option>Loading...</option>
                            ) : errorBankAccounts ? (
                                <option disabled>{errorBankAccounts}</option>
                            ) : (
                                bankAccounts.map((account) => (
                                    <option key={account._id} value={account._id}>
                                        {account.accountNumber} ({account.bankName}) - {account.accountHolderName}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading || isLoadingBankAccounts}
                            className={`w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 rounded-md shadow-md hover:bg-indigo-700 transition-all ${
                                loading ? 'opacity-60 cursor-not-allowed' : ''
                            }`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0h-2a6 6 0 00-12 0H4z" />
                                </svg>
                            ) : (
                                'Withdraw'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentRequestForm;
