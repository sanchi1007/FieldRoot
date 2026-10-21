const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fieldroot_connect';

  if (!process.env.MONGODB_URI && process.env.NODE_ENV === 'production') {
    console.error('❌ MONGODB_URI environment variable is missing in deployment settings!');
    console.error('Please configure MONGODB_URI in your Vercel / Render Environment Variables tab.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
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
    process.exit(1);
  }
};

module.exports = connectDB;
