import Wallet from "../../models/walletModel.js";
import { createTransactionNotification } from "../notifications/notificationsController.js";


export const ensureWalletExists = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId });
    await wallet.save();
  }
  return wallet;
};

// Fetch the current wallet balance of the logged-in user
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.userId;
    const wallet = await ensureWalletExists(userId);

    res.status(200).json({
      success: true,
      balance: wallet.balance,
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet balance',
      error: error.message,
    });
  }
};

// Fetch the wallet balance of another user by userId (for admin or authorized user)
export const getOtherUserWalletBalance = async (req, res) => {
  try {
    const userId = req.params.userId;
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found for this user.' });
    }

    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    console.error('Error fetching user wallet balance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user wallet balance',
      error: error.message,
    });
  }
};

// Update the wallet balance with validation (no negative balance, min withdrawal 1000)

export const updateWalletBalance = async (userId, amount, type, description, referenceId, onModel) => {
  try {
    const wallet = await ensureWalletExists(userId);

    // Withdrawal rules
    if (amount < 0) {
      if (Math.abs(amount) < 1000) {
        return {
          success: false,
          message: "Minimum withdrawal amount is ₦1000.",
        };
      }
      if (wallet.balance + amount < 0) {
        return {
          success: false,
          message: "Insufficient balance. Cannot go below ₦0.",
        };
      }
    }

    // Update balance
    wallet.balance += amount;

    // Record transaction
    wallet.transactions.push({
      type,
      amount,
      description,
      referenceId,
      onModel,
    });

    await wallet.save();

    // ✅ Send Notification
    const formattedAmount = `₦${Math.abs(amount).toLocaleString()}`;
    const message =
      type === 'credit'
        ? `Your wallet has been credited with ${formattedAmount}`
        : type === 'debit'
        ? `Your wallet has been debited by ${formattedAmount}`
        : `A wallet transaction of ${formattedAmount} occurred`;

    await createTransactionNotification(
      userId,
      Math.abs(amount),
      type,
      message,
      '/wallet',
      referenceId
    );

    return {
      success: true,
      message: "Wallet updated successfully.",
      newBalance: wallet.balance,
    };
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    return {
      success: false,
      message: "Failed to update wallet balance.",
      error: error.message,
    };
  }
};

