import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserUploadMarket from "./UserUploadMarket";
import SummaryApi from "../common";
import currencyFullNames from "../helpers/currencyFullNames";
import { FaArrowLeft, FaCoins, FaTags } from "react-icons/fa";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { MdDescription } from "react-icons/md";
import { toast } from "react-toastify";

const ProductDetails = () => {
    const [data, setData] = useState({
        productName: "",
        brandName: "",
        category: "",
        productImage: [],
        description: "",
        pricing: [],
    });
    const [loading, setLoading] = useState(true);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState(null);
    const [selectedFaceValue, setSelectedFaceValue] = useState(null);
    const [error, setError] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) return;

        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(SummaryApi.productDetails.url, {
                    method: SummaryApi.productDetails.method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ productId: id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData?.message || "Failed to fetch product details");
                }

                const dataResponse = await response.json();
                setData(dataResponse?.data);
                setActiveCurrency(dataResponse?.data?.pricing?.[0] || null);
            } catch (err) {
                console.error("⚠️ Error fetching product details:", err);
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

    return (
        <div className="mt-16 min-h-screen w-screen bg-gray-100 py-6 flex items-center justify-center">
            <div className="container mx-auto p-8 rounded-xl shadow-2xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white max-w-4xl w-full flex flex-col items-center relative">
                {/* Back Button */}
                {!loading && (
                    <button
                        onClick={handleGoBack}
                        className="absolute top-4 left-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        <FaArrowLeft className="inline-block mr-2" /> Back
                    </button>
                )}

                <div className={`mb-8 mt-8 w-full flex flex-col items-center`}>
                    {loading ? (
                        <div className="animate-pulse flex flex-col gap-4 w-full">
                            <div className="bg-slate-200 dark:bg-slate-700 h-10 rounded-full w-3/4"></div>
                            <div className="bg-slate-200 dark:bg-slate-700 h-8 rounded-full w-1/2"></div>
                            <div className="bg-slate-200 dark:bg-slate-700 h-6 rounded-full w-1/3"></div>
                        </div>
                    ) : error ? (
                        <div className="text-center">
                            <p className="text-red-500 font-semibold mb-4">⚠️ {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center w-full">
                            <div className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full w-fit mb-4">
                                <FaTags className="inline-block mr-2" /> {data?.brandName}
                            </div>
                            <h1 className="text-3xl font-bold text-center mb-4">{data?.productName}</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                                <GiCardboardBoxClosed className="inline-block mr-2" /> {data?.category}
                            </p>

                            {data?.productImage && data?.productImage.length > 0 && (
                                <div className="rounded-lg overflow-hidden shadow-md mb-6 w-40">
                                    <img
                                        src={data.productImage[0]}
                                        alt={data.productName}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            )}

                            <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
                                <MdDescription className="inline-block mr-2" /> {data?.description || "No description available."}
                            </p>

                            <div className="mt-6 w-full">
                                <h3 className="text-xl font-semibold mb-4 text-center">💰 Available Currencies</h3>
                                <div className="overflow-auto"> {/* Changed to overflow-auto */}
                                    <div className="flex space-x-4 w-max mx-auto">
                                        {data?.pricing?.map((currency) => {
                                            const fullCurrencyName =
                                                currencyFullNames[currency.currency] || currency.currency;
                                            return (
                                                <button
                                                    key={currency.currency}
                                                    className={`flex-shrink-0 p-3 border rounded-md cursor-pointer transition-colors duration-300 ${
                                                        activeCurrency?.currency === currency.currency
                                                            ? "bg-emerald-500 text-white border-emerald-500 shadow-md"
                                                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600"
                                                    }`}
                                                    onClick={() => handleCurrencyChange(currency.currency)}
                                                >
                                                    <span className="font-semibold">{fullCurrencyName}</span>
                                                </button>
                                            );
                                        })}
                                        {data?.pricing?.length === 0 && (
                                            <p className="text-gray-500 dark:text-gray-400">No currencies available for this product.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {activeCurrency && activeCurrency?.faceValues?.length > 0 && (
                                <div className="mt-8 w-full">
                                    <h3 className="text-xl font-semibold mb-4 text-center">💸 Sell in {currencyFullNames[activeCurrency.currency] || activeCurrency.currency}</h3>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full table-auto bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg overflow-hidden text-gray-800 dark:text-gray-200">
                                            <thead className="bg-gray-200 dark:bg-gray-600">
                                                <tr>
                                                    <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                                                        Face Value
                                                    </th>
                                                    <th className="py-3 px-6 text-left text-sm font-semibold uppercase tracking-wider">
                                                        Rate
                                                    </th>
                                                    <th className="py-3 px-6 text-center text-sm font-semibold uppercase tracking-wider">
                                                        Action
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {activeCurrency?.faceValues?.map((fv, index) => (
                                                    <tr
                                                        key={index}
                                                        className="border-b dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600"
                                                    >
                                                        <td className="py-3 px-6">{fv.faceValue}</td>
                                                        <td className="py-3 px-6 text-emerald-600 dark:text-emerald-400 font-semibold">
                                                            {fv.sellingPrice}
                                                        </td>
                                                        <td className="py-3 px-6 text-center">
                                                            <button
                                                                className="px-4 py-2 rounded-md font-semibold text-sm text-white bg-emerald-500 hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
                                                                onClick={() => handleSell(fv)}
                                                            >
                                                                Sell Now
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            {activeCurrency && activeCurrency?.faceValues?.length === 0 && (
                                <p className="text-gray-500 dark:text-gray-400 mt-4">No face values available for the selected currency.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showUploadForm && selectedFaceValue && activeCurrency && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <UserUploadMarket
                        onClose={() => setShowUploadForm(false)}
                        fetchData={() => setShowUploadForm(false)}
                        productDetails={{
                            productName: data.productName,
                            productImage: data.productImage[0],
                            currency: activeCurrency.currency,
                            rate: selectedFaceValue.sellingPrice,
                            faceValue: selectedFaceValue.faceValue,
                            description: data.description,
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default ProductDetails;