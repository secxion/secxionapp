import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// ====== CORS Setup ======
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://secxion.onrender.com',
    'https://secxionx.onrender.com',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// ====== API Routes ======
app.use('/api', router);

// ====== Optional: Test Cookie Middleware (for debugging only) ======
// Remove this in production if not required
app.use('/api', (req, res, next) => {
    const token = "test_token";
    const tokenOptions = {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
    };
    res.cookie('token', token, tokenOptions);
    console.log("Cookie 'token' set with options:", tokenOptions);
    next();
});

// ====== Serve Frontend in Production ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
    const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
    app.use(express.static(frontendPath));

    // Only serve index.html for non-static routes
    app.get('*', (req, res, next) => {
        if (req.path.startsWith('/static/')) {
            return next(); // Let express.static handle it
        }
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// ====== Start Server ======
const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        const db = mongoose.connection;
        console.log(`Connected to MongoDB at ${db.host}:${db.port}/${db.name}`);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log("Allowed CORS origins:", allowedOrigins);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    });
