import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTrash,
  FaEdit,
  FaImage,
  FaTag,
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa";
import { MdMoreVert } from "react-icons/md";

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatLastUpdated = (updatedAt, createdAt) => {
  const updateDate = new Date(updatedAt || createdAt);
  const createDate = new Date(createdAt);

  if (updatedAt && updateDate > createDate) {
    return `Updated ${formatDate(updatedAt)}`;
  }
  return `Created ${formatDate(createdAt)}`;
};

const truncateText = (text, maxLength = 150) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};

const NoteCard = ({ dataPad, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation();
    setIsDeleting(true);
    try {
      await onDelete(dataPad._id);
    } catch (error) {
      console.error("Error deleting note:", error);
    } finally {
      setIsDeleting(false);
    }
  }, [dataPad._id, onDelete]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    onEdit(dataPad);
  }, [dataPad, onEdit]);

  const handleView = useCallback(() => {
    onView(dataPad);
  }, [dataPad, onView]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-200 cursor-pointer group"
      onClick={handleView}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
              {dataPad.title || "Untitled Note"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatLastUpdated(dataPad.updatedAt, dataPad.createdAt)}
            </p>
          </div>

          <div className="relative ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            >
              <MdMoreVert className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
                  onMouseLeave={() => setShowActions(false)}
                >
                  <button
                    onClick={handleEdit}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <FaEdit className="w-4 h-4" />
                    <span>Edit Note</span>
                  </button>
                  <button
                    onClick={handleView}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                  >
                    <FaEye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 disabled:opacity-50"
                  >
                    <FaTrash className="w-4 h-4" />
                    <span>{isDeleting ? "Deleting..." : "Delete Note"}</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content Preview */}
        {dataPad.content && (
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
            {truncateText(dataPad.content)}
          </p>
        )}

        {/* Tags */}
        {dataPad.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {dataPad.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
              >
                {tag}
              </span>
            ))}
            {dataPad.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                +{dataPad.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Media Info */}
        {dataPad.media?.length > 0 && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <FaImage className="w-4 h-4 mr-2" />
            <span>
              {dataPad.media.length} image{dataPad.media.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <FaCalendarAlt className="w-3 h-3 mr-1" />
            <span>{new Date(dataPad.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-200"
              title="Edit note"
            >
              <FaEdit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 disabled:opacity-50"
              title="Delete note"
            >
              <FaTrash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NoteCard;
