import express from 'express';
import axios from 'axios';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import { createHash, randomBytes } from 'crypto';
import { Server } from 'socket.io';

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
import { sendResetCode, verifyReset } from '../controller/user/resetController.js';
import { resendVerificationEmailController } from '../controller/user/resendVerificationEmailController.js';
import { getPaystackBanks, resolveBankAccount, } from '../controller/wallet/paystackController.js';
import { getUserEthWallet, saveEthWalletAddress, withdrawEth } from '../controller/wallet/ethWalletController.js';
import { createEthWithdrawalRequest, getAllEthWithdrawalRequests, getEthWithdrawalStatus, getSingleEthWithdrawalRequest, updateEthWithdrawalStatus } from '../controller/ethWithdrawalController.js';
import { generateSliderVerification } from "../utils/sliderVerification.js";

const router = express.Router();

// ============================================================================
// ENHANCED SECURITY & PERFORMANCE CONFIGURATIONS
// ============================================================================

// Advanced Cache with TTL and memory management
class AdvancedCache {
    constructor(maxSize = 1000, defaultTTL = 5 * 60 * 1000) {
        this.cache = new Map();
        this.maxSize = maxSize;
        this.defaultTTL = defaultTTL;
        this.accessTimes = new Map();

        // Clean expired entries every 5 minutes
        setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    set(key, value, ttl = this.defaultTTL) {
        // Remove oldest entries if cache is full
        if (this.cache.size >= this.maxSize) {
            this.evictLRU();
        }

        this.cache.set(key, {
            data: value,
            expiry: Date.now() + ttl,
            created: Date.now()
        });
        this.accessTimes.set(key, Date.now());
    }

    get(key) {
        const item = this.cache.get(key);
        if (!item) return null;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.accessTimes.delete(key);
            return null;
        }

        this.accessTimes.set(key, Date.now());
        return item.data;
    }

    has(key) {
        const item = this.cache.get(key);
        if (!item) return false;

        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            this.accessTimes.delete(key);
            return false;
        }

        return true;
    }

    evictLRU() {
        let oldestKey = null;
        let oldestTime = Date.now();

        for (const [key, time] of this.accessTimes) {
            if (time < oldestTime) {
                oldestTime = time;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            this.accessTimes.delete(oldestKey);
        }
    }

    cleanup() {
        const now = Date.now();
        for (const [key, item] of this.cache) {
            if (now > item.expiry) {
                this.cache.delete(key);
                this.accessTimes.delete(key);
            }
        }
        console.log(`[Cache] Cleanup completed. Current size: ${this.cache.size}`);
    }

    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            hitRate: this.hitRate || 0
        };
    }
}

const cache = new AdvancedCache(2000, 5 * 60 * 1000);

// Enhanced Rate Limiting
const createRateLimit = (windowMs, max, message, skipSuccessfulRequests = false) =>
    rateLimit({
        windowMs,
        max,
        message: { error: message, retryAfter: Math.ceil(windowMs / 1000) },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests,
        keyGenerator: (req) => {
            // Use IP + User-Agent for better identification
            const userAgent = req.get('User-Agent') || 'unknown';
            const userAgentHash = createHash('sha256').update(userAgent).digest('hex').substring(0, 8);
            return `${req.ip}_${userAgentHash}`;
        }
    });

// Different rate limits for different endpoint types
const authRateLimit = createRateLimit(15 * 60 * 1000, 5, 'Too many authentication attempts');
const apiRateLimit = createRateLimit(15 * 60 * 1000, 100, 'Too many API requests');
const uploadRateLimit = createRateLimit(60 * 60 * 1000, 10, 'Too many upload attempts');
const strictRateLimit = createRateLimit(5 * 60 * 1000, 20, 'Too many requests');

// Security Headers
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "wss:", "ws:"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            objectSrc: ["'none'"],
            mediaSrc: ["'self'"],
            frameSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false
});

// Enhanced CORS
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Socket-ID']
};

// Request ID middleware for tracing
const requestId = (req, res, next) => {
    req.requestId = randomBytes(16).toString('hex');
    res.setHeader('X-Request-ID', req.requestId);
    next();
};

// Enhanced logging middleware
const enhancedLogger = (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;

    res.send = function(data) {
        const duration = Date.now() - start;
        const size = Buffer.byteLength(JSON.stringify(data || ''), 'utf8');

        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${size}bytes - ID:${req.requestId}`);

        originalSend.call(this, data);
    };

    next();
};

// Apply middleware
router.use(compression());
router.use(cors(corsOptions));
router.use(securityHeaders);
router.use(requestId);
router.use(enhancedLogger);

// ============================================================================
// SOCKET.IO INTEGRATION & REAL-TIME FEATURES
// ============================================================================

let io = null;

// Initialize Socket.IO
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: corsOptions,
        transports: ['websocket', 'polling'],
        upgradeTimeout: 30000,
        pingTimeout: 25000,
        pingInterval: 25000,
        allowEIO3: true
    });

    // Socket authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

            if (!token) {
                return next(new Error('Authentication token required'));
            }

            // Verify token (implement your token verification logic)
            const user = await verifySocketToken(token);
            socket.userId = user.id;
            socket.userRole = user.role;

            next();
        } catch (error) {
            next(new Error('Authentication failed'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`[Socket] User ${socket.userId} connected: ${socket.id}`);

        // Join user-specific room
        socket.join(`user_${socket.userId}`);

        // Join role-specific rooms
        if (socket.userRole === 'admin') {
            socket.join('admin_room');
        }

        // Handle real-time subscriptions
        socket.on('subscribe', (data) => {
            const { channel } = data;
            const allowedChannels = [
                `notifications_${socket.userId}`,
                `wallet_${socket.userId}`,
                `reports_${socket.userId}`,
                `market_updates`,
                `eth_price`
            ];

            if (allowedChannels.includes(channel)) {
                socket.join(channel);
                console.log(`[Socket] User ${socket.userId} subscribed to ${channel}`);
            }
        });

        socket.on('unsubscribe', (data) => {
            const { channel } = data;
            socket.leave(channel);
            console.log(`[Socket] User ${socket.userId} unsubscribed from ${channel}`);
        });

        socket.on('disconnect', (reason) => {
            console.log(`[Socket] User ${socket.userId} disconnected: ${reason}`);
        });

        // Send initial connection success
        socket.emit('connected', {
            message: 'Connected successfully',
            userId: socket.userId,
            socketId: socket.id
        });
    });

    return io;
};

// Real-time event emitters
export const emitToUser = (userId, event, data) => {
    if (io) {
        io.to(`user_${userId}`).emit(event, data);
    }
};

export const emitToChannel = (channel, event, data) => {
    if (io) {
        io.to(channel).emit(event, data);
    }
};

export const emitToAdmins = (event, data) => {
    if (io) {
        io.to('admin_room').emit(event, data);
    }
};

// Token verification for socket authentication
const verifySocketToken = async (token) => {
    // Implement your token verification logic here
    // This should return user object with id and role
    return { id: 'user123', role: 'user' }; // Placeholder
};

// ============================================================================
// ENHANCED API ROUTES WITH REAL-TIME INTEGRATION
// ============================================================================

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced axios retry with circuit breaker pattern
 */
class CircuitBreaker {
    constructor(threshold = 5, timeout = 60000) {
        this.failureThreshold = threshold;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = null;
        this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    }

    async execute(fn) {
        if (this.state === 'OPEN') {
            if (Date.now() - this.lastFailureTime > this.timeout) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error('Circuit breaker is OPEN');
            }
        }

        try {
            const result = await fn();
            this.onSuccess();
            return result;
        } catch (error) {
            this.onFailure();
            throw error;
        }
    }

    onSuccess() {
        this.failureCount = 0;
        this.state = 'CLOSED';
    }

    onFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();

        if (this.failureCount >= this.failureThreshold) {
            this.state = 'OPEN';
        }
    }
}

const circuitBreaker = new CircuitBreaker(3, 30000);

async function axiosGetWithRetry(url, options = {}, retries = 3, backoff = 500) {
    return circuitBreaker.execute(async () => {
        try {
            console.log(`[axiosGetWithRetry] Attempting GET: ${url}`);
            const response = await axios.get(url, {
                ...options,
                timeout: 10000,
                headers: {
                    'User-Agent': 'SXN-API/1.0',
                    ...options.headers
                }
            });
            return response;
        } catch (error) {
            const status = error.response?.status;
            console.error(`[axiosGetWithRetry] Error: ${url} | Status: ${status} | Retries: ${retries}`);

            if (status === 401 || status === 429 || retries === 0) {
                throw error;
            }

            await sleep(backoff);
            return axiosGetWithRetry(url, options, retries - 1, backoff * 2);
        }
    });
}

// Enhanced ETH Price endpoint with real-time updates
router.get('/eth-price', apiRateLimit, async (req, res) => {
    const cacheKey = 'eth-price';
    const now = Date.now();

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        res.json(cachedData);

        // Emit real-time update
        emitToChannel('eth_price', 'price_update', cachedData);
        return;
    }

    try {
        const { data } = await axiosGetWithRetry('https://api.coingecko.com/api/v3/simple/price', {
            params: { ids: 'ethereum', vs_currencies: 'ngn,usd' }
        });

        cache.set(cacheKey, data, 2 * 60 * 1000); // 2 minutes TTL

        // Emit real-time update to all subscribers
        emitToChannel('eth_price', 'price_update', data);

        res.json(data);
    } catch (error) {
        console.error(`[eth-price] Fetch failed:`, error.message);
        res.status(500).json({
            message: 'Error fetching ETH price',
            error: error.message,
            requestId: req.requestId
        });
    }
});

// Enhanced slider verification with additional security
router.get("/slider-verification", strictRateLimit, (req, res) => {
    try {
        const { target, signature } = generateSliderVerification();
        const timestamp = Date.now();
        const nonce = randomBytes(8).toString('hex');

        res.json({
            target,
            signature,
            timestamp,
            nonce,
            expiresIn: 300000 // 5 minutes
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error generating verification',
            requestId: req.requestId
        });
    }
});

// ============================================================================
// AUTHENTICATION ROUTES WITH REAL-TIME FEATURES
// ============================================================================

router.post("/signup", authRateLimit, async (req, res) => {
    try {
        await userSignUpController(req, res);

        // Notify admins of new signup
        emitToAdmins('new_signup', {
            userId: req.body.email,
            timestamp: new Date(),
            ip: req.ip
        });
    } catch (error) {
        console.error('[Signup Error]:', error);
        res.status(500).json({ message: 'Signup failed', requestId: req.requestId });
    }
});

router.post("/signin", authRateLimit, async (req, res) => {
    try {
        await userSignInController(req, res);

        // Real-time login notification
        if (res.statusCode === 200) {
            const userId = req.user?.id; // Assuming user ID is available
            emitToUser(userId, 'login_success', {
                timestamp: new Date(),
                ip: req.ip,
                userAgent: req.get('User-Agent')
            });
        }
    } catch (error) {
        console.error('[Signin Error]:', error);
        res.status(500).json({ message: 'Signin failed', requestId: req.requestId });
    }
});

// ============================================================================
// ENHANCED ROUTES WITH REAL-TIME NOTIFICATIONS
// ============================================================================

// Wallet routes with real-time balance updates
router.get("/wallet/balance", authToken, apiRateLimit, async (req, res) => {
    try {
        await getWalletBalance(req, res);

        // Emit real-time balance update
        if (res.statusCode === 200) {
            emitToUser(req.userId, 'wallet_balance_update', res.locals.walletData);
        }
    } catch (error) {
        console.error('[Wallet Balance Error]:', error);
        res.status(500).json({ message: 'Failed to get balance', requestId: req.requestId });
    }
});

// Enhanced notification routes with real-time delivery
router.get("/tr-notifications/get", authToken, apiRateLimit, async (req, res) => {
    try {
        await getUserTransactionNotifications(req, res);
    } catch (error) {
        console.error('[Notifications Error]:', error);
        res.status(500).json({ message: 'Failed to get notifications', requestId: req.requestId });
    }
});

router.patch("/tr-notifications/read/:notificationId", authToken, strictRateLimit, async (req, res) => {
    try {
        await markNotificationAsRead(req, res);

        // Real-time notification update
        emitToUser(req.userId, 'notification_read', {
            notificationId: req.params.notificationId,
            timestamp: new Date()
        });
    } catch (error) {
        console.error('[Mark Notification Error]:', error);
        res.status(500).json({ message: 'Failed to mark notification', requestId: req.requestId });
    }
});

// ============================================================================
// ORIGINAL ROUTES WITH ENHANCED SECURITY
// ============================================================================

// Authentication routes
router.get('/verify-email', apiRateLimit, verifyEmailController);
router.get("/user-details", authToken, apiRateLimit, userDetailsController);
router.get("/userLogout", authToken, userLogout);
router.post("/request-reset", authRateLimit, sendResetCode);
router.post("/confirm-reset", authRateLimit, verifyReset);
router.post("/resend-verification", authRateLimit, resendVerificationEmailController);
router.post("/send-bank-code", authToken, strictRateLimit, sendBankAddCode);
router.post("/verify-add-bank", authToken, strictRateLimit, verifyAndAddBankAccount);

// Admin panel routes
router.get("/all-user", authToken, apiRateLimit, allUsers);
router.post("/update-user", authToken, strictRateLimit, updateUser);
router.get("/get-all-users-market", authToken, apiRateLimit, getAllUserMarkets);
router.post("/update-market-status/:id", authToken, strictRateLimit, updateMarketStatus);
router.get("/getAllDataForAdmin", authToken, apiRateLimit, getAllUserDataPadsForAdmin);
router.delete("/delete-user", authToken, strictRateLimit, deleteUser);

// Wallet routes
router.get("/wallet/balane/:userId", authToken, apiRateLimit, getOtherUserWalletBalance);

// ETH routes
router.post("/save-eth-address", authToken, strictRateLimit, saveEthWalletAddress);
router.get("/eth-wallet", authToken, apiRateLimit, getUserEthWallet);
router.post("/eth/withdrawal-request", authToken, strictRateLimit, createEthWithdrawalRequest);
router.get("/eth/get-withdrawal-status", authToken, apiRateLimit, getEthWithdrawalStatus);

// Admin ETH routes
router.get("/eth-withdrawals", authToken, apiRateLimit, getAllEthWithdrawalRequests);
router.get("/eth-withdrawal/:requestId", authToken, apiRateLimit, getSingleEthWithdrawalRequest);
router.put("/eth-withdrawal-status/:requestId", authToken, strictRateLimit, updateEthWithdrawalStatus);

// Product routes
router.post("/upload-product", authToken, uploadRateLimit, UploadProductController);
router.get("/get-product", apiRateLimit, getProductController);
router.post("/update-product", authToken, strictRateLimit, updateProductController);
router.get("/get-categoryProduct", apiRateLimit, getCategoryProduct);
router.post("/category-product", apiRateLimit, getCategoryWiseProduct);
router.post("/product-details", apiRateLimit, getProductDetails);
router.get("/search", apiRateLimit, SearchProduct);
router.post("/filter-product", apiRateLimit, filterProductController);

// User market routes
router.post("/upload-market", authToken, uploadRateLimit, UserUploadMarketController);
router.get("/get-market", authToken, apiRateLimit, getMarketController);
router.get("/get-market/:marketId", authToken, apiRateLimit, getMarketByIdController);
router.get("/market-record", authToken, apiRateLimit, marketRecordController);

// System blog routes
router.post("/create-blog", authToken, strictRateLimit, createBlogNote);
router.get("/get-blogs", apiRateLimit, getAllBlogNotes);
router.put("/update-blog/:id", authToken, strictRateLimit, updateBlogNote);
router.delete("/delete-blog/:id", authToken, strictRateLimit, deleteBlogNote);

// Reports routes
router.post("/submit-report", authToken, strictRateLimit, submitReportController);
router.get("/get-reports", authToken, apiRateLimit, getUserReportsController);
router.get("/all-reports", authToken, apiRateLimit, getAllReportsController);
router.post("/reply-report/:id", authToken, strictRateLimit, replyToReportController);
router.post("/reports/:id/reply", authToken, strictRateLimit, userReplyReportController);
router.get("/reports/admin/:id/chat", authToken, apiRateLimit, getReportChatController);
router.post("/reports/admin/:id/sendchat", authToken, strictRateLimit, sendChatMessageController);

// DataPad routes
router.get("/alldata", authToken, apiRateLimit, getAllDataPads);
router.post("/createdata", authToken, strictRateLimit, createDataPad);
router.put("/updatedata/:id", authToken, strictRateLimit, updateDataPad);
router.delete("/deletedata/:id", authToken, strictRateLimit, deleteDataPad);

// Contact us routes
router.post("/contact-us-message", strictRateLimit, createContactUsMessage);
router.get("/get-contact-us-messages", authToken, apiRateLimit, getAllContactUsMessages);

// Payment request routes
router.post("/pr/create", authToken, strictRateLimit, createPaymentRequest);
router.get("/pr/getall", authToken, apiRateLimit, getAllPaymentRequests);
router.get("/pr/getuser", authToken, apiRateLimit, getUserPaymentRequests);
router.patch("/pr/update/:id", authToken, strictRateLimit, updatePaymentRequestStatus);

// Bank account routes
router.post("/ba/add", authToken, strictRateLimit, addBankAccount);
router.get("/ba/get", authToken, apiRateLimit, getBankAccounts);
router.delete("/ba/delete/:accountId", authToken, strictRateLimit, deleteBankAccount);
router.post('/verify-account', authToken, strictRateLimit, resolveBankAccount);
router.get('/banks', authToken, apiRateLimit, getPaystackBanks);

// Transaction routes
router.get("/transactions/get", authToken, apiRateLimit, getUserTransactions);

// Remaining notification routes
router.delete("/tr-notifications/delete/:notificationId", authToken, strictRateLimit, deleteNotification);
router.put("/tr-notifications/read-all", authToken, strictRateLimit, markAllNotificationsAsRead);
router.delete("/tr-notifications/all", authToken, strictRateLimit, deleteAllNotifications);
// Rate limit removed from these notification endpoints:
router.get("/report/notifications", authToken, getUserReportNotifications);
router.get("/report-details/:reportId", authToken, fetchReportDetails);
router.get("/user-report-details/:reportId", authToken, getReportDetailsController);
router.get("/unread-notificationCount", authToken, getUnreadNotificationCount);
router.get("/get-new-notifications", authToken, getNewNotifications);
router.get("/get-market-notifications", authToken, getMarketNotifications);

// Profile routes
router.get("/profile", authToken, apiRateLimit, userProfileController.userProfileController);
router.get("/profile/bank-accounts", authToken, apiRateLimit, userProfileController.getUserBankAccountsController);
router.get("/profile/wallet-balance", authToken, apiRateLimit, userProfileController.getUserWalletBalanceController);
router.put("/profile/edit", authToken, strictRateLimit, userProfileController.editProfileController);

// Community routes
router.get("/posts/approved", apiRateLimit, getApprovedPostsController);
router.post("/posts/submit", authToken, strictRateLimit, submitNewPostController);
router.delete("/posts/:postId/delete", authToken, strictRateLimit, deletePostController);
router.post("/posts/:postId/comment", authToken, strictRateLimit, addCommentController);

// Admin community routes
router.get("/community/pending", authToken, apiRateLimit, getPendingPostsController);
router.put("/community/post/:postId/approve", authToken, strictRateLimit, approvePostController);
router.put("/community/post/:postId/reject", authToken, strictRateLimit, rejectPostController);
router.get("/myposts", authToken, apiRateLimit, getUserPostsController);

// ============================================================================
// HEALTH CHECK & MONITORING ROUTES
// ============================================================================

router.get('/health', (req, res) => {
    try {
        const health = {
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cache: cache.getStats(),
            requestId: req.requestId
        };
        res.json(health);
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Health check failed.',
            error: error.message,
            requestId: req.requestId
        });
    }
});

// ============================================================================
// NOT FOUND & ERROR HANDLING
// ============================================================================

// Catch-all 404 handler for undefined routes
router.use((req, res, next) => {
    res.status(404).json({
        message: "The requested resource was not found on this server.",
        path: req.originalUrl,
        requestId: req.requestId
    });
});

// Global error handler
router.use((error, req, res, next) => {
    console.error(`[Global Error Handler] ID: ${req.requestId}`, error);

    const isProduction = process.env.NODE_ENV === 'production';

    res.status(error.status || 500).json({
        message: isProduction ? "An unexpected error occurred." : error.message || "Internal Server Error.",
        error: isProduction ? undefined : error.stack,
        requestId: req.requestId
    });
});

// ============================================================================
// EXPORT ROUTER
// ============================================================================

export default router;