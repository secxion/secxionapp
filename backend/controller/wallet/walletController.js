const Wallet = require("../../models/walletModel");

const ensureWalletExists = async (userId) => {
  let wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    wallet = new Wallet({ userId });
    await wallet.save();
  }
  return wallet;
};

const getWalletBalance = async (req, res) => {
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

const getOtherUserWalletBalance = async (req, res) => {
  try {
    const userId = req.params.userId; 
    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found for this user.' });
    }

    res.status(200).json({ success: true, balance: wallet.balance });
  } catch (error) {
    console.error('Error fetching user wallet balance:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user wallet balance', error: error.message });
  }
};

const updateWalletBalance = async (userId, amount, type, description, referenceId, onModel) => {
  try {
    const wallet = await ensureWalletExists(userId);
    wallet.balance += amount;

    wallet.transactions.push({
      type,
      amount,
      description,
      referenceId,
      onModel,
    });

    await wallet.save();
    return { success: true, newBalance: wallet.balance };
  } catch (error) {
    console.error('Error updating wallet balance:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { getWalletBalance, getOtherUserWalletBalance, updateWalletBalance };