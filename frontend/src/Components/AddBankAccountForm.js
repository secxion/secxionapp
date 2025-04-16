import React, { useState } from 'react';
import SummaryApi from '../common';
import { FaUniversity, FaTimesCircle, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const AddBankAccountForm = ({ onAccountAdded, onCancel, userId }) => {
    const [accountNumber, setAccountNumber] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountHolderName, setAccountHolderName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (!userId) {
            setError('User ID is missing. Please ensure you are logged in.');
            setLoading(false);
            return;
        }

        const payload = {
            accountNumber,
            bankName,
            accountHolderName,
        };

        try {
            const response = await fetch(
                SummaryApi.addBankAccount.url,
                {
                    method: SummaryApi.addBankAccount.method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                }
            );
            const data = await response.json();
            if (data.success) {
                setSuccessMessage(data.message || 'Bank account added successfully!');
                setAccountNumber('');
                setBankName('');
                setAccountHolderName('');
                onAccountAdded();
            } else {
                setError(data.message || 'Failed to add bank account.');
            }
        } catch (err) {
            console.error('Error adding bank account:', err);
            setError('An unexpected error occurred while adding the bank account.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow rounded-md p-6 space-y-16">
            <h3 className="font-semibold text-xl text-gray-800 -mt-4 flex items-center">
                <FaUniversity className="mr-2 text-gray-600" /> Add New Bank Account
            </h3>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-2" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-3" role="alert">
                    <strong className="font-bold">Success!</strong>
                    <span className="block sm:inline">{successMessage}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-2">
                <div>
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                        Account Number
                    </label>
                    <input
                        type="text"
                        id="accountNumber"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                        Bank Name
                    </label>
                    <input
                        type="text"
                        id="bankName"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={bankName}
                        onChange={(e) => setBankName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                        Account Holder Name
                    </label>
                    <input
                        type="text"
                        id="accountHolderName"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={accountHolderName}
                        onChange={(e) => setAccountHolderName(e.target.value)}
                        required
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        <FaTimesCircle className="mr-2" /> Cancel
                    </button>
                     <button
            type="submit"
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={loading}
          >
            {loading ? (
                <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            ) : (
              <><FaCheckCircle className="mr-2" /><span>Add Account</span></>
            )}
          </button>
                </div>
            </form>
        </div>
    );
};

export default AddBankAccountForm;