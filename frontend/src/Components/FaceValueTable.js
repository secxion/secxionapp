import React, { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const FaceValueTable = ({ activeCurrency, onSell }) => {
  const tableContainerRef = useRef(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (tableContainerRef.current) {
        setIsOverflowing(
          tableContainerRef.current.scrollHeight >
          tableContainerRef.current.clientHeight
        );
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [activeCurrency]);

  const shouldShowOverflowIndicator = activeCurrency?.faceValues?.length > 5;

  if (!activeCurrency || activeCurrency?.faceValues?.length === 0) return null;

  return (
    <div className="fixed mt-32 py-12 left-0 top-0 right-o w-full overflow-y-auto h-[calc(100vh-190px)] sm:h-[calc(100vh-160px)]">
      <table className="min-w-full table-auto text-left">
        <thead className="bg-gray-200 dark:bg-gray-700 sticky top-0 z-50">
          <tr>
            <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-300">
              Face Value
            </th>
            <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-300">
              Rate
            </th>
            <th className="py-3 px-4 text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-300">
              Require
            </th>
            <th className="py-3 px-4 text-center text-sm font-semibold uppercase tracking-wider text-gray-800 dark:text-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-200 dark:bg-gray-800">
          {activeCurrency?.faceValues?.map((fv, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <td className="py-3 px-4 font-bold text-gray-900 dark:text-gray-200">{fv.faceValue}</td>
              <td className="py-3 px-4 font-semibold text-emerald-800 dark:text-emerald-400">{fv.sellingPrice}</td>
              <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-300">{fv.description}</td>
              <td className="py-3 px-4 text-center">
                <button
                  className="inline-flex items-center bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                  onClick={() => onSell(fv)}
                >
                  Sell Now
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {shouldShowOverflowIndicator && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-500 animate-bounce z-10">
          <FontAwesomeIcon icon={faChevronDown} size="lg" />
        </div>
      )}
    </div>
  );
};

export default FaceValueTable;