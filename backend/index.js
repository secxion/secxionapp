const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const router = require('./routes');
const app = express();

// Define the allowed origins
const allowedOrigins = [
    process.env.FRONTEND_URL, // For the live Render frontend
];

// Configure CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) { // Allow requests from allowed origins and no origin (e.g., mobile apps)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Enable JSON body parsing
app.use(express.json());

// Enable cookie parsing
app.use(cookieParser());

// Mount your API routes
app.use("/api", router);

// Define the port for the server
const PORT = process.env.PORT || 5000;

// Connect to the database and start the server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Connected to MongoDB");
            console.log(`Server is running on port ${PORT}`);
            console.log("Allowed CORS origins:", allowedOrigins);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit the process if database connection fails
    });