import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';
import mongoose from 'mongoose';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Determine allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || '',
  'https://secxion.onrender.com',
  'http://localhost:3000', // Dev frontend
  'http://localhost:5000', // Dev backend
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow requests with no origin (like Postman or curl)
      callback(null, true);
    } else {
      console.warn(`❌ Blocked by CORS: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Security & Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// API routing
app.use('/api', router);

// Serve frontend static build
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, 'build'); // built by the script

// Serve only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
      if (err) res.status(500).send(err);
    });
  });
}

if (process.env.NODE_ENV !== 'production') {
  console.log("✅ Connected to MongoDB at:", db.host);
}


// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

// Start server after DB connection
const PORT = process.env.PORT || 5000;



connectDB()
  .then(() => {
    const db = mongoose.connection;
    console.log(`✅ Connected to MongoDB at: ${db.host}:${db.port}/${db.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('🌐 Allowed CORS origins:', allowedOrigins);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
