const mongoose = require('mongoose');

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // If already connected, reuse existing connection (crucial for serverless lambdas)
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (cached.conn) {
    return cached.conn;
  }

  const uri = process.env.MONGODB_URI;

  // On Vercel / Cloud serverless without MONGODB_URI, skip localhost attempt immediately
  if (!uri) {
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      console.warn('⚠️ MONGODB_URI not configured. Serverless running with in-memory demo data.');
      return null;
    }

    // Local development fallback to localhost
    try {
      if (!cached.promise) {
        cached.promise = mongoose.connect('mongodb://localhost:27017/fieldroot_connect', {
          serverSelectionTimeoutMS: 2000,
          bufferCommands: false,
          maxPoolSize: 10
        }).then(m => m);
      }
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (e) {
      cached.promise = null;
      console.warn('Local MongoDB not reachable. Running with fallbacks.');
      return null;
    }
  }

  try {
    if (!cached.promise) {
      cached.promise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
        maxPoolSize: 10
      }).then(m => m);
    }
    cached.conn = await cached.promise;
    console.log(`🌿 MongoDB Connected: ${cached.conn.connection?.host}/${cached.conn.connection?.name}`);
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (error.message.includes('bad auth') || error.message.includes('Authentication failed')) {
      console.error('💡 Tip: Check your MongoDB Atlas username and password in MONGODB_URI.');
      console.error('If your password contains special characters like "@", replace "@" with "%40".');
    } else if (error.message.includes('whitelist') || error.message.includes('selection timed out') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Tip: In MongoDB Atlas, go to Network Access -> Add IP Address -> Choose "Allow Access from Anywhere (0.0.0.0/0)".');
    }
    // Return null so controllers smoothly use their fallback demo mock data
    return null;
  }
};

module.exports = connectDB;
