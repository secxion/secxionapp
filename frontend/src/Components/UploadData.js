import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaCloudUploadAlt, FaTrash,FaArrowLeft } from "react-icons/fa";
import { MdSend, MdClose, MdUpdate, MdEdit } from "react-icons/md";
import { toast } from "react-toastify";
import SummaryApi from "../common";
import uploadImage from "../helpers/uploadImage";
import Loader from "./Loader"; // Assuming you have a Loader component


const UploadData = ({ editingDataPad, setEditingDataPad, closeUpload }) => {
  const { user } = useSelector((state) => state.user);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]); // Stores uploaded image URLs
  const [previewImages, setPreviewImages] = useState([]); // Stores preview images
  const [loading, setLoading] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false); // Track content edit mode
  const [selectedImage, setSelectedImage] = useState(null); // Full image preview state

  // Load existing note data when editing
  useEffect(() => {
    if (editingDataPad) {
      setTitle(editingDataPad.title || "");
      setContent(editingDataPad.content || "");
      setMedia(editingDataPad.media || []);
      setPreviewImages(editingDataPad.media || []);
    } else {
      setTitle("");
      setContent("");
      setMedia([]);
      setPreviewImages([]);
    }
  }, [editingDataPad]);

  // Handle image selection
  const handleImageSelection = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Show local previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages([...previewImages, ...previews]);

    // Upload images
    uploadImages(files);
  };

  // Upload images to the server
  const uploadImages = async (files) => {
    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const uploadResponse = await uploadImage(file);
          return uploadResponse.url;
        })
      );

      setMedia([...media, ...uploadedUrls]); // Add uploaded URLs to state
      toast.success("Images uploaded successfully!");
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Image upload failed.");
    }
  };

  // Remove an image from preview & media array
  const removeImage = (index) => {
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedMedia = media.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
    setMedia(updatedMedia);
  };

  // Handle form submission
  const handleSubmitDataPad = async () => {
    if (!user) {
      toast.error("User not found. Please log in again.");
      return;
    }

    if (!title.trim() && !content.trim() && media.length === 0) {
      toast.error("Please enter a title, content, or upload an image.");
      return;
    }

    try {
      setLoading(true);
      const newDataPad = { userId: user.id || user._id, title, content, media };

      const url = editingDataPad
        ? `${SummaryApi.updateData.url}/${editingDataPad._id}`
        : SummaryApi.createData.url;
      const method = editingDataPad ? SummaryApi.updateData.method : SummaryApi.createData.method;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDataPad),
      });

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(editingDataPad ? "Data updated successfully!" : "Data entry created!");
        closeUpload();
        setEditingDataPad(null);
      } else {
        toast.error(responseData.message || "Failed to save Data.");
      }
    } catch (error) {
      console.error("Error submitting Data:", error);
      toast.error("Error submitting Data.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="container mt-24 fixed inset-0 bg-white p-6 flex flex-col shadow-lg overflow-auto z-50 mx-auto">
      {/* Close Button */}
      <button
          onClick={closeUpload}
          className="mt-24 fixed top-2 left-1/2 -translate-x-1/2 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 z-50"
        >
          <FaArrowLeft size={20} />
        </button>

      <h2 className="text-xl font-bold mb-4">{editingDataPad ? "Edit" : "Create"} Note</h2>

      {/* Title Input */}
      <input
        type="text"
        className="w-full p-3 border rounded-lg bg-gray-50 mb-3"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Content Editable Section */}
      <div className="relative w-full border rounded-lg bg-gray-50 p-3 mb-3">
        {isEditingContent ? (
          <textarea
            className="w-full p-3 border-none outline-none bg-gray-50"
            rows={4}
            autoFocus
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={() => setIsEditingContent(false)} 
          />
        ) : (
          <div onClick={() => setIsEditingContent(true)} className="cursor-pointer">
            {content ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <span className="text-gray-500">Click to add content...</span>
            )}
          </div>
        )}

        {!isEditingContent && (
          <button
            onClick={() => setIsEditingContent(true)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <MdEdit size={20} />
          </button>
        )}
      </div>

      {/* Image Upload */}
      <label className="flex items-center gap-2 cursor-pointer p-2 border rounded-lg bg-gray-50 hover:bg-gray-100">
        <FaCloudUploadAlt className="text-blue-500" />
        <span>Upload Images</span>
        <input type="file" multiple className="hidden" onChange={handleImageSelection} />
      </label>

      {/* Image Preview */}
      {previewImages.length > 0 && (
        <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-3">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-24 object-cover rounded-lg shadow-md cursor-pointer"
                onClick={() => setSelectedImage(src)}
              />
              <button
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-75 hover:opacity-100"
                onClick={() => removeImage(index)}
              >
                <FaTrash size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Full Image View Modal */}
      {selectedImage && (
        <div className="fixed mt-20 inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 bg-red-600 text-white p-2 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <MdClose size={24} />
          </button>
          <img src={selectedImage} alt="Full View" className="max-w-full max-h-screen" />
        </div>
      )}

      {/* Submit Button */}
      <button
            className="mt-4 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:bg-blue-400 cursor-pointer"
            onClick={handleSubmitDataPad}
            disabled={loading}
          >
            {editingDataPad ? <MdUpdate className="inline-block mr-2" /> : <MdSend className="inline-block mr-2" />}
            {loading ? <Loader size="sm" color="white" /> : editingDataPad ? "Update Note" : "Save Note"}
          </button>
    </div>
  );
};

export default UploadData;
