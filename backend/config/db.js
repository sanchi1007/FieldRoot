const mongoose = require('mongoose');

let cachedConnection = null;

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for serverless lambdas)
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fieldroot_connect';

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    console.warn('⚠️ MONGODB_URI environment variable is not defined in production settings.');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: true,
      maxPoolSize: 10
    });
    cachedConnection = conn;
    console.log(`🌿 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('💡 Tip: Check your MongoDB Atlas username and password in MONGODB_URI.');
      console.error('If your password contains special characters like "@", replace "@" with "%40".');
    } else if (error.message.includes('whitelist') || error.message.includes('selection timed out') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: In MongoDB Atlas, go to Network Access -> Add IP Address -> Choose "Allow Access from Anywhere (0.0.0.0/0)".');
    }
    // Do NOT call process.exit(1) in serverless! Rethrow so the app can handle it gracefully.
    throw error;
  }
};

module.exports = connectDB;
