const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const app = express();
const mongoose = require('mongoose');

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'https://secxion.onrender.com', 
    "https://secxionx.onrender.com",
];

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) { 
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', router, (req, res, next) => {
    const token = "test_token";
    const tokenOption = {
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: true,  
        sameSite: 'none', 
        path: '/'
    };
    res.cookie("token", token, tokenOption);
    next();
});

app.use('/api', router);

const PORT = process.env.PORT || 5000;

connectDB()
    .then(async () => {
        const db = mongoose.connection; 
        console.log("index.js: Connected to MongoDB at:", db.host, db.port, db.name);

        app.listen(PORT, () => {
            console.log("Connected to MongoDB");+
            console.log("index.js: Server is running on port", PORT);
            console.log("index.js: Allowed CORS origins:", allowedOrigins);
        });
    })
    .catch((error) => {
        console.error("index.js: Error connecting to MongoDB:", error);
        process.exit(1);
    });
