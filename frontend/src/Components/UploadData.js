import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { FaCloudUploadAlt, FaTrash, FaArrowLeft } from "react-icons/fa";
import { MdSend, MdClose, MdUpdate, MdEdit, MdSave, MdCancel } from "react-icons/md";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import SummaryApi from "../common";
import uploadImage from "../helpers/uploadImage";
import Loader from "./Loader";

const UploadData = ({ editingDataPad, closeUpload, refreshData }) => {
  const { user } = useSelector((state) => state.user);
  
  // Form data state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing note data when editing
  useEffect(() => {
    if (editingDataPad) {
      setTitle(editingDataPad.title || "");
      setContent(editingDataPad.content || "");
      setMedia(editingDataPad.media || []);
      setPreviewImages(editingDataPad.media || []);
    } else {
      // Reset form for new note
      setTitle("");
      setContent("");
      setMedia([]);
      setPreviewImages([]);
    }
    setHasUnsavedChanges(false);
  }, [editingDataPad]);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = editingDataPad
      ? title !== (editingDataPad.title || "") ||
        content !== (editingDataPad.content || "") ||
        JSON.stringify(media) !== JSON.stringify(editingDataPad.media || [])
      : title.trim() !== "" || content.trim() !== "" || media.length > 0;
    
    setHasUnsavedChanges(hasChanges);
  }, [title, content, media, editingDataPad]);

  // Handle image selection with validation
  const handleImageSelection = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024;
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image file`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      
      if (!isValidSize) {
        toast.error(`${file.name} is too large. Maximum size is 10MB`, {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    // Check total image limit
    if (previewImages.length + validFiles.length > 10) {
      toast.error("Maximum 10 images allowed per note", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Show local previews immediately
    const previews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      file: file,
      isUploading: true
    }));
    
    setPreviewImages(prev => [...prev, ...previews]);
    uploadImages(validFiles);
  }, [previewImages.length]);

  // Upload images to the server with progress tracking
  const uploadImages = useCallback(async (files) => {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileId = `${Date.now()}-${index}`;
        setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        try {
          const uploadResponse = await uploadImage(file);
          setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
          return uploadResponse.url;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          setUploadProgress(prev => ({ ...prev, [fileId]: -1 })); // -1 indicates error
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Update media state with successfully uploaded URLs
      setMedia(prev => [...prev, ...uploadedUrls]);
      
      // Update preview images to show uploaded state
      setPreviewImages(prev => 
        prev.map(img => 
          img.isUploading ? { ...img, isUploading: false } : img
        )
      );

      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Some images failed to upload. Please try again.", {
        position: "top-right",
        autoClose: 5000,
      });
      
      // Remove failed uploads from preview
      setPreviewImages(prev => prev.filter(img => !img.isUploading));
    } finally {
      setUploadProgress({});
    }
  }, []);

  // Remove an image from preview & media array
  const removeImage = useCallback((index) => {
    const imageToRemove = previewImages[index];
    
    // Clean up object URL if it's a local preview
    if (imageToRemove?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    const updatedMedia = media.filter((_, i) => i !== index);
    
    setPreviewImages(updatedPreviews);
    setMedia(updatedMedia);
    
    toast.info("Image removed", {
      position: "top-right",
      autoClose: 2000,
    });
  }, [previewImages, media]);

  // Handle form submission with enhanced validation
  const handleSubmitDataPad = useCallback(async () => {
    if (!user) {
      toast.error("User not found. Please log in again.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    // Enhanced validation
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    
    if (!trimmedTitle && !trimmedContent && media.length === 0) {
      toast.error("Please enter a title, content, or upload at least one image.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (trimmedTitle.length > 200) {
      toast.error("Title must be less than 200 characters.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    if (trimmedContent.length > 10000) {
      toast.error("Content must be less than 10,000 characters.", {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setLoading(true);
      
      const noteData = {
        userId: user.id || user._id,
        title: trimmedTitle,
        content: trimmedContent,
        media: media.filter(url => url && url.trim()) // Remove empty URLs
      };

      const url = editingDataPad
        ? `${SummaryApi.updateData.url}/${editingDataPad._id}`
        : SummaryApi.createData.url;
      const method = editingDataPad 
        ? SummaryApi.updateData.method 
        : SummaryApi.createData.method;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(noteData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      if (responseData.success) {
        const successMessage = editingDataPad 
          ? "Data updated successfully!" 
          : "Data created successfully!";
        
        toast.success(successMessage, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        // Clean up object URLs
        previewImages.forEach(img => {
          if (img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
          }
        });
        
        setHasUnsavedChanges(false);
        
        // Refresh data and close modal
        if (refreshData) {
          refreshData();
        }
        closeUpload();
      } else {
        throw new Error(responseData.message || "Failed to save data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error(error.message || "Error submitting data. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  }, [user, title, content, media, editingDataPad, previewImages, refreshData, closeUpload]);

  // Handle close with unsaved changes warning
  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        // Clean up object URLs
        previewImages.forEach(img => {
          if (img.url?.startsWith('blob:')) {
            URL.revokeObjectURL(img.url);
          }
        });
        closeUpload();
      }
    } else {
      closeUpload();
    }
  }, [hasUnsavedChanges, previewImages, closeUpload]);

  // Handle content editing
  const handleContentEditToggle = useCallback(() => {
    setIsEditingContent(!isEditingContent);
  }, [isEditingContent]);

  const handleContentSave = useCallback(() => {
    setIsEditingContent(false);
    toast.info("Content saved", {
      position: "top-right",
      autoClose: 2000,
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          if (!isSubmitting) {
            handleSubmitDataPad();
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleClose();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSubmitDataPad, handleClose, isSubmitting]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b mt-10 dark:border-gray-700 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleClose}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              title="Close"
            >
              <FaArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingDataPad ? "Edit Note" : "Create Note"}
              </h2>
              {hasUnsavedChanges && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  You have unsaved changes
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
              Ctrl+S to save
            </span>
            <button
              onClick={handleSubmitDataPad}
              disabled={loading || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors duration-200 flex items-center space-x-2"
            >
              {loading ? (
                <Loader size="sm" color="white" />
              ) : editingDataPad ? (
                <MdUpdate className="w-4 h-4" />
              ) : (
                <MdSend className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {loading ? "Saving..." : editingDataPad ? "Update" : "Save"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Title Input */}
          <div className="space-y-2">
            <label className="block text-base font-semibold text-gray-900 dark:text-white">
              Title
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({title.length}/200)
              </span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </div>

          {/* Content Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-base font-semibold text-gray-900 dark:text-white">
                Content
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({content.length}/10,000)
                </span>
              </label>
              {!isEditingContent && content && (
                <button
                  onClick={handleContentEditToggle}
                  className="text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center space-x-1"
                >
                  <MdEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>
            
            <div className="relative border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 min-h-[200px]">
              {isEditingContent ? (
                <div className="p-3">
                  <textarea
                    className="w-full h-48 p-0 border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Write your note content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={10000}
                    autoFocus
                  />
                  <div className="flex items-center justify-end space-x-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => setIsEditingContent(false)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-3 py-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center space-x-1"
                    >
                      <MdCancel className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleContentSave}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors duration-200 flex items-center space-x-1"
                    >
                      <MdSave className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => setIsEditingContent(true)} 
                  className="p-3 cursor-pointer min-h-[200px] flex items-start"
                >
                  {content ? (
                    <p className="whitespace-pre-wrap text-gray-900 dark:text-white leading-relaxed">
                      {content}
                    </p>
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 italic">
                      Click to add content...
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-base font-semibold text-gray-900 dark:text-white">
                Images
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                  ({previewImages.length}/10)
                </span>
              </label>
            </div>
            
            {/* Upload Button */}
            <label className="flex items-center justify-center gap-3 cursor-pointer p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
              <FaCloudUploadAlt className="text-blue-500 text-xl" />
              <div className="text-center">
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Upload Images
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  PNG, JPG, GIF up to 10MB each
                </p>
              </div>
              <input 
                type="file" 
                multiple 
                accept="image/*"
                className="hidden" 
                onChange={handleImageSelection}
                disabled={previewImages.length >= 10}
              />
            </label>

            {/* Image Preview Grid */}
            {previewImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <AnimatePresence>
                  {previewImages.map((imageData, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group aspect-square"
                    >
                      <img
                        src={imageData.url || imageData}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer transition-transform duration-200 group-hover:scale-105"
                        onClick={() => setSelectedImage(imageData.url || imageData)}
                      />
                      
                      {/* Loading overlay */}
                      {imageData.isUploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <Loader size="sm" color="white" />
                        </div>
                      )}
                      
                      {/* Delete button */}
                      <button
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        disabled={imageData.isUploading}
                      >
                        <FaTrash size={12} />
                      </button>
                      
                      {/* Image number */}
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded-full">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full Image Preview Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-14 right-4 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-200 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <MdClose size={24} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Full View"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UploadData;