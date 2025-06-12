import { FaWallet, FaHistory, FaUniversity } from 'react-icons/fa';

const WalletFooter = ({ activeTab, setActiveTab }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-md z-40">
            <div className="flex justify-around items-center py-3 px-4">
                <button
                    onClick={() => setActiveTab('wallet')}
                    className={`flex flex-col items-center text-sm ${
                        activeTab === 'wallet' ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-200'
                    } hover:text-indigo-600 focus:outline-none`}
                >
                    <FaWallet className="text-xl mb-1" />
                    Wallet
                </button>
                <button
                    onClick={() => setActiveTab('accounts')}
                    className={`flex flex-col items-center text-sm ${
                        activeTab === 'accounts' ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-200'
                    } hover:text-indigo-600 focus:outline-none`}
                >
                    <FaUniversity className="text-xl mb-1" />
                    Accounts
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex flex-col items-center text-sm ${
                        activeTab === 'history' ? 'text-indigo-600' : 'text-gray-700 dark:text-gray-200'
                    } hover:text-indigo-600 focus:outline-none`}
                >
                    <FaHistory className="text-xl mb-1" />
                    History
                </button>
            </div>
        </footer>
    );
};

export default WalletFooter;