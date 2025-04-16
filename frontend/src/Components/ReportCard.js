// ReportCard.js
import React, { useState, useRef, useEffect, useCallback } from "react";
import SummaryApi from "../common";
import { MdSend, MdClose, MdAdd } from "react-icons/md";
import uploadImage from "../helpers/uploadImage";
import { format } from "date-fns";
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ReportCard = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [userReplyText, setUserReplyText] = useState("");
  const [userReplyImage, setUserReplyImage] = useState(null);
  const [uploadingReplyImage, setUploadingReplyImage] = useState(false);
  const chatHistoryRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [hasReceivedReply, setHasReceivedReply] = useState(false);

  const fetchReport = useCallback(async () => {
    try {
      const response = await fetch(SummaryApi.getReports.url, {
        method: SummaryApi.getReports.method,
        credentials: "include",
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      const foundReport = data.data.find((r) => r._id === reportId);
      if (foundReport) {
        setReport(foundReport);
        const adminReply = foundReport.chatHistory?.some(msg => msg.sender === "admin");
        setHasReceivedReply(adminReply);
      } else {
        navigate('/report');
      }
    } catch (error) {
      console.error("Error fetching report:", error);
      navigate('/report');
    } finally {
      setIsLoadingInitial(false);
    }
  }, [reportId, navigate]);

  useEffect(() => {
    fetchReport();
    pollingIntervalRef.current = setInterval(fetchReport, 5000);
    return () => clearInterval(pollingIntervalRef.current);
  }, [fetchReport]);

  useEffect(() => {
    if (report && chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [report?.chatHistory]);

  const handleUserReplySubmit = async () => {
    if (!userReplyText && !userReplyImage) return;
    setIsSending(true);
    try {
      const response = await fetch(
        SummaryApi.userReplyReport.url.replace(":id", reportId),
        {
          method: SummaryApi.userReplyReport.method,
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userReply: userReplyText,
            userReplyImage,
          }),
        }
      );
      const data = await response.json();
      if (data.success) {
        setUserReplyText("");
        setUserReplyImage(null);
        await fetchReport();
      } else {
        console.error("Reply failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingReplyImage(true);
    try {
      const uploaded = await uploadImage(file);
      setUserReplyImage(uploaded.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingReplyImage(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserReplySubmit();
    }
  };

  if (isLoadingInitial) {
    return <div className="flex justify-center items-center h-screen">initiating chat...</div>;
  }

  if (!report) return null;

  return (
    <div className="fixed w-full h-screen flex flex-col bg-gradient-to-br from-white to-gray-50">
      {/* Header */}
      <div className="w-full px-4 py-4 mt-8 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-blue-700">{report.category}</h2>
          <span className="text-xs text-gray-500">Report ID: {report._id.slice(-6)}</span>
        </div>
        <button
          onClick={() => navigate("/report")}
          className="text-gray-500 hover:text-red-500 p-2 rounded-full"
        >
          <MdClose className="text-2xl" />
        </button>
      </div>

      {/* Chat history */}
      <div
        ref={chatHistoryRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4"
      >
        {/* Auto-reply */}
        {!hasReceivedReply && report.autoReply && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg shadow-sm">
            <p className="text-sm">{report.autoReply}</p>
            <p className="text-xs text-right mt-2">
              {format(new Date(), "yyyy-MM-dd")}
            </p>
          </div>
        )}

        {/* Messages */}
        {report.chatHistory?.map((msg, i) => (
          <div
            key={i}
            className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 shadow-md text-sm ${
              msg.sender === "admin"
                ? "ml-auto bg-blue-100 text-blue-800"
                : "mr-auto bg-white text-gray-700"
            }`}
          >
            <p className="whitespace-pre-line break-words">{msg.message}</p>
            {msg.image && (
              <img
                src={msg.image}
                alt="attachment"
                className="mt-2 rounded-lg max-w-full"
              />
            )}
            <p className="text-[10px] text-gray-400 text-right mt-1">
              {format(new Date(msg.createdAt), "HH:mm")}
            </p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t bg-white px-6 py-8 space-y-2 z-50">
        <div className="relative">
          <textarea
            className="w-full p-2 border rounded-lg pr-16 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            rows={3}
            value={userReplyText}
            onChange={(e) => setUserReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <label className="absolute right-12 top-3 cursor-pointer text-gray-500 hover:text-blue-600">
            <MdAdd className="text-xl" />
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
          <button
            className="absolute right-3 top-3 text-blue-600 hover:text-blue-800"
            onClick={handleUserReplySubmit}
            disabled={isSending || uploadingReplyImage || (!userReplyText && !userReplyImage)}
          >
            <MdSend className="text-xl" />
          </button>
        </div>
        {userReplyImage && (
          <div className="flex items-center gap-2 mt-1">
            <img
              src={userReplyImage}
              alt="preview"
              className="w-16 h-16 object-cover rounded"
            />
            <button
              onClick={() => setUserReplyImage(null)}
              className="text-red-500 hover:text-red-700"
            >
              <MdClose />
            </button>
          </div>
        )}
        {uploadingReplyImage && (
          <p className="text-xs text-gray-500">Uploading image...</p>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
