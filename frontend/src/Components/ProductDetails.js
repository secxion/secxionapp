import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserUploadMarket from './UserUploadMarket';
import { useDispatch, useSelector } from "react-redux";
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import GetInTouchFooter from './GetInTouchFooter';
import Shimmer from './Shimmer';
import { setUserDetails } from "../store/userSlice";
import PDSidePanel from "./PDSidePanel";
import currencyFullNames from "../helpers/currencyFullNames";
import flagImageMap from "../helpers/flagImageMap";

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
    const { user } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [isPDSidePanelOpen, setIsPDSidePanelOpen] = useState(false);

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
            const logoutData = await response.json();

            if (logoutData.success) {
                toast.success(logoutData.message);
                dispatch(setUserDetails(null));
                navigate("/login");
            } else {
                toast.error(logoutData.message);
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
        <div className="w-screen min-w-screen">
            <header className="fixed w-screen left-0 dark:bg-gray-800  py-20 px-4 sm:px-6 lg:px-8 top-0">
                {data?.pricing && data?.pricing.length > 0 && (
                    <div className="mt-4">
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner overflow-x-auto py-2 px-4">
                            <div className="flex items-center -py-10 space-x-3">
                                {data.pricing.map((currency) => {
                                    const fullCurrencyName =
                                        currencyFullNames[currency.currency] || currency.currency;
                                    return (
                                        <button
                                            key={currency.currency}
                                            className={`flex-shrink-0 py-2 px-3 rounded-md text-sm font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 flex items-center ${
                                                activeCurrency?.currency === currency.currency
                                                    ? 'bg-emerald-500 text-white shadow-md'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                            onClick={() => handleCurrencyChange(currency.currency)}
                                        >
                                            {flagImageMap[currency.currency] && (
                                                <img
                                                    src={flagImageMap[currency.currency]}
                                                    alt={`${currency.currency} Flag`}
                                                    className="w-5 h-5 mr-2 rounded-sm object-contain shadow-inner"
                                                    style={{ minWidth: '20px', minHeight: '20px' }}
                                                />
                                            )}
                                            {fullCurrencyName}
                                        </button>
                                    );
                                })}
                                {data.pricing?.length === 0 && (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No currencies available.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </header>

            <main className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
                <div className='border rounded-lg p-4 bg-gray-50 shadow-inner mb-2'>
                    <div className='flex items-center gap-2'>
                        <div className="p-6 mt-4">
                            <p className="text-gray-700 dark:text-gray-300">{data?.description}</p>
                        </div>
                    </div>

                    <div className=" w-full left-0 rounded-lg shadow-md overflow-y-auto">
                        <div className=" p-6 ">
                            {activeCurrency && activeCurrency?.faceValues && activeCurrency?.faceValues.length > 0 ? (
                                <div className="space-y-3">
                                    {activeCurrency.faceValues.map((fv) => (
                                        <div
                                            key={fv.faceValue}
                                            className="bg-gray-100 dark:bg-gray-700 rounded-md p-4 flex items-center justify-between"
                                        >
                                            <div className='grid grid-col-3 items-center'>
                                                {flagImageMap[activeCurrency?.currency] && (
                                                    <img
                                                        src={flagImageMap[activeCurrency?.currency]}
                                                        alt={`${activeCurrency?.currency} Flag`}
                                                        className="w-5 h-5 mr-2 rounded-sm object-contain shadow-inner"
                                                        style={{ minWidth: '20px', minHeight: '20px' }}
                                                    />
                                                )}
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    facevalue: {fv.faceValue} {activeCurrency?.currency}
                                                </span>
                                                <span className="font-semibold text-gray-800 dark:text-gray-200">
                                                    rate: {fv.sellingPrice}
                                                </span>
                                                {fv.requirement && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        ({fv.requirement})
                                                    </p>
                                                )}
                                            </div>
                                            <button
                                                className="inline-flex items-center bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1"
                                                onClick={() => handleSell(fv)}
                                            >
                                                Sell Now
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-6 text-center">
                                    <span className="text-gray-500 dark:text-gray-400">
                                        No denominations available for the selected currency.
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showUploadForm && selectedFaceValue && activeCurrency && (
                    <div className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50">
                        <div className="flex items-center justify-center min-h-screen p-4">
                            <div className="relative bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl">
                                <button
                                    onClick={() => setShowUploadForm(false)}
                                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                >
                                    <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                                <div className="py-6 px-6">
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
                                            requirement: selectedFaceValue.requirement,
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