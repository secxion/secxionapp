import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import router from './routes/index.js';
import mongoose from 'mongoose';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

// Always trust proxy (for HTTPS redirects if you want to add them manually later)
app.set('trust proxy', 1);

// Remove HTTPS redirect middleware; add manually if needed

// Parse allowed origins from env, fallback empty array
const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map(origin => origin.trim())
  : [];

// CORS config
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like curl or server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('❌ Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(xss());
app.use(mongoSanitize());

// API routes
app.use('/api', router);

// Serve frontend build static files (always enabled)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendBuildPath = path.join(__dirname, 'client_build');
app.use(express.static(frontendBuildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) res.status(500).send(err);
  });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    const db = mongoose.connection;
    console.log(`✅ MongoDB Connected at ${db.host}:${db.port}/${db.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log('🌐 Allowed origins:', allowedOrigins);
    });
  })
  .catch((err) => {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1);
  });
