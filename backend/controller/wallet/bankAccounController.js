import Wallet from "../../models/walletModel.js";

export const addBankAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountNumber, bankName, accountHolderName } = req.body;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found for this user.',
      });
    }

    if (wallet.bankAccounts.length >= 2) {
      return res.status(400).json({
        success: false,
        message: 'You cannot add more than 2 bank accounts.',
      });
    }

    const accountExists = wallet.bankAccounts.some(
      (account) => account.accountNumber === accountNumber && account.bankName === bankName
    );
    if (accountExists) {
      return res.status(409).json({
        success: false,
        message: 'This bank account is already added.',
      });
    }

    const newBankAccount = {
      accountNumber,
      bankName,
      accountHolderName,
    };

    wallet.bankAccounts.push(newBankAccount);
    await wallet.save();

    res.status(201).json({
      success: true,
      message: 'Bank account added successfully.',
      data: wallet.bankAccounts,
    });
  } catch (error) {
    console.error('Error adding bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bank account.',
      error: error.message,
    });
  }
};

export const getBankAccounts = async (req, res) => {
  try {
    const userId = req.userId;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found for this user.',
      });
    }

    res.status(200).json({
      success: true,
      data: wallet.bankAccounts,
    });
  } catch (error) {
    console.error('Error fetching bank accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank accounts.',
      error: error.message,
    });
  }
};

export const deleteBankAccount = async (req, res) => {
  try {
    const userId = req.userId;
    const { accountId } = req.params;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found for this user.',
      });
    }

    const initialLength = wallet.bankAccounts.length;
    wallet.bankAccounts = wallet.bankAccounts.filter(
      (account) => account._id.toString() !== accountId
    );

    if (wallet.bankAccounts.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Bank account not found.',
      });
    }

    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Bank account deleted successfully.',
      data: wallet.bankAccounts,
    });
  } catch (error) {
    console.error('Error deleting bank account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bank account.',
      error: error.message,
    });
  }
};
