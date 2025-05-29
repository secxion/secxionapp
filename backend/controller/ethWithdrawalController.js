import EthWithdrawalRequest from "../models/ethWithdrawalRequestModel.js";
import axios from "axios";

export const createEthWithdrawalRequest = async (req, res) => {
  try {
    const { ethAddress, nairaAmount } = req.body;
    const userId = req.userId;

    console.log("Received withdrawal request:", { ethAddress, nairaAmount, userId });

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user ID missing" });
    }

    if (!ethAddress || !nairaAmount) {
      return res.status(400).json({ success: false, message: "ETH address and Naira amount are required." });
    }

    let ethRate;
    try {
      const rateResponse = await axios.get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "ethereum",
          vs_currencies: "ngn"
        }
      });
      ethRate = rateResponse.data?.ethereum?.ngn;

      if (!ethRate) {
        console.error("ETH rate missing in API response:", rateResponse.data);
        return res.status(500).json({ success: false, message: "Unable to fetch ETH rate." });
      }

      console.log("Fetched ETH to NGN rate:", ethRate);
    } catch (apiError) {
      console.error("Failed to fetch ETH rate:", apiError);
      return res.status(502).json({ success: false, message: "External API error while fetching ETH rate." });
    }

    const ethEquivalent = parseFloat(nairaAmount) / ethRate;

    const newWithdrawal = new EthWithdrawalRequest({
      userId,
      ethAddress,
      nairaAmount,
      ethEquivalent,
      status: "Pending"
    });

    await newWithdrawal.save();

    console.log("Withdrawal request saved:", newWithdrawal);

    return res.status(201).json({
      success: true,
      message: "Withdrawal request submitted successfully.",
      data: newWithdrawal
    });
  } catch (error) {
    console.error("Unexpected error during withdrawal:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while processing withdrawal request.",
      error: error.message
    });
  }
};

export const getAllEthWithdrawalRequests = async (req, res) => {
  try {
    const requests = await EthWithdrawalRequest.find().populate("userId", "name email").sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("Failed to fetch withdrawal requests:", error);
    return res.status(500).json({ success: false, message: "Error fetching withdrawal requests", error: error.message });
  }
};

export const updateEthWithdrawalStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Processed", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const request = await EthWithdrawalRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, message: "Withdrawal request not found." });
    }

    return res.status(200).json({ success: true, message: "Status updated successfully", data: request });
  } catch (error) {
    console.error("Failed to update withdrawal request status:", error);
    return res.status(500).json({ success: false, message: "Error updating status", error: error.message });
  }
};
