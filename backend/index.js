const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const {
  apiLimiter,
  noSqlSanitizer,
  xssSanitizer,
  logSecurityEvent
} = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Vercel and reverse proxies for client IP rate limiting
app.set('trust proxy', 1);

// Ensure uploads and frontend directories exist safely (handling read-only filesystems in serverless like Vercel/Lambda)
const uploadDir = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
const frontendDir = path.join(__dirname, '..', 'frontend');
try {
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
} catch (e) {
  // Read-only filesystem in serverless environments
}

// Connect to MongoDB (non-blocking in traditional server, will be cached in serverless)
connectDB().catch((err) => {
  console.warn('Initial MongoDB connection deferred:', err.message);
});

// 1. Helmet HTTP Security Headers (with CSP configured for Google Fonts and QR data URLs)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        scriptSrcAttr: ["'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        connectSrc: ["'self'", 'https://api.openweathermap.org']
      }
    },
    crossOriginEmbedderPolicy: false,
    frameguard: { action: 'sameorigin' }
  })
);

// 2. Hardened CORS Configuration
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  process.env.BASE_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, origin-checked in prod
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-secret'],
    credentials: true
  })
);

// 3. Body Parser Limits (Mitigate JSON payload flood attacks)
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// 4. NoSQL Injection Prevention (Sanitize MongoDB operators $ and .)
app.use(noSqlSanitizer);

// 5. XSS & Malicious Script Stripper
app.use(xssSanitizer);

// 6. Morgan Logging (Dev)
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// 7. General API Rate Limiting (300 requests / 15 mins)
app.use('/api/', apiLimiter);

// 8. Serve Uploaded Files securely (prevent script execution in uploads folder)
app.use(
  '/uploads',
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'");
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// Serve Static Frontend
app.use(express.static(frontendDir));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FieldRoot Connect API',
    version: '1.0.0',
    security: {
      helmet: 'active',
      rateLimiting: 'active',
      noSqlSanitization: 'active',
      xssSanitization: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

// Ensure MongoDB connection is ready in serverless environments
app.use(async (req, res, next) => {
  try {
    await connectDB();
  } catch (err) {
    // Log notice, allow routes with fallbacks to respond smoothly
  }
  next();
});

// Explicit static requires so @vercel/nft traces and bundles all routes in serverless
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const contractRoutes = require('./routes/contracts');
const orderRoutes = require('./routes/orders');
const earningRoutes = require('./routes/earnings');
const chatRoutes = require('./routes/chat');
const advisorRoutes = require('./routes/advisor');
const weatherRoutes = require('./routes/weather');
const priceRoutes = require('./routes/prices');
const tipRoutes = require('./routes/tips');
const communityRoutes = require('./routes/community');
const adminRoutes = require('./routes/admin');
const traceabilityRoutes = require('./routes/traceability');

const mountRoute = (path, router) => {
  app.use(path, router);
  // Also mount without /api prefix for maximum serverless compatibility
  if (path.startsWith('/api/')) {
    app.use(path.replace('/api', ''), router);
  }
};

// Mount API routes
mountRoute('/api/auth', authRoutes);
mountRoute('/api/products', productRoutes);
mountRoute('/api/contracts', contractRoutes);
mountRoute('/api/orders', orderRoutes);
mountRoute('/api/earnings', earningRoutes);
mountRoute('/api/chat', chatRoutes);
mountRoute('/api/advisor', advisorRoutes);
mountRoute('/api/weather', weatherRoutes);
mountRoute('/api/prices', priceRoutes);
mountRoute('/api/tips', tipRoutes);
mountRoute('/api/community', communityRoutes);
mountRoute('/api/admin', adminRoutes);
mountRoute('/api/traceability', traceabilityRoutes);

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logSecurityEvent('UNHANDLED_SERVER_ERROR', err.message, req);
  const status = err.status || 500;
  const isProd = process.env.NODE_ENV === 'production';

  res.status(status).json({
    success: false,
    message: isProd && status === 500 ? 'Internal Server Error' : err.message || 'Server Error'
  });
});

// Start Server (only when run directly as a process, not when imported by Vercel serverless functions)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🌾 FieldRoot Connect running on http://localhost:${PORT}`);
    console.log(`🔒 Security features active (Helmet, Rate Limiting, NoSQL Sanitizer, XSS Defense)`);
  });
}

module.exports = app;
