// models/notificationModel.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['report_reply', 'transaction:debit', 'transaction:credit', 'new_blog', 'transaction:withdrawal', 'transaction:payment_completed', 'transaction:rejected', 'market_upload:DONE', 'market_upload:CANCEL', 'market_upload:PROCESSING']
    },
    category: { // New category field
        type: String,
        enum: ['transaction', 'report', 'market_upload', 'general'],
        default: 'general',
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
    },
    relatedObjectId: {
        type: Schema.Types.ObjectId,
        refPath: 'onModel'
    },
    onModel: {
        type: String,
        enum: ['PaymentRequest', 'Wallet', 'Report', 'BlogNote', 'userproduct'],
        default: 'PaymentRequest'
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    rejectionReason: {
        type: String,
    },
    cancelReason: { // Keep the cancelReason for market upload cancellations
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;