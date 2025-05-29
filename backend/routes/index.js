import express from 'express';
import passport from 'passport';
import axios from 'axios';

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
import { getUserEthWallet, saveEthWalletAddress, withdrawEth } from '../controller/wallet/ethWalletController.js';
import { createEthWithdrawalRequest, getAllEthWithdrawalRequests, updateEthWithdrawalStatus } from '../controller/ethWithdrawalController.js';

const router = express.Router();

// Cache structure: { [key: string]: { data: any, expiry: number } }
const cache = {};

// Cache TTL in milliseconds (20 minutes)
const CACHE_TTL = 5 * 60 * 1000; // 20 minutes

// Helper: sleep for ms
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry axios GET with exponential backoff and logging
 * @param {string} url - request URL
 * @param {object} options - axios options
 * @param {number} retries - max retry attempts
 * @param {number} backoff - initial backoff delay in ms
 */
async function axiosGetWithRetry(url, options = {}, retries = 3, backoff = 500) {
  try {
    console.log(`[axiosGetWithRetry] Attempting GET: ${url} with params:`, options.params);
    const response = await axios.get(url, options);
    console.log(`[axiosGetWithRetry] Success GET: ${url}`);
    return response;
  } catch (error) {
    const status = error.response?.status;
    console.error(`[axiosGetWithRetry] Error GET: ${url} | Status: ${status} | Retries left: ${retries} | Error: ${error.message}`);

    // Do NOT retry on 401 Unauthorized or 429 Too Many Requests
    if (status === 401 || status === 429) {
      console.warn(`[axiosGetWithRetry] Not retrying due to status ${status}`);
      throw error;
    }

    if (retries === 0) throw error;
    await sleep(backoff);
    return axiosGetWithRetry(url, options, retries - 1, backoff * 2);
  }
}


// Updated /eth-price route with cache pattern
router.get('/eth-price', async (req, res) => {
  const cacheKey = 'eth-price';
  const now = Date.now();

  const sendCachedResponse = () => {
    console.log(`[eth-price] Serving cached data immediately`);
    res.json(cache[cacheKey].data);
  };

  const fetchAndUpdateCache = async () => {
    try {
      const { data } = await axiosGetWithRetry('https://api.coingecko.com/api/v3/simple/price', {
        params: { ids: 'ethereum', vs_currencies: 'ngn' },
      });
      cache[cacheKey] = { data, expiry: Date.now() + CACHE_TTL };
      console.log(`[eth-price] Cache updated in background`);
    } catch (error) {
      console.error(`[eth-price] Background fetch failed:`, error.message);
    }
  };

  if (cache[cacheKey] && cache[cacheKey].expiry > now) {
    // Cache valid: respond immediately with cache, then update cache in background
    sendCachedResponse();
    fetchAndUpdateCache();
    return;
  }

  // Cache expired or missing: try fetch fresh data
  try {
    const { data } = await axiosGetWithRetry('https://api.coingecko.com/api/v3/simple/price', {
      params: { ids: 'ethereum', vs_currencies: 'ngn' },
    });
    cache[cacheKey] = { data, expiry: Date.now() + CACHE_TTL };
    console.log(`[eth-price] Fresh data fetched and cached`);
    res.json(data);
  } catch (error) {
    console.error(`[eth-price] Fetch failed:`, error.message);
    if (cache[cacheKey]) {
      // stale cache exists, respond with stale cache
      console.log(`[eth-price] Returning stale cached data due to fetch failure`);
      sendCachedResponse();
    } else {
      // no cache at all
      res.status(500).json({ message: 'Error fetching ETH price', error: error.message });
    }
  }
});

// Updated /eth-trend route with cache pattern
router.get('/eth-trend', async (req, res) => {
  const cacheKey = 'eth-trend';
  const now = Date.now();

  const sendCachedResponse = () => {
    console.log(`[eth-trend] Serving cached data immediately`);
    res.json(cache[cacheKey].data);
  };

const fetchAndUpdateCache = async () => {
  try {
    const { data } = await axiosGetWithRetry('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
      params: { vs_currency: 'ngn', days: '1', interval: 'hourly' },
    });

    if (!data || !data.prices) {
      throw new Error('Unexpected data format from CoinGecko market_chart endpoint');
    }

    cache[cacheKey] = { data, expiry: Date.now() + CACHE_TTL };
    console.log(`[eth-trend] Cache updated in background`);
  } catch (error) {
    console.error(`[eth-trend] Background fetch failed (ignored):`, error.message);
    // Swallow the error so server keeps running
  }
};

  if (cache[cacheKey] && cache[cacheKey].expiry > now) {
    // Cache valid: respond immediately with cache, then update cache in background
    sendCachedResponse();
    fetchAndUpdateCache();
    return;
  }

  // Cache expired or missing: try fetch fresh data
  try {
    const { data } = await axiosGetWithRetry('https://api.coingecko.com/api/v3/coins/ethereum/market_chart', {
      params: { vs_currency: 'ngn', days: '1', interval: 'hourly' },
    });

    if (!data || !data.prices) {
      throw new Error('Unexpected data format from CoinGecko market_chart endpoint');
    }

    cache[cacheKey] = { data, expiry: Date.now() + CACHE_TTL };
    console.log(`[eth-trend] Fresh data fetched and cached`);
    res.json(data);
  } catch (error) {
    console.error(`[eth-trend] Fetch failed:`, error.message);
    if (cache[cacheKey]) {
      // stale cache exists, respond with stale cache
      console.log(`[eth-trend] Returning stale cached data due to fetch failure`);
      sendCachedResponse();
    } else {
      // no cache at all
      res.status(500).json({ message: 'Error fetching ETH trend', error: error.message });
    }
  }
});

// -----------------
// The rest of your routes unchanged below...

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

// Admin panel
router.get("/all-user", authToken, allUsers);
router.post("/update-user", authToken, updateUser);
router.get("/get-all-users-market", authToken, getAllUserMarkets);
router.post("/update-market-status/:id", updateMarketStatus);
router.get("/getAllDataForAdmin", authToken, getAllUserDataPadsForAdmin);
router.delete("/delete-user", deleteUser);


// Wallet balance
router.get("/wallet/balane/:userId", authToken, getOtherUserWalletBalance);

// ETH
router.post("/save-eth-address", authToken, saveEthWalletAddress);
router.get("/eth-wallet", authToken, getUserEthWallet);
router.post("/eth/withdrawal-request", authToken, createEthWithdrawalRequest);

// Admin routes
router.get("/all", authToken, getAllEthWithdrawalRequests);
router.put("/update/:requestId", authToken, updateEthWithdrawalStatus);

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
