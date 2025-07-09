import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { FaPlus } from "react-icons/fa";
import { MdViewList, MdViewModule, MdRefresh } from "react-icons/md";

import UploadData from "../Components/UploadData";
import DataPadList from "../Components/DataPadList";
import DataPadGrid from "../Components/DataPadGrid";
import EmptyState from "../Components/EmptyState";
import LoadingSpinner from "../Components/LoadingSpinner";
import SearchAndFilter from "../Components/SearchAndFilter";
import SummaryApi from "../common";

const SORT_OPTIONS = {
  NEWEST: 'newest',
  OLDEST: 'oldest',
  TITLE_AZ: 'title_az',
  TITLE_ZA: 'title_za',
  UPDATED: 'updated'
};

const VIEW_MODES = {
  LIST: 'list',
  GRID: 'grid'
};

const DataPad = () => {
  const { user } = useSelector((state) => state.user);
  
  // Core state
  const [editingDataPad, setEditingDataPad] = useState(null);
  const [dataPads, setDataPads] = useState([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI state
  const [viewMode, setViewMode] = useState(VIEW_MODES.LIST);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.NEWEST);
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const fetchDataPads = useCallback(async (showToast = false) => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(SummaryApi.allData.url, {
        method: SummaryApi.allData.method,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        const userDataPads = data.data.filter(
          (item) => item.userId === user?.id || item.userId === user?._id
        );
        setDataPads(userDataPads);
        
        if (showToast && userDataPads.length > 0) {
          toast.success(`Loaded ${userDataPads.length} Data`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        throw new Error(data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
      toast.error("Failed to load data. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchDataPads();
  }, [fetchDataPads]);

  // Filtered and sorted data pads
  const filteredAndSortedDataPads = useMemo(() => {
    let filtered = dataPads;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pad) =>
          pad.title?.toLowerCase().includes(query) ||
          pad.content?.toLowerCase().includes(query)
      );
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(
        (pad) => pad.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case SORT_OPTIONS.NEWEST:
          return new Date(b.createdAt) - new Date(a.createdAt);
        case SORT_OPTIONS.OLDEST:
          return new Date(a.createdAt) - new Date(b.createdAt);
        case SORT_OPTIONS.UPDATED:
          return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
        case SORT_OPTIONS.TITLE_AZ:
          return (a.title || '').localeCompare(b.title || '');
        case SORT_OPTIONS.TITLE_ZA:
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [dataPads, searchQuery, selectedTags, sortBy]);

  // Get all unique tags from data pads
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    dataPads.forEach(pad => {
      pad.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [dataPads]);

  // Handlers
  const handleOpenEditor = useCallback((dataPad = null) => {
    setEditingDataPad(dataPad);
    setIsUploadOpen(true);
  }, []);

  const handleCloseEditor = useCallback(() => {
    setIsUploadOpen(false);
    setEditingDataPad(null);
    setTimeout(() => {
      fetchDataPads();
    }, 100);
  }, [fetchDataPads]);

  const handleDeleteDataPad = useCallback(async (id) => {
    if (!window.confirm("Are you sure you want to delete this data?")) return;

    try {
      const response = await fetch(`${SummaryApi.deleteData.url}/${id}`, {
        method: SummaryApi.deleteData.method,
        credentials: "include",
      });

      const responseData = await response.json();
      
      if (responseData.success) {
        toast.success("Data deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setDataPads(prev => prev.filter(item => item._id !== id));
      } else {
        throw new Error(responseData.message || "Failed to delete data");
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error("Failed to delete data. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, []);

  const handleRefresh = useCallback(() => {
    fetchDataPads(true);
  }, [fetchDataPads]);

  if (isLoading && dataPads.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" message="Loading your data..." />
        </div>
      </motion.div>
    );
  }

  if (error && dataPads.length === 0) {
    return (
      <motion.div
        className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <MdRefresh className="inline-block mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 mt-24 lg:mt-28 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                My DataPad
              </h1>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-sm font-medium">
                {dataPads.length}
              </span>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 disabled:opacity-50"
                title="Refresh"
              >
                <MdRefresh className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode(VIEW_MODES.LIST)}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === VIEW_MODES.LIST
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title="List view"
                >
                  <MdViewList className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode(VIEW_MODES.GRID)}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === VIEW_MODES.GRID
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                  title="Grid view"
                >
                  <MdViewModule className="w-5 h-5" />
                </button>
              </div>

              {/* Create Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleOpenEditor()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors duration-200 flex items-center space-x-2"
              >
                <FaPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Note</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {dataPads.length > 0 && (
        <div className="sticky top-32 lg:top-36 z-20">
          <SearchAndFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}          
            availableTags={availableTags}
            showFilters={showFilters}
            onSortByChange={setSortBy}
            sortOrder="desc"
            setShowFilters={setShowFilters}
            resultCount={filteredAndSortedDataPads.length}
            totalCount={dataPads.length}
          />
        </div>
      )}

      {/* Main Content - Scrollable */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AnimatePresence mode="wait">
            {dataPads.length === 0 ? (
              <EmptyState onCreateFirst={() => handleOpenEditor()} key="empty" />
            ) : filteredAndSortedDataPads.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  No notes found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTags([]);
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pb-20" // Add padding at bottom for mobile FAB
              >
                {viewMode === VIEW_MODES.LIST ? (
                  <DataPadList
                    dataPads={filteredAndSortedDataPads}
                    onOpen={handleOpenEditor}
                    onDelete={handleDeleteDataPad}
                    isLoading={isLoading}
                  />
                ) : (
                  <DataPadGrid
                    dataPads={filteredAndSortedDataPads}
                    onOpen={handleOpenEditor}
                    onDelete={handleDeleteDataPad}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Editor Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <UploadData
            editingDataPad={editingDataPad}
            closeUpload={handleCloseEditor}
            refreshData={fetchDataPads}
          />
        )}
      </AnimatePresence>

      {/* Floating Action Button (Mobile) */}
      {dataPads.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleOpenEditor()}
          className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg lg:hidden transition-colors duration-200 z-40"
        >
          <FaPlus className="w-6 h-6" />
        </motion.button>
      )}
    </motion.div>
  );
};

export default DataPad;