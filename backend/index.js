const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const mongoose = require('mongoose');
const path = require('path');

const app = express();


// ====== CORS Setup ======
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

// ====== API Routes ======
app.use('/api', router, (req, res, next) => {
    console.log("index.js: Received request to /api");
    const token = "test_token";
    const tokenOption = {
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: true,  
        sameSite: 'none', 
        path: '/'
    };
    res.cookie("token", token, tokenOption);
    console.log("index.js: Cookie 'token' set with options:", tokenOption);
    next();
});

// ====== Serve Frontend in Production ======
const __dirnamePath = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirnamePath, 'frontend', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirnamePath, 'frontend', 'build', 'index.html'));
  });
}
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
