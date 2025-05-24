import express from 'express';
import passport from 'passport';

import userSignUpController from '../controller/user/userSignUp.js';
import userSignInController from '../controller/user/userSignin.js';
import userDetailsController from '../controller/user/userDetails.js';
import authToken from '../middleware/authToken.js';
import userLogout from '../controller/user/userLogout.js';
import allUsers from '../controller/user/allUsers.js';
import updateUser from '../controller/user/UpdateUser.js';
import UploadProductController from '../controller/product/uploadProduct.js';
import getProductController from '../controller/product/getProduct.js';
import updateProductController from '../controller/product/updateProduct.js';
import getCategoryProduct from '../controller/product/getCategoryProductOne.js';
import getCategoryWiseProduct from '../controller/product/getCategoryWiseProduct.js';
import getProductDetails from '../controller/product/getProductDetails.js';
import SearchProduct from '../controller/product/searchProduct.js';
import filterProductController from '../controller/product/filterProduct.js';
import UserUploadMarketController from '../controller/product/userUploadMarket.js';
import getMarketController from '../controller/product/getUserMarket.js';
import marketRecordController from '../controller/product/marketRecord.js';
import { getAllUserMarkets, updateMarketStatus } from '../controller/product/userMarketController.js';
import { createBlogNote, getAllBlogNotes, updateBlogNote, deleteBlogNote } from '../controller/blogNoteController.js';
import submitReportController from '../controller/user/submitReportController.js';
import getUserReportsController from '../controller/user/getUserReportsController.js';
import { getAllReportsController, replyToReportController } from '../controller/user/adminReports.js';
import { getAllDataPads, createDataPad, updateDataPad, deleteDataPad } from '../controller/dataPadController.js';
import { createContactUsMessage, getAllContactUsMessages } from '../controller/contactUsController.js';
import { getAllUserDataPadsForAdmin } from '../controller/user/adminDataPadController.js';
import { getWalletBalance, getOtherUserWalletBalance } from '../controller/wallet/walletController.js';
import { createPaymentRequest, getAllPaymentRequests, getUserPaymentRequests, updatePaymentRequestStatus } from '../controller/wallet/paymentRequestController.js';
import { addBankAccount, getBankAccounts, deleteBankAccount, sendBankAddCode, verifyAndAddBankAccount } from '../controller/wallet/bankAccounController.js';
import { getUserTransactions } from '../controller/wallet/transactionsController.js';
import { getUserTransactionNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, deleteAllNotifications, getUserReportNotifications, fetchReportDetails, getUnreadNotificationCount, getNewNotifications, getMarketNotifications } from '../controller/notifications/notificationsController.js';
import getReportDetailsController from '../controller/user/getReportDetailsController.js';
import userReplyReportController from '../controller/report/userReplyReportController.js';
import getReportChatController from '../controller/report/getReportChatController.js';
import sendChatMessageController from '../controller/report/sendChatMessageController.js';
import userProfileController from '../controller/userProfileController.js';
import getMarketByIdController from '../controller/product/getMarketByIDController.js';
import { getApprovedPostsController, submitNewPostController, deletePostController, addCommentController } from '../controller/user/communityController.js';
import { getPendingPostsController, approvePostController, rejectPostController } from '../controller/user/adminCommunityController.js';
import getUserPostsController from '../controller/user/getUserPostsController.js';
import { verifyEmailController } from '../controller/user/verifyEmailController.js';
import deleteUser from '../controller/user/deleteUser.js';
import checkVerified from '../middleware/checkVerified.js';
import { sendResetCode, verifyReset } from '../controller/user/resetController.js';
import { resendVerificationEmailController } from '../controller/user/resendVerificationEmailController.js';
import { getPaystackBanks, resolveBankAccount, } from '../controller/wallet/paystackController.js';


const router = express.Router();

router.post("/signup", userSignUpController);
router.get('/verify-email', verifyEmailController);
router.post("/signin", userSignInController);
router.get("/user-details", authToken, userDetailsController);
router.get("/userLogout", userLogout);
router.post("/request-reset", sendResetCode); 
router.post("/confirm-reset", verifyReset); 
router.post("/resend-verification", resendVerificationEmailController);
router.post("/send-bank-code", authToken, sendBankAddCode);
router.post("/verify-add-bank", authToken, verifyAndAddBankAccount);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // You can redirect to frontend with token or session
        res.redirect(`${process.env.FRONTEND_URL}/home`);
    }
);

// Admin panel
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);
router.get("/get-all-users-market", authToken, getAllUserMarkets);
router.post("/update-market-status/:id", updateMarketStatus);
router.get("/getAllDataForAdmin", authToken, getAllUserDataPadsForAdmin);
router.delete("/delete-user", deleteUser);


// Wallet balance
router.get("/wallet/balane/:userId", authToken, getOtherUserWalletBalance);

// Product
router.post("/upload-product", authToken, UploadProductController);
router.get("/get-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.get("/get-categoryProduct", getCategoryProduct);
router.post("/category-product", getCategoryWiseProduct);
router.post("/product-details", getProductDetails);
router.get("/search", SearchProduct);
router.post("/filter-product", filterProductController);

// User market
router.post("/upload-market", authToken, UserUploadMarketController);
router.get("/get-market", authToken, getMarketController);
router.get("/get-market/:marketId", authToken, getMarketByIdController);
router.get("/market-record", authToken, marketRecordController);

// System blog
router.post("/create-blog", createBlogNote);
router.get("/get-blogs", getAllBlogNotes);
router.put("/update-blog/:id", updateBlogNote);
router.delete("/delete-blog/:id", deleteBlogNote);

// Reports
router.post("/submit-report", authToken, submitReportController);
router.get("/get-reports", authToken, getUserReportsController);
router.get("/all-reports", authToken, getAllReportsController);
router.post("/reply-report/:id", authToken, replyToReportController);
router.post("/reports/:id/reply", authToken, userReplyReportController);
router.get("/reports/admin/:id/chat", authToken, getReportChatController);
router.post("/reports/admin/:id/sendchat", authToken, sendChatMessageController);

// DataPad
router.get("/alldata", authToken, getAllDataPads);
router.post("/createdata", authToken, createDataPad);
router.put("/updatedata/:id", authToken, updateDataPad);
router.delete("/deletedata/:id", authToken, deleteDataPad);

// Contact us
router.post("/contact-us-message", createContactUsMessage);
router.get("/get-contact-us-messages", getAllContactUsMessages);

// Wallet
router.get("/wallet/balance", authToken, getWalletBalance);

// Payment request
router.post("/pr/create", authToken, createPaymentRequest);
router.get("/pr/getall", authToken, getAllPaymentRequests);
router.get("/pr/getuser", authToken, getUserPaymentRequests);
router.patch("/pr/update/:id", authToken, updatePaymentRequestStatus);

// Bank account
router.post("/ba/add", authToken, addBankAccount);
router.get("/ba/get", authToken, getBankAccounts);
router.delete("/ba/delete/:accountId", authToken, deleteBankAccount);
router.post('/verify-account', authToken, resolveBankAccount);
router.get('/banks', authToken, getPaystackBanks);

// Transactions
router.get("/transactions/get", authToken, getUserTransactions);

// Notifications
router.get("/tr-notifications/get", authToken, getUserTransactionNotifications);
router.patch("/tr-notifications/read/:notificationId", authToken, markNotificationAsRead);
router.delete("/tr-notifications/delete/:notificationId", authToken, deleteNotification);
router.put("/tr-notifications/read-all", authToken, markAllNotificationsAsRead);
router.delete("/tr-notifications/all", authToken, deleteAllNotifications);
router.get("/report/notifications", authToken, getUserReportNotifications);
router.get("/report-details/:reportId", authToken, fetchReportDetails);
router.get("/user-report-details/:reportId", authToken, getReportDetailsController);
router.get("/unread-notificationCount", authToken, getUnreadNotificationCount);
router.get("/get-new-notifications", authToken, getNewNotifications);
router.get("/get-market-notifications", authToken, getMarketNotifications);

// Profile

router.get("/profile", authToken, userProfileController.userProfileController);
router.get("/profile/bank-accounts", authToken, userProfileController.getUserBankAccountsController);
router.get("/profile/wallet-balance", authToken, userProfileController.getUserWalletBalanceController);
router.put("/profile/edit", authToken, userProfileController.editProfileController);


// Community
router.get("/posts/approved", getApprovedPostsController);
router.post("/posts/submit", authToken, submitNewPostController);
router.delete("/posts/:postId/delete", authToken, deletePostController);
router.post("/posts/:postId/comment", authToken, addCommentController);

// Admin community
router.get("/community/pending", authToken, getPendingPostsController);
router.put("/community/post/:postId/approve", authToken, approvePostController);
router.put("/community/post/:postId/reject", authToken, rejectPostController);
router.get("/myposts", authToken, getUserPostsController);

export default router;
