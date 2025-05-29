import { FaUser, FaWallet } from 'react-icons/fa';

import { Link } from 'react-router-dom';

const HomeFooter = () => {

    return (
        <footer className="fixed bottom-0 left-0 right-0 shadow-md z-40 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
            <div className="flex justify-around items-center px-4 py-2">
                <button
                    className="minecraft-font flex flex-col items-center text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                >
                  
                </button>

                <Link
                    to="/profile"
                    className="minecraft-font flex flex-col items-center text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                    aria-label="View Profile"
                >
                    <FaUser className="text-xl mb-1" />
                    Profile
                </Link>

                <Link
                    to="/mywallet"
                    className="minecraft-font flex flex-col items-center text-sm text-gray-800 dark:text-gray-200 hover:text-blue-500 focus:outline-none"
                    aria-label="View Wallet"
                >
                    <FaWallet className="text-xl mb-1" />
                    Wallet
                </Link>
            </div>
        </footer>
    );
};

export default HomeFooter;
