const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        balance: {
            type: Number,
            default: 0,
        },
        bankAccounts: [
            {
                _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
                accountNumber: {
                    type: String,
                    required: true,
                },
                bankName: {
                    type: String,
                    required: true,
                },
                accountHolderName: {
                    type: String,
                    required: true,
                },
            },
        ],
        transactions: [
            {
                type: {
                    type: String,
                    enum: ['credit', 'debit', 'withdrawal'],
                    required: true,
                },
                amount: {
                    type: Number,
                    required: true,
                },
                description: {
                    type: String,
                },
                referenceId: {
                    type: mongoose.Schema.Types.ObjectId,
                    refPath: 'onModel',
                },
                onModel: {
                    type: String,
                    enum: ['userproduct', 'WithdrawalRequest', 'PaymentRequest'],
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
                status: {
                    type: String,
                    enum: ['pending', 'approved-processing', 'rejected', 'completed'],
                    default: 'completed',
                },
            },
        ],
    },
    { timestamps: true }
);

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet;