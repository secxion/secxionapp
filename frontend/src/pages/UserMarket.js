import React, { useContext, useEffect, useState, useCallback } from "react";
import SummaryApi from "../common";
import UserUploadMarket from "../Components/UserUploadMarket";
import HistoryCard from "../Components/HistoryCard";
import UserContext from "../Context"; 

const UserMarket = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProduct, setAllProduct] = useState([]);
  const { user } = useContext(UserContext);

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
      console.log("product data", dataResponse);
      setAllProduct(dataResponse?.data || []);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user._id) {
      fetchAllProduct();
    }
  }, [fetchAllProduct, user]);

  return (
    <div>
      <div className="bg-cream py-2 px-4 flex justify-between items-center">
        <h2 className="font-bold text-lg">Record</h2>
      </div>

      <div className="flex items-center flex-wrap gap-3 py-8 p-4 h-[calc(100vh-190px)] overflow-y-scroll">
        {allProduct.map((product, index) => {
          return (
            <HistoryCard data={product} key={index + "allProduct"} fetchdata={fetchAllProduct} />
          );
        })}
      </div>

      {openUploadProduct && (
        <UserUploadMarket onClose={() => setOpenUploadProduct(false)} fetchData={fetchAllProduct} />
      )}
    </div>
  );
};

export default UserMarket;