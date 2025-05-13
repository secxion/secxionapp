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

// ES Modules fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Init app
const app = express();

// Allowable frontend origins
const allowedOrigins = [
  process.env.FRONTEND_URL || '',
  'https://secxion.onrender.com',
  'https://secxionx.onrender.com',
];

// CORS config
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
};

// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// API Routes
app.use('/api', router);

const frontendBuildPath = path.join(__dirname, '../frontend/build');

app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

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
