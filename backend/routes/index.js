const express = require('express')
const router = express.Router()

const userSignUpController = require("../controller/user/userSignUp")
const userSignInController = require('../controller/user/userSignin')
const userDetailsController = require('../controller/user/userDetails')
const authToken = require('../middleware/authToken')
const userLogout = require('../controller/user/userLogout')
const allUsers = require('../controller/user/allUsers')
const updateUser = require('../controller/user/UpdateUser')
const UploadProductController = require('../controller/product/uploadProduct')
const getProductController = require('../controller/product/getProduct')
const updateProductController = require('../controller/product/updateProduct')
const getCategoryProduct = require('../controller/product/getCategoryProductOne')
const getCategoryWiseProduct = require('../controller/product/getCategoryWiseProduct')
const getProductDetails = require('../controller/product/getProductDetails')
const SearchProduct = require('../controller/product/searchProduct')
const filterProductController = require('../controller/product/filterProduct')
const UserUploadMarketController = require('../controller/product/userUploadMarket')
const getMarketController = require('../controller/product/getUserMarket')
const marketRecordController = require('../controller/product/marketRecord')
const { getAllUserMarkets, updateMarketStatus } = require('../controller/product/userMarketController')
const { createBlogNote, getAllBlogNotes, updateBlogNote, deleteBlogNote } = require('../controller/blogNoteController')
const submitReportController = require('../controller/user/submitReportController')
const getUserReportsController = require('../controller/user/getUserReportsController')
const { getAllReportsController, replyToReportController } = require('../controller/user/adminReports')
const { getAllDataPads, createDataPad, updateDataPad, deleteDataPad } = require('../controller/dataPadController')
const { createContactUsMessage, getAllContactUsMessages } = require('../controller/contactUsController')
const { getAllUserDataPadsForAdmin } = require('../controller/user/adminDataPadController')
const {getWalletBalance, getOtherUserWalletBalance } = require('../controller/wallet/walletController')
const { createPaymentRequest, getAllPaymentRequests, getUserPaymentRequests, updatePaymentRequestStatus } = require('../controller/wallet/paymentRequestController')
const { addBankAccount, getBankAccounts, deleteBankAccount } = require('../controller/wallet/bankAccounController')
const { getUserTransactions } = require('../controller/wallet/transactionsController')
const { getUserTransactionNotifications, markNotificationAsRead, deleteNotification, markAllNotificationsAsRead, deleteAllNotifications, getUserReportNotifications, fetchReportDetails, getUnreadNotificationCount, getNewNotifications, getMarketNotifications } = require('../controller/notifications/notificationsController')
const getReportDetailsController = require('../controller/user/getReportDetailsController')
const userReplyReportController = require('../controller/report/userReplyReportController')
const getReportChatController = require('../controller/report/getReportChatController')
const sendChatMessageController = require('../controller/report/sendChatMessageController')
const userProfileController = require('../controller/userProfileController')
const getMarketByIdController = require('../controller/product/getMarketByIDController')
const { getApprovedPostsController, submitNewPostController, deletePostController, addCommentController } = require('../controller/user/communityController')
const { getPendingPostsController, approvePostController, rejectPostController } = require('../controller/user/adminCommunityController')
const getUserPostsController = require('../controller/user/getUserPostsController')

router.post("/signup", userSignUpController)
router.post("/signin", userSignInController)
router.get("/user-details", authToken, userDetailsController)
router.get("/userLogout", userLogout)



//admin panel
router.get("/all-user",authToken,allUsers)
router.post("/update-user",authToken,updateUser)
router.get("/get-all-users-market",authToken, getAllUserMarkets)
router.post("/update-market-status/:id", updateMarketStatus)
router.get("/getAllDataForAdmin",getAllUserDataPadsForAdmin)

//walletbalance
router.get("/wallet/balane/:userId",authToken, getOtherUserWalletBalance);


//product
router.post("/upload-product",authToken,UploadProductController)
router.get("/get-product",getProductController)
router.post("/update-product",authToken,updateProductController)
router.get("/get-categoryProduct",getCategoryProduct)
router.post("/category-product",getCategoryWiseProduct)
router.post("/product-details",getProductDetails)
router.get("/search",SearchProduct)
router.post("/filter-product", filterProductController)

//user market
router.post("/upload-market",authToken,UserUploadMarketController)
router.get("/get-market",authToken, getMarketController)
router.get("/get-market/:marketId", authToken, getMarketByIdController);
router.get("/market-record",authToken,marketRecordController)

//system blog
router.post("/create-blog",createBlogNote)
router.get("/get-blogs",getAllBlogNotes)
router.put("/update-blog/:id",updateBlogNote)
router.delete("/delete-blog/:id",deleteBlogNote)

//Report
router.post("/submit-report", authToken, submitReportController);
router.get("/get-reports", authToken, getUserReportsController);
router.get("/all-reports",authToken, getAllReportsController);
router.post("/reply-report/:id",authToken, replyToReportController);
router.post("/reports/:id/reply",authToken, userReplyReportController);
router.get("/reports/admin/:id/chat",authToken, getReportChatController);
router.post("/reports/admin/:id/sendchat",authToken, sendChatMessageController);


//DataPad
router.get("/alldata", authToken, getAllDataPads);
router.post("/createdata", authToken, createDataPad);
router.put("/updatedata/:id", authToken, updateDataPad);
router.delete("/deletedata/:id", authToken, deleteDataPad);

//createContactUsMessage
router.post("/contact-us-message", createContactUsMessage);
router.get("/get-contact-us-messages",  getAllContactUsMessages);

//wallet
router.get("/wallet/balance",authToken, getWalletBalance);

//paymentRequest
router.post("/pr/create",authToken, createPaymentRequest);
router.get("/pr/getall",authToken, getAllPaymentRequests);
router.get("/pr/getuser",authToken, getUserPaymentRequests);
router.patch("/pr/update/:id",authToken,updatePaymentRequestStatus);

//bankAccountLists
router.post("/ba/add",authToken, addBankAccount);
router.get("/ba/get",authToken, getBankAccounts);
router.delete("/ba/delete/:accountId",authToken, deleteBankAccount);

//getUserTransactions
router.get("/transactions/get",authToken, getUserTransactions);

//notifications
router.get("/tr-notifications/get",authToken, getUserTransactionNotifications);
router.patch("/tr-notifications/read/:notificationId", authToken, markNotificationAsRead);
router.delete("/tr-notifications/delete/:notificationId", authToken, deleteNotification);
router.put("/tr-notifications/read-all", authToken, markAllNotificationsAsRead);
router.delete("/tr-notifications/all", authToken, deleteAllNotifications)
router.get('/report/notifications', authToken, getUserReportNotifications);
router.get('/report-details/:reportId', authToken, fetchReportDetails);
router.get('/user-report-details/:reportId', authToken, getReportDetailsController);
router.get('/unread-notificationCount', authToken, getUnreadNotificationCount);
router.get('/get-new-notifications', authToken, getNewNotifications);
router.get('/get-market-notifications', authToken, getMarketNotifications);

//profile
router.get('/profile', authToken, userProfileController);
router.get('/profile/bank-accounts', authToken, userProfileController.getUserBankAccounts);
router.get('/profile/wallet-balance', authToken, userProfileController.getUserWalletBalance);
router.put('/profile/edit', authToken, userProfileController.editProfile);

//community feed
router.get('/posts/approved', getApprovedPostsController);
router.post('/posts/submit', authToken, submitNewPostController);
router.delete('/posts/:postId/delete', authToken, deletePostController);
router.post('/posts/:postId/comment', authToken, addCommentController);

//admin community ct
router.get('/community/pending', authToken, getPendingPostsController); 
router.put('/community/post/:postId/approve', authToken, approvePostController); 
router.put('/community/post/:postId/reject', authToken, rejectPostController);
router.get('/myposts', authToken, getUserPostsController);


module.exports = router