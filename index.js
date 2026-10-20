const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Ensure uploads and images directories exist
const uploadDir = path.join(__dirname, 'uploads');
const imagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

// Connect to MongoDB
connectDB();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve Static Frontend and Uploaded Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    app: 'FieldRoot Connect API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Dynamic Route Loader Helper to mount API routes safely as they are built
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

// Fallback to index.html for frontend single-page or static routing if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🌾 FieldRoot Connect running on http://localhost:${PORT}`);
    console.log(`🌿 Farmer-first herbal cosmetics agri platform ready`);
  });
}

module.exports = app;
