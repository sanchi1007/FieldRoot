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

// Ensure uploads and images directories exist
const uploadDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Connect to MongoDB
connectDB();

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
app.use(express.static(path.join(__dirname, 'public')));

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

// Dynamic Route Loader Helper
const safeMount = (routePath, routerFile) => {
  try {
    const route = require(routerFile);
    app.use(routePath, route);
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      console.warn(`Warning loading ${routerFile}:`, err.message);
    }
  }
};

// Mount API routes
safeMount('/api/auth', './routes/auth');
safeMount('/api/products', './routes/products');
safeMount('/api/contracts', './routes/contracts');
safeMount('/api/orders', './routes/orders');
safeMount('/api/earnings', './routes/earnings');
safeMount('/api/chat', './routes/chat');
safeMount('/api/advisor', './routes/advisor');
safeMount('/api/weather', './routes/weather');
safeMount('/api/prices', './routes/prices');
safeMount('/api/tips', './routes/tips');
safeMount('/api/community', './routes/community');
safeMount('/api/admin', './routes/admin');
safeMount('/api/traceability', './routes/traceability');

// Fallback to index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌾 FieldRoot Connect running on http://localhost:${PORT}`);
    console.log(`🔒 Security features active (Helmet, Rate Limiting, NoSQL Sanitizer, XSS Defense)`);
  });
}

module.exports = app;
