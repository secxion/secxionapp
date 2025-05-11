import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL || '',
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
app.use('/api', router);


const PORT = process.env.PORT || 5000;

connectDB()
    .then(async () => {
        const db = mongoose.connection;
        console.log("index.js: Connected to MongoDB at:", db.host, db.port, db.name);

        app.listen(PORT, () => {
            console.log("index.js: Server is running on port", PORT);
            console.log("index.js: Allowed CORS origins:", allowedOrigins);
        });
    })
    .catch((error) => {
        console.error("index.js: Error connecting to MongoDB:", error);
        process.exit(1);
    });