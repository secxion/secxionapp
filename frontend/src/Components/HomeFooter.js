import { FaEthereum, FaCaretUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; 

const HomeFooter = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

 const { user } = useSelector((state) => state.user);
                            const { profilePic} = user || {};
                        
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-md w-full py-2 border-2 border-black">
      <div className="flex justify-around items-center text-gray-700 dark:text-gray-300 text-xl">

        <Link
          to="/profile"
          className="flex flex-col bg-transparent items-center hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-colors duration-300 ease-in-out border-4 border-yellow-500 rounded-lg p-2"
          aria-label="Profile"
        >
          <div className="relative">
           
                        <img
                            src={profilePic}
                            alt="Profile"
                            className="w-8 h-8 md:w-8 rounded-full md:h-8 lg:w-8 lg:h-8 object-cover" // Added bold yellow border
                        />
            <FaCaretUp className="absolute -top-2 -right-2 text-yellow-500 text-sm" />
          </div>
        </Link>

        {/* Naira Wallet */}
        <Link
          to="/mywallet"
          className="flex flex-col items-center hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-300 ease-in-out border-4 border-yellow-500 rounded-lg p-2"
          aria-label="Naira Wallet"
        >
          <span className="text-lg mb-0.5 glossy-icon-text">₦</span>
        </Link>

        {/* Ethereum */}
        <Link
          to="/eth"
          className="flex flex-col items-center hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition-colors duration-300 ease-in-out border-4 border-yellow-500 rounded-lg p-2"
          aria-label="Ethereum"
        >
          <FaEthereum className="mb-0.5 glossy-icon-text" />
        </Link>
        
      </div>
    </footer>
  );
};

export default HomeFooter;
