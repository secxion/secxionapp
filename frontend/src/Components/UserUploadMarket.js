import { useEffect, useState } from 'react';
import { CgClose } from "react-icons/cg";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import uploadImage from '../helpers/uploadImage';
import DisplayImage from './DisplayImage';
import SummaryApi from '../common';
import currencyData from '../helpers/currencyData';
import flagImageMap from '../helpers/flagImageMap';

const UserUploadMarket = ({
    onClose = () => {},
    fetchData = () => {},
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
        code: "", // Added new code field
    });

    const [selectedRate, setSelectedRate] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState("");
    const [openFullScreenImage, setOpenFullScreenImage] = useState(false);
    const [fullScreenImage, setFullScreenImage] = useState("");

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            productImage: productDetails.productImage || "",
            productName: productDetails.productName || "",
            brandName: productDetails.brandName || "",
            category: productDetails.category || "",
            requirement: productDetails.requirement || "",
            pricing: productDetails.currency && productDetails.faceValue && productDetails.rate
                ? [{
                      currency: productDetails.currency,
                      faceValues: [{
                          faceValue: productDetails.faceValue,
                          sellingPrice: productDetails.rate
                      }]
                  }]
                : [],
            code: "", // Ensure code is reset or initialized appropriately with productDetails if it exists there
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
            const updated = { ...prev, [name]: value };

            if (name === "totalAmount") {
                const total = calculateTotalAmount(value);
                updated.calculatedTotalAmount = total.toFixed(2);
            }

            return updated;
        });
    };

    const calculateTotalAmount = (value) => {
        const amount = parseFloat(value) || 0;
        return amount * selectedRate;
    };

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadImage(file);
            setData((prev) => ({
                ...prev,
                Image: [...prev.Image, result.url],
            }));
        } catch (err) {
            toast.error("⚠️ Error uploading image. Try again.");
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteImage = (index) => {
        const newImages = [...data.Image];
        newImages.splice(index, 1);
        setData((prev) => ({ ...prev, Image: newImages }));
        toast.info("🗑️ Image removed.");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.pricing || data.pricing.length === 0) {
            toast.error("💰 Please add at least one pricing entry.");
            return;
        }

        try {
            const res = await fetch(SummaryApi.userMarket.url, {
                method: SummaryApi.userMarket.method,
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await res.json();
            if (result.success) {
                toast.success(`🎉 ${result.message}`);
                onClose();
                fetchData();
                navigate("/record");
            } else {
                toast.error(`🚨 ${result.message}`);
            }
        } catch (err) {
            toast.error("❌ Submission failed. Try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 overflow-y-auto pt-12 -mb-1 px-4">
            {/* Removed the inline <style> block for glossy text as it makes text black already */}
            <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl relative animate-fadeIn
                         border-2 border-yellow-400
                         shadow-md shadow-yellow-400/20
                         dark:bg-gray-800 dark:border-yellow-500 dark:shadow-yellow-500/50"> {/* Reduced border and shadow intensity */}
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-4 mb-4 border-gray-200 dark:border-gray-700"> {/* Adjusted border color */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">📦 Upload Product Details</h2> {/* Removed glossy-heading, ensuring black text by default or dark mode white */}
                    <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl dark:text-gray-400 dark:hover:text-red-400">
                        <CgClose />
                    </button>
                </div>

                {/* Product Overview */}
                {productDetails.productImage && (
                    <div className="flex gap-4 items-center border border-yellow-300 rounded-lg p-4 bg-white mb-6 shadow-sm dark:bg-gray-700 dark:border-yellow-500"> {/* Changed background to white, reduced border intensity */}
                        <img src={productDetails.productImage} alt="Preview" className="w-24 h-24 object-cover rounded-lg shadow-inner" />
                        <div className="flex flex-col gap-1 text-sm text-gray-800 dark:text-gray-200"> {/* Ensured text is black/dark mode white */}
                            <p><span className="font-semibold">Name:</span> {productDetails.productName}</p> {/* Removed glossy-text */}
                            <p><span className="font-semibold">Currency:</span> {/* Removed glossy-text */}
                                {flagImageMap[productDetails.currency] && (
                                    <img src={flagImageMap[productDetails.currency]} className="w-5 h-5 inline-block ml-1" alt={productDetails.currency} />
                                )} {productDetails.currency}
                            </p>
                            <p><span className="font-semibold">Face Value:</span> {productDetails.faceValue}</p> {/* Removed glossy-text */}
                            <p><span className="font-semibold">Rate:</span> {productDetails.rate}</p> {/* Removed glossy-text */}
                        </div>
                    </div>
                )}

                {/* Form */}
                <form className="space-y-6 overflow-y-auto max-h-[60vh] pr-2" onSubmit={handleSubmit}> {/* Added max-h and overflow-y-auto for scrollbar */}
                    {/* Image Upload */}
                    <div>
                        <label className="block font-semibold text-gray-800 mb-2 dark:text-gray-200">📸 Upload Additional Images</label> {/* Removed glossy-text */}
                        <label htmlFor="uploadInput" className={`flex flex-col items-center justify-center border-2 border-yellow-400 rounded-lg p-5 bg-white hover:bg-gray-50 cursor-pointer transition ${uploading ? 'opacity-50 pointer-events-none' : ''} dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-yellow-500`}> {/* Changed background to white, reduced border intensity */}
                            <FaCloudUploadAlt className="text-4xl text-yellow-500 mb-1 dark:text-yellow-400" />
                            <p className="text-gray-800 dark:text-gray-300">{uploading ? 'Uploading...' : 'Click or drag to upload'}</p> {/* Ensured text is black/dark mode white */}
                        </label>
                        <input type="file" id="uploadInput" className="hidden" onChange={handleUploadImage} disabled={uploading} />
                        <div className="flex gap-3 mt-4 flex-wrap">
                            {data.Image.map((img, idx) => (
                                <div key={idx} className="relative group">
                                    <img src={img} onClick={() => {
                                        setFullScreenImage(img);
                                        setOpenFullScreenImage(true);
                                    }} className="w-20 h-20 rounded-md border border-yellow-300 object-cover cursor-pointer hover:scale-105 transition" alt={`Uploaded product image ${idx + 1}`} /> {/* Reduced border for image thumbnail */}
                                    <button type="button" onClick={() => handleDeleteImage(idx)} className="absolute top-1 right-1 text-white bg-red-500 rounded-full p-1 hidden group-hover:block">
                                        <MdDelete size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total Face Value Input */}
                    <div>
                        <label className="block font-semibold text-gray-800 mb-2 dark:text-gray-200">💰 Total Face Value ({currencySymbol})</label> {/* Removed glossy-text */}
                        <input
                            type="number"
                            name="totalAmount"
                            value={data.totalAmount}
                            onChange={handleOnChange}
                            placeholder="Enter total face value"
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm text-gray-800 focus:ring focus:ring-yellow-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-yellow-600" // Changed background to white, border to light gray, text to gray-800
                            required
                        />
                    </div>

                    {/* Calculated Amount Display */}
                    <div>
                        <label className="block font-semibold text-gray-800 mb-2 dark:text-gray-200">= Calculated Total Amount:</label> {/* Removed glossy-text */}
                        <div className="p-3 bg-gray-100 rounded-lg border border-gray-300 text-gray-800 font-bold tracking-wide dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50"> {/* Changed background to light gray, border to light gray, text to gray-800 */}
                            ₦{parseFloat(data.calculatedTotalAmount || 0).toLocaleString("en-NG", { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* New Code Input */}
                    <div>
                        <label className="block font-semibold text-gray-800 mb-2 dark:text-gray-200">🔑 Code</label> {/* Removed glossy-text */}
                        <input
                            type="text"
                            name="code"
                            value={data.code}
                            onChange={handleOnChange}
                            placeholder="Enter product code (e.g., card code)"
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm text-gray-800 focus:ring focus:ring-yellow-300 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-yellow-600" // Changed background to white, border to light gray, text to gray-800
                            required
                        />
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block font-semibold text-gray-800 mb-2 dark:text-gray-200">📝 Additional Remarks</label> {/* Removed glossy-text */}
                        <textarea
                            name="userRemark"
                            rows={4}
                            placeholder="Code, notes, details..."
                            value={data.userRemark}
                            onChange={handleOnChange}
                            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm text-gray-800 focus:ring focus:ring-yellow-300 bg-white resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-yellow-600" // Changed background to white, border to light gray, text to gray-800
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition dark:bg-emerald-700 dark:hover:bg-emerald-600"
                        disabled={uploading}
                    >
                        {uploading ? '⏳ Submitting...' : '✅ Submit Product'}
                    </button>
                </form>
            </div>

            {/* Fullscreen Image Preview */}
            {openFullScreenImage && (
                <DisplayImage imgUrl={fullScreenImage} onClose={() => setOpenFullScreenImage(false)} />
            )}
        </div>
    );
};

export default UserUploadMarket;