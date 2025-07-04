// HistoryCard.jsx
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HistoryCard = ({
    data,
    isDetailViewOpen,
    onCloseDetailView,
    cardClassName, // Prop for the main card div
    textClassName, // Prop for general text elements
    headingClassName // Prop for heading elements
}) => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    // Placeholder for opening detail view (if needed, otherwise can remove)
    const handleOpenDetailView = useCallback(() => {
        // This component doesn't directly open the modal, UserMarket does.
        // But if you intend for clicking the card to navigate or open a direct detail view,
        // you would add that logic here. For now, it just navigates to a specific market ID.
        if (data?._id) {
            navigate(`/user-market/${data._id}`);
        }
    }, [data?._id, navigate]);

    const statusColors = {
        "WAIT": "bg-yellow-100 text-yellow-800",
        "COMPLETED": "bg-green-100 text-green-800",
        "CANCELLED": "bg-red-100 text-red-800",
        "PENDING": "bg-blue-100 text-blue-800",
        "APPROVED": "bg-purple-100 text-purple-800",
    };

    const statusText = {
        "WAIT": "Awaiting Approval",
        "COMPLETED": "Completed",
        "CANCELLED": "Cancelled",
        "PENDING": "Pending Payment",
        "APPROVED": "Approved",
    };

    return (
        // Applied cardClassName for styling and hover effects from UserMarket
        <div
            className={`relative rounded-xl p-4 cursor-pointer transition-all duration-300 ${cardClassName}`}
            onClick={handleOpenDetailView}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Glossy Text Styles (Repeated for self-containment if component used elsewhere, otherwise can rely on parent) */}
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

            {/* Product Image */}
            {data?.productImage?.[0] && (
                <img
                    src={data.productImage[0]}
                    alt={data.productName}
                    className="w-full h-32 object-cover rounded-lg mb-4 border border-gray-300"
                    loading="lazy"
                />
            )}

            {/* Product Details */}
            <h3 className={`font-bold text-gray-800 text-lg mb-2 ${headingClassName}`}> {/* Applied headingClassName */}
                {data.productName}
            </h3>
            <p className={`text-gray-700 text-sm mb-1 ${textClassName}`}> {/* Applied textClassName */}
                **Face Value:** {data.totalAmount}
            </p>
            <p className={`text-gray-700 text-sm mb-1 ${textClassName}`}> {/* Applied textClassName */}
                **Amount:** ${data.calculatedTotalAmount}
            </p>
            <p className={`text-gray-700 text-sm mb-1 ${textClassName}`}> {/* Applied textClassName */}
                **Date:** {new Date(data.createdAt).toLocaleDateString()}
            </p>

            {/* Status Badge */}
            <div className={`mt-3 px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center ${statusColors[data.status]} ${textClassName}`}> {/* Applied textClassName */}
                <span className="mr-1">●</span> {statusText[data.status] || data.status}
            </div>

            {/* Detail View Indicator (Optional, if you want a visual cue for clickability) */}
            {isHovered && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-xl">
                    <span className="text-white font-bold glossy-text">View Details</span>
                </div>
            )}
        </div>
    );
};

export default HistoryCard;