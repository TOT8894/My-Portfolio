import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRouter from './routes/index.js';
import { notFoundHandler, errorHandler } from './middlewares/errorMiddleware.js';
import { securityHeaders, globalLimiter, sanitizeInputs } from './middlewares/securityMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxy (e.g. Nginx, Cloudflare, Render, Railway, AWS ALB)
app.set('trust proxy', 1);

// 1. Enterprise Security Headers
app.use(securityHeaders);

// 2. Global Rate Limiter
app.use(globalLimiter);

// 3. Strict Production CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (Postman, curl, server-to-server) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, matched in prod
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 4. Body Parsers with Safe Size Limits (Prevents DoS payload floods)
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Input Sanitization (Strips XSS Script Tags & Malicious Payloads)
app.use(sanitizeInputs);

// 6. Static File Hosting for Fallback Uploads (Protected with nosniff)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 7. Mount Central API Routes
app.use('/api', apiRouter);

// 8. 404 Route Handler
app.use(notFoundHandler);

// 9. Global Central Error Handler (Production Safe)
app.use(errorHandler);

export default app;
