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
const isProduction = process.env.NODE_ENV === 'production';

// Trust proxy to handle HTTPS redirection on platforms like Render/Heroku
if (isProduction) {
  app.set('trust proxy', 1);

  // 🔁 Force HTTPS Redirect
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// 🌐 Allowed Origins
const allowedOrigins = [
  process.env.FRONTEND_URL?.trim() || '',
  'https://secxion.onrender.com'
];

// ✅ CORS Config
const corsOptions = {
  origin: (origin, callback) => {
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

// 🛡️ Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(xss()); // 🧼 Sanitize input from XSS
app.use(mongoSanitize()); // 🧽 Prevent NoSQL injection

// 🔀 API Routing
app.use('/api', router);

// 🌐 Serve Frontend in Production
if (isProduction) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const frontendBuildPath = path.join(__dirname, 'client_build');
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
      if (err) res.status(500).send(err);
    });
  });
}

const PORT = process.env.PORT || 5000;

// 🔌 Connect and Start Server
connectDB()
  .then(() => {
    const db = mongoose.connection;
    console.log(`✅ MongoDB Connected at ${db.host}:${db.port}/${db.name}`);

    app.listen(PORT, () => {
      console.log(`🚀 Server running at ${isProduction ? 'https://secxion.onrender.com' : `http://localhost:${PORT}`}`);
      console.log('🌐 Allowed origins:', allowedOrigins);
    });
  })
  .catch((err) => {
    console.error('❌ DB Connection Failed:', err.message);
    process.exit(1);
  });
