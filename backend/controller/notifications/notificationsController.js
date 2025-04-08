const Notification = require("../../models/notificationModel");
const report = require("../../models/report");
const PaymentRequest = require("../../models/paymentRequestModel"); 

const createTransactionNotification = async (userId, amount, type, message, link, relatedObjectId, additionalData = {}) => {
    try {
        const notificationType = type === 'payment_completed' ? 'transaction:payment_completed' : `transaction:${type}`;
        const newNotificationData = {
            userId,
            amount,
            type: notificationType,
            message,
            link,
            relatedObjectId,
            isRead: false,
            ...additionalData, 
        };

       
        if (type === 'rejected' && relatedObjectId) {
            const paymentRequest = await PaymentRequest.findById(relatedObjectId);
            if (paymentRequest && paymentRequest.rejectionReason) {
                newNotificationData.rejectionReason = paymentRequest.rejectionReason;
                console.log('Rejection Reason found:', paymentRequest.rejectionReason);
            } else {
                console.log('Rejection Reason NOT found for PaymentRequest ID:', relatedObjectId);
            }
            newNotificationData.onModel = 'PaymentRequest'; 
            newNotificationData.type = 'transaction:rejected'; 
        }

        const newNotification = new Notification(newNotificationData);
        const savedNotification = await newNotification.save();
        console.log('Notification created:', savedNotification);
    } catch (error) {
        console.error('Error creating transaction notification:', error);
    }
};

const createReportReplyNotification = async (userId, reportId, message, link) => {
    try {
        const newNotification = new Notification({
            userId,
            type: 'report_reply',
            message,
            link,
            relatedObjectId: reportId,
            onModel: 'Report',
            isRead: false,
        });
        const savedNotification = await newNotification.save();
    } catch (error) {
        console.error('Error creating report reply notification:', error);
    }
};


const getUserTransactionNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const transactionNotifications = await Notification.find({
            userId: userId,
            type: { $in: ['transaction:debit', 'transaction:credit', 'transaction:payment_completed', 'transaction:withdrawal', 'transaction:rejected'] } 
        }).sort({ createdAt: -1 });

        console.log('Transaction Notifications fetched:', transactionNotifications);
        res.status(200).json({
            success: true,
            data: transactionNotifications,
        });
    } catch (error) {
        console.error('Error fetching user transaction notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch transaction notifications.',
            error: error.message,
        });
    }
};

const getUserReportNotifications = async (req, res) => {
    try {
        const userId = req.userId;
        const reportNotifications = await Notification.find({
            userId: userId,
            onModel: 'Report'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: reportNotifications,
        });
    } catch (error) {
        console.error('Error fetching user report notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report notifications.',
            error: error.message,
        });
    }
};;

const fetchReportDetails = async (req, res) => {
    try {
        const { reportId } = req.params;
        const reportDetails = await report.findById(reportId);

        if (!reportDetails) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.',
            });
        }

        res.status(200).json({
            success: true,
            data: reportDetails,
        });
    } catch (error) {
        console.error('Error fetching report details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch report details.',
            error: error.message,
        });
    }
};

const markNotificationAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, userId: userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to this user.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            data: notification,
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read.',
            error: error.message,
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.userId;

        const deletedNotification = await Notification.findOneAndDelete({ _id: notificationId, userId: userId });

        if (!deletedNotification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to this user.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete notification.',
            error: error.message,
        });
    }
};

const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await Notification.updateMany(
            { userId: userId, isRead: false },
            { isRead: true }
        );

        res.status(200).json({
            success: true,
            message: `${result.modifiedCount} notifications marked as read.`,
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read.',
            error: error.message,
        });
    }
};

const deleteAllNotifications = async (req, res) => {
    try {
        const userId = req.userId;

        const result = await Notification.deleteMany({ userId: userId });

        res.status(200).json({
            success: true,
            message: `${result.deletedCount} notifications deleted.`,
        });
    } catch (error) {
        console.error('Error deleting all notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete all notifications.',
            error: error.message,
        });
    }
};

module.exports = {
    createTransactionNotification,
    createReportReplyNotification,
    getUserTransactionNotifications,
    getUserReportNotifications,
    fetchReportDetails,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
    deleteAllNotifications,
};