import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import UserUploadMarket from "../Components/UserUploadMarket";
import HistoryCard from "../Components/HistoryCard";
import HistoryDetailView from "../Components/HistoryDetailView";
import UserContext from "../Context";
import Shimmer from "../Components/Shimmer";

const UserMarket = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const { user } = useContext(UserContext);
  const { marketId } = useParams();
  const [selectedProductForDetail, setSelectedProductForDetail] = useState(null);

  const fetchAllProduct = useCallback(async () => {
    if (!user || !user._id) {
      console.warn("User is not defined or userId is missing.");
      return;
    }

    try {
      const response = await fetch(`${SummaryApi.myMarket.url}?userId=${user._id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
      });

      const dataResponse = await response.json();
      console.log("all product data", dataResponse);
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch all products:", error);
    }
  }, [user]);

  const fetchProductById = useCallback(async (id) => {
    if (!user || !user._id || !id) {
      console.warn("User or market ID is missing.");
      setAllProduct([]);
      return;
    }

    try {
      const response = await fetch(SummaryApi.myMarketById.url.replace(':marketId', id), {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        credentials: "include",
      });

      const dataResponse = await response.json();
      console.log("specific product data", dataResponse);
      setAllProduct(dataResponse?.data ? [dataResponse.data] : []);
      setSelectedProductForDetail(dataResponse?.data || null);
    } catch (error) {
      console.error(`Failed to fetch product with ID ${id}:`, error);
      setAllProduct([]);
      setSelectedProductForDetail(null);
    }
  }, [user]);

  useEffect(() => {
    if (marketId) {
      fetchProductById(marketId);
    } else if (user && user._id) {
      fetchAllProduct();
    }
  }, [fetchAllProduct, fetchProductById, marketId, user]);

  const handleOpenDetailView = (product) => {
    setSelectedProductForDetail(product);
  };

  const handleCloseDetailView = () => {
    setSelectedProductForDetail(null);
  };

  return (
    <div className="mt-28">
      <div className="container bg-cream py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Record</h2>
      </div>

      <div className="flex items-center flex-wrap gap-3 py-2 p-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product) => (
          <HistoryCard
            key={product._id}
            data={product}
            isDetailViewOpen={selectedProductForDetail?._id === product._id}
            onCloseDetailView={() => handleCloseDetailView()}
          />
        ))}
        {allProduct.length === 0 && !marketId && (
          <p className="text-gray-500 top-0 text-center w-full text-lg">
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
          </p>
        )}
        {allProduct.length === 0 && marketId && (
          <p className="text-gray-500 text-center w-full">Market record not found.</p>
        )}
      </div>

      {selectedProductForDetail && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <HistoryDetailView
            productDetails={{
              ...selectedProductForDetail,
              crImage: selectedProductForDetail.crImage || null
            }}
            onClose={handleCloseDetailView}
          />
        </div>
      )}

      {openUploadProduct && (
        <UserUploadMarket onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default UserMarket;