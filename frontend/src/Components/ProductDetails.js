import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserUploadMarket from './UserUploadMarket';
import { useDispatch, useSelector } from "react-redux";

import SummaryApi from '../common';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import CurrencySelector from './CurrencySelector';
import FaceValueTable from './FaceValueTable';
import GetInTouchFooter from './GetInTouchFooter';
import ProductImageCarousel from './ProductImageCarousel';
import Shimmer from './Shimmer';
import { setUserDetails } from "../store/userSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import PDSidePanel from "./PDSidePanel"; // Import the new PDSidePanel

const ProductDetails = () => {
    const [data, setData] = useState({
        productName: '',
        brandName: '',
        category: '',
        productImage: [],
        description: '',
        pricing: [],
    });
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user); // Use useSelector to get user

    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [isPDSidePanelOpen, setIsPDSidePanelOpen] = useState(false); // State for the new sidebar

    const [activeCurrency, setActiveCurrency] = useState(null);
    const [selectedFaceValue, setSelectedFaceValue] = useState(null);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

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

    const handleLogout = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.logout_user.url, {
                method: SummaryApi.logout_user.method,
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                dispatch(setUserDetails(null));
                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Logout failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [navigate, dispatch]);


    const toggleMobileMenu = useCallback(() => setIsPDSidePanelOpen(prev => !prev), []);

    const closePDSidePanel = useCallback(() => setIsPDSidePanelOpen(false), []);


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
                        <Shimmer type="heading" />
                        <div className="mt-6 grid grid-cols-1 gap-6">
                            <Shimmer type="paragraph" />
                            <Shimmer type="paragraph" />
                            <Shimmer type="paragraph" />
                            <Shimmer type="button" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                    <div className="absolute inset-0 bg-red-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                    <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                            Error Loading Product
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={handleGoBack}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed min-h-screen w-screen left-0 right-0 bg-gray-100 dark:bg-gray-900 z-50">
            <header className="bg-white dark:bg-gray-800 shadow-md py-4 border-b-6 border-gray-400 px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <button onClick={handleGoBack} className="focus:outline-none">
                        <FaArrowLeft className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                        onClick={toggleMobileMenu}
                        className="text-xl font-semibold text-gray-800 dark:text-gray-200 focus:outline-none z-50"
                        aria-expanded={isPDSidePanelOpen}
                        aria-controls="pd-mobile-menu"
                    >
                        <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                    </button>
                </div>
                {data?.pricing && data?.pricing.length > 0 && (
                    <div className="mt-4 px-4 sm:px-6 lg:px-8">
                        <CurrencySelector
                            pricing={data.pricing}
                            activeCurrency={activeCurrency}
                            onCurrencyChange={handleCurrencyChange}
                        />
                    </div>
                )}
            </header>

            <main className="py-6 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        {data?.productImage && data?.productImage.length > 0 ? (
                            <ProductImageCarousel images={data.productImage} />
                        ) : (
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg aspect-w-16 aspect-h-9 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                            </div>
                        )}
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                                {data?.brandName} - {data?.productName} ({data?.category})
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                {data?.description}
                            </p>
                        </div>
                    </div>
                    <div>
                        {activeCurrency && activeCurrency?.faceValues && activeCurrency?.faceValues.length > 0 ? (
                            <FaceValueTable activeCurrency={activeCurrency} onSell={handleSell} />
                        ) : (
                            <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-6 flex items-center justify-center h-48">
                                <span className="text-gray-500 dark:text-gray-400">
                                    No face values available for the selected currency.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {showUploadForm && selectedFaceValue && activeCurrency && (
                    <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl">
                                <button
                                    onClick={() => setShowUploadForm(false)}
                                    className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <svg className="h-6 w-6 fill-current" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <div className="py-6 px-8">
                                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                                        Upload Market Item ({activeCurrency?.currency} {selectedFaceValue?.faceValue})
                                    </h2>
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
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <GetInTouchFooter />
            <PDSidePanel
                isSidePanelOpen={isPDSidePanelOpen}
                onCloseSidePanel={closePDSidePanel}
                onLogout={handleLogout}
            />
        </div>
    );
};

export default ProductDetails;