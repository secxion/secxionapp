import React, { useContext, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import SummaryApi from "../common";
import UserUploadMarket from "../Components/UserUploadMarket";
import HistoryCard from "../Components/HistoryCard";
import HistoryDetailView from "../Components/HistoryDetailView";
import UserContext from "../Context";


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
        <div className="w-screen overflow-x-hidden min-h-screen bg-white pt-24 border-2 border-black"> {/* Added black border to main container, white background, and padding */}
            {/* Glossy Text Styles (EXACTLY from SidePanel) */}
            <style>{`
                .glossy-text {
                    text-shadow:
                        -1px -1px 0 #fff,
                        1px -1px 0 #fff,
                        -1px 1px 0 #fff,
                        1px 1px 0 #fff,
                        2px 2px 5px rgba(0,0,0,0.5);
                    -webkit-text-stroke: 0.5px #000;
                    color: #000;
                }
                .glossy-heading {
                    text-shadow:
                        0 0 5px rgba(255,255,255,0.7),
                        0 0 10px rgba(255,255,255,0.5),
                        2px 2px 5px rgba(0,0,0,0.3);
                    -webkit-text-stroke: 0.7px #333;
                    color: #000;
                }
            `}</style>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> {/* Centered content */}
                <div className="bg-white py-2 px-4 flex justify-between items-center border-b-4 border-black shadow-md rounded-b-xl mb-6"> {/* Black bottom border with shadow for embossed feel */}
                    <h2 className="font-bold text-lg glossy-heading">Record</h2> {/* Applied glossy-heading */}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4">
                    {allProduct.length > 0 ? (
                        allProduct.map((product) => (
                            <HistoryCard
                                key={product._id}
                                data={product}
                                isDetailViewOpen={selectedProductForDetail?._id === product._id}
                                onCloseDetailView={() => handleCloseDetailView()}
                                // Props for styling HistoryCard
                                cardClassName="bg-white rounded-xl shadow-sm border-2 border-black hover:border-4 hover:border-gray-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg" // Black border, darker on hover
                                textClassName="glossy-text" // Apply glossy text to internal text
                                headingClassName="glossy-heading" // Apply glossy heading to internal headings
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-10 bg-white rounded-xl shadow-sm border-2 border-black"> {/* Black border */}
                            {marketId ? (
                                <p className="text-gray-500 glossy-text">Market record not found.</p> // Applied glossy text
                            ) : (
                                <p className="text-gray-500 glossy-text">Loading records or no records found...</p> // Applied glossy text
                            )}
                        </div>
                    )}
                </div>
            </div>

            {selectedProductForDetail && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border-4 border-black"> {/* White background, bold black border for modal */}
                        <HistoryDetailView
                            productDetails={{
                                ...selectedProductForDetail,
                                crImage: selectedProductForDetail.crImage || null
                            }}
                            onClose={handleCloseDetailView}
                            // Props for styling HistoryDetailView content
                            textClassName="glossy-text"
                            headingClassName="glossy-heading"
                        />
                    </div>
                </div>
            )}

            {openUploadProduct && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
                    <div className="relative bg-white w-full max-w-md rounded-xl shadow-2xl border-4 border-black"> {/* White background, bold black border for modal */}
                        <UserUploadMarket
                            onClose={() => setOpenUploadProduct(false)}
                            fetchData={fetchAllProduct}
                            // Props for styling UserUploadMarket content
                            textClassName="glossy-text"
                            headingClassName="glossy-heading"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserMarket;