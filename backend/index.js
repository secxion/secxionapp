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

// Handle __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to React build folder (corrected)
const frontendBuildPath = path.join(__dirname, '../frontend/build');

// ✅ CORS config: allow all origins (temporary for dev / mobile)
const corsOptions = {
  origin: true, // reflects request origin
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// ✅ Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// ✅ API Routes
app.use('/api', router);

// ✅ Serve React frontend (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
      if (err) res.status(500).send(err);
    });
  });
}

const PORT = process.env.PORT || 5000;

// ✅ Start the server
connectDB()
  .then(() => {
    const db = mongoose.connection;
    console.log(`✅ Connected to MongoDB at: ${db.host}:${db.port}/${db.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log('🌐 CORS: all origins allowed (for mobile/dev)');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
