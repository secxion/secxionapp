
import React, { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';
import currencyData from '../helpers/currencyData';

const UserUploadMarket = ({
    onClose = () => { },
    fetchData = () => { },
    productDetails = {},
}) => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [data, setData] = useState({
        Image: [],
        totalAmount: "",
        calculatedTotalAmount: "",
        userRemark: "",
        productImage: productDetails.productImage || "",
        productName: productDetails.productName || "",
        brandName: productDetails.brandName || "",
        category: productDetails.category || "",
        description: productDetails.description || "",
        pricing: Array.isArray(productDetails.pricing) ? productDetails.pricing : [],
    });

    const [selectedRate, setSelectedRate] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState("");
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    useEffect(() => {
        console.log("📦 Received product details:", productDetails);

        setData((prevData) => ({
            ...prevData,
            productImage: productDetails.productImage || "",
            productName: productDetails.productName || "",
            brandName: productDetails.brandName || "",
            category: productDetails.category || "",
            description: productDetails.description || "",
            pricing: productDetails.currency && productDetails.faceValue && productDetails.rate
                ? [{
                    currency: productDetails.currency,
                    faceValues: [{
                        faceValue: productDetails.faceValue,
                        sellingPrice: productDetails.rate
                    }]
                }]
                : [],
        }));

        if (productDetails.currency) {
            setCurrencySymbol(currencyData[productDetails.currency] || productDetails.currency);
        }

        if (productDetails.rate) {
            setSelectedRate(productDetails.rate);
        }
    }, [productDetails]);


    const handleOnChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => {
            const updatedData = {
                ...prev,
                [name]: value,
            };

            if (name === "totalAmount") {
                const total = calculateTotalAmount(value);
                updatedData.calculatedTotalAmount = total.toFixed(2);
            }

            return updatedData;
        });
    };


    const calculateTotalAmount = (enteredAmount) => {
        const amount = parseFloat(enteredAmount) || 0;
        const total = amount * selectedRate;
        return total;
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            try {
                const uploadImageCloudinary = await uploadImage(file);
                setData((prev) => ({
                    ...prev,
                    Image: [...prev.Image, uploadImageCloudinary.url],
                }));
            } catch (error) {
                toast.error("⚠️ Error uploading image. Please try again.");
                console.error("Image upload error:", error);
            } finally {
                setUploading(false);
            }
        }
    };

    const handleDeleteImage = (index) => {
        const newImages = [...data.Image];
        newImages.splice(index, 1);

        setData((prev) => ({
            ...prev,
            Image: newImages,
        }));
        toast.info("🗑️ Image removed.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.pricing || data.pricing.length === 0) {
            toast.error("💰 Please add at least one pricing entry.");
            return;
        }

        console.log("🚀 Submitting data:", JSON.stringify(data, null, 2));

        try {
            const response = await fetch(SummaryApi.userMarket.url, {
                method: SummaryApi.userMarket.method,
                credentials: 'include',
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            console.log("✅ Server response:", responseData);

            if (responseData.success) {
                toast.success(`🎉 ${responseData.message}`);
                onClose();
                fetchData();
                navigate('/record');
            } else {
                toast.error(`🚨 ${responseData.message}`);
            }
        } catch (error) {
            toast.error("⚠️ An unexpected error occurred. Please try again later.");
            console.error("Submission error:", error);
        }
    };

    return (
        <div className='fixed w-full h-full bg-gray-800 bg-opacity-50 top-0 left-0 flex justify-center items-center pt-16'>
            <div className='bg-white p-6 rounded-2xl w-full max-w-2xl shadow-lg transition-transform transform scale-95 hover:scale-100 duration-300' style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className='flex justify-between items-center mb-6'>
                    <h2 className='font-extrabold text-2xl text-gray-800'>📦 Upload Product Details</h2>
                    <div
                        className='text-2xl text-gray-500 hover:text-red-600 cursor-pointer'
                        onClick={onClose}
                    >
                        <CgClose />
                    </div>
                </div>

                {productDetails && (
                    <div className='border rounded-lg p-4 bg-gray-50 shadow-inner mb-6'>
                        <div className='flex items-center gap-4'>
                            <img
                                src={productDetails.productImage || ''}
                                alt='Product Preview'
                                className='w-24 h-24 object-cover rounded-lg border'
                            />
                            <div>
                                <h3 className='font-bold text-gray-800 text-lg'>{productDetails.productName}</h3>
                                <p className='text-gray-600'>Currency: {productDetails.currency}</p>
                                <p className='text-gray-600'>Face Value: {productDetails.faceValue}</p>
                                <p className='text-gray-600'>Rate: {productDetails.rate}</p>
                            </div>
                        </div>
                        <p className='text-gray-600 mt-4'>{productDetails.description}</p>
                    </div>
                )}

                <form className='space-y-6' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='Image' className='block font-medium text-gray-700 mb-2'>
                            📸 Product Images:
                        </label>
                        <label htmlFor='uploadImageInput'>
                            <div className={`p-4 border rounded-lg bg-gray-50 flex justify-center items-center cursor-pointer hover:bg-gray-100 shadow-md ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <div className='text-gray-500 flex flex-col items-center'>
                                    <FaCloudUploadAlt className='text-5xl text-blue-500' />
                                    <p className='text-sm'>
                                        {uploading ? 'Uploading...' : 'Click to Upload'}
                                    </p>
                                </div>
                            </div>
                            <input
                                type='file'
                                id='uploadImageInput'
                                className='hidden'
                                onChange={handleUploadImage}
                                disabled={uploading}
                            />
                        </label>
                        <div className='flex gap-2 mt-4 flex-wrap'>
                            {data?.Image.length > 0 ? (
                                data.Image.map((el, index) => (
                                    <div className='relative group' key={index}>
                                        <img
                                            src={el}
                                            alt={`product-${index}`}
                                            className='w-20 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition-transform duration-200'
                                            onClick={() => {
                                                setOpenFullScreenImage(true);
                                                setFullScreenImage(el);
                                            }}
                                        />
                                        <div
                                            className='absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hidden group-hover:block cursor-pointer'
                                            onClick={() => handleDeleteImage(index)}
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className='text-red-600 text-sm'>⚠️ Please upload at least one product image.</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor='totalAmount' className='block font-medium text-gray-700 mb-2'>
                            💰 Total Face Value ({currencySymbol}):
                        </label>
                        <div className='relative'>
                            <input
                                type='number'
                                id='totalAmount'
                                name='totalAmount'
                                value={data.totalAmount}
                                onChange={handleOnChange}
                                className='w-full p-3 pl-10 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 shadow-sm'
                                required
                                placeholder="Enter total face value"
                            />
                        </div>
                    </div>

                    <div className='mt-4'>
                        <label className='block font-medium text-gray-700 mb-2'>
                            💲 Calculated Total Amount:
                        </label>
                        <div className='p-3 border rounded-lg bg-gray-50 text-gray-800 font-semibold'>
                            ₦{parseFloat(data.calculatedTotalAmount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </div>
                    </div>


                    <div>
                        <label htmlFor='userRemark' className='block font-medium text-gray-700 mb-2'>
                            📝 Additional Remarks:
                        </label>
                        <textarea
                            id='userRemark'
                            name='userRemark'
                            value={data.userRemark}
                            onChange={handleOnChange}
                            rows={4}
                            className='w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-blue-300 shadow-sm'
                            placeholder="Any specific notes or details?"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="mt-5 w-full bg-emerald-600 text-white p-3 rounded-lg font-semibold hover:bg-emerald-700 shadow-lg hover:shadow-xl transition duration-300"
                        disabled={uploading}
                    >
                        {uploading ? '⏳ Submitting...' : '✅ Submit Product'}
                    </button>
                </form>
            </div>
            {openFullScreenImage && (
                <DisplayImage
                    onClose={() => setOpenFullScreenImage(false)}
                    imgUrl={fullScreenImage}
                />
            )}
        </div>
    );
};

export default UserUploadMarket;