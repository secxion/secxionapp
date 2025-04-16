import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserUploadMarket from './UserUploadMarket';
import SummaryApi from '../common';
import { FaArrowLeft, FaBars } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CurrencySelector from './CurrencySelector';
import FaceValueTable from './FaceValueTable';
import GetInTouchFooter from './GetInTouchFooter';
import SidePanel from './SidePanel';

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: '',
    brandName: '',
    category: '',
    productImage: [],
    description: '',
    pricing: [],
  });
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState(null);
  const [selectedFaceValue, setSelectedFaceValue] = useState(null);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false); 

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(SummaryApi.productDetails.url, {
          method: SummaryApi.productDetails.method,
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ productId: id }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.message || 'Failed to fetch product details');
        }
        const dataResponse = await response.json();
        setData(dataResponse?.data);
        setActiveCurrency(dataResponse?.data?.pricing?.[0] || null);
      } catch (err) {
        console.error('⚠️ Error fetching product details:', err);
        setError(err.message);
        toast.error(`⚠️ ${err.message}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleCurrencyChange = (currency) => {
    const selectedCurrency = data.pricing.find(
      (item) => item.currency === currency
    );
    setActiveCurrency(selectedCurrency);
    setSelectedFaceValue(null);
  };

  const handleSell = (faceValue) => {
    setSelectedFaceValue(faceValue);
    setShowUploadForm(true);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const toggleSidePanel = () => {
    setIsSidePanelOpen(!isSidePanelOpen);
  };

  const handleLogout = () => {
    console.log('Logout function called');
  };

  return (
    <div className="mt-11 flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
      <div className="flex items-center justify-between p-2">
      <button
            onClick={handleGoBack}
            className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FaArrowLeft className="inline-block mr-2" /> Back
          </button>
          <h1 className="text-lg font-semibold">{data.productName}</h1>
          <button
            onClick={toggleSidePanel}
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
          >
            <FaBars className="h-5 w-5" />
          </button>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700">
          <CurrencySelector
            pricing={data?.pricing}
            activeCurrency={activeCurrency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>
      </header>

      <main className="mt-[140px] mb-[60px] flex-1 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-900">
        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center gap-4">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-10 rounded-full w-3/4"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 rounded-full w-1/2"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 rounded-full w-1/3"></div>
          </div>
        ) : error ? (
          <div className="py-10 text-center">
            <p className="text-red-500 font-semibold mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Retry
            </button>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <FaceValueTable activeCurrency={activeCurrency} onSell={handleSell} />
            {activeCurrency && activeCurrency?.faceValues?.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 p-4 text-center">
                No face values available for the selected currency.
              </p>
            )}
          </div>
        )}
      </main>

      <GetInTouchFooter />

      {showUploadForm && selectedFaceValue && activeCurrency && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <UserUploadMarket
            onClose={() => setShowUploadForm(false)}
            fetchData={() => setShowUploadForm(false)}
            productDetails={{
              productName: data.productName,
              productImage: data.productImage[0],
              currency: activeCurrency.currency,
              rate: selectedFaceValue.sellingPrice,
              faceValue: selectedFaceValue.faceValue,
              description: selectedFaceValue.description,
            }}
          />
        </div>
      )}

      <SidePanel open={isSidePanelOpen} setOpen={setIsSidePanelOpen} handleLogout={handleLogout} loading={loading} />
    </div>
  );
};

export default ProductDetails;