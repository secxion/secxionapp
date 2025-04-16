import React, { useState } from "react";
import { useSelector } from "react-redux";
import { FaPaperclip } from "react-icons/fa";
import { MdSend, MdDelete } from "react-icons/md";
import uploadImage from "../helpers/uploadImage";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import { useNavigate } from 'react-router-dom';

const ReportForm = ({ onReportSubmit }) => {
    const { user } = useSelector((state) => state.user);
    const [reportText, setReportText] = useState("");
    const [selectedCategory, setSelectedCategory] = useState({
        category: "",
        autoReply: "wait for reply..." 
    }); 
    const [uploadedImage, setUploadedImage] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const categories = ["Fraud", "Transaction Issue", "Bug Report", "Other"];

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const uploadResponse = await uploadImage(file);
            setUploadedImage(uploadResponse.url);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReport = async () => {
        if (!user) {
            toast.error("Please log in.");
            return;
        }

        if (!reportText && !uploadedImage) {
            toast.error("Message or image required.");
            return;
        }

        setLoading(true);

        try {
            const initialChatHistory = [{
                message: reportText,
                sender: "user",
                createdAt: new Date().toISOString(),
                image: uploadedImage,
            }];

            const newReport = {
                userId: user?.id || user?._id,
                email: user?.email || "",
                name: user?.name || "Anonymous",
                category: selectedCategory.category, 
                message: reportText,
                image: uploadedImage || "",
                status: "Pending",
                adminReply: "",
                createdAt: new Date().toISOString(),
                chatHistory: initialChatHistory,
                autoReply: selectedCategory.autoReply, 
            };

            const response = await fetch(SummaryApi.submitReport.url, {
                method: SummaryApi.submitReport.method,
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReport),
            });

            const responseData = await response.json();

            if (response.ok && responseData.success) {
                toast.success("Report submitted!");
                setReportText("");
                setUploadedImage(null);
                const updatedReport = { ...newReport, _id: responseData.data?._id || Date.now() };
                onReportSubmit(updatedReport);
                navigate(`/chat/${responseData.data?._id}`);
            } else {
                toast.error(responseData.message || "Submission failed.");
            }
        } catch (error) {
            toast.error("Error submitting.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-10 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">Submit Report</h2>
            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Category:</label>
                <select
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={selectedCategory.category} 
                    onChange={(e) => setSelectedCategory({ category: e.target.value, autoReply: selectedCategory.autoReply })}
                >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Message:</label>
                <textarea
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Describe your issue..."
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    rows={4}
                />
            </div>

            <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Attachment:</label>
                <div className="flex items-center mt-1">
                    <label className="cursor-pointer flex items-center gap-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-gray-50 hover:bg-gray-100">
                        <FaPaperclip className="text-blue-500" />
                        <span>Upload</span>
                        <input type="file" className="hidden" onChange={handleUploadImage} />
                    </label>
                    {uploadedImage && (
                        <div className="relative ml-2">
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-12 h-12 object-cover rounded-md border border-gray-300"
                            />
                            <button
                                className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                                onClick={() => setUploadedImage(null)}
                            >
                                <MdDelete className="text-sm" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <button
                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                onClick={handleSubmitReport}
                disabled={loading}
            >
                <MdSend className="inline-block mr-2" />
                {loading ? "Submitting..." : "Submit"}
            </button>
        </div>
    );
};

export default ReportForm;