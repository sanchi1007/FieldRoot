// Serverless entry point for Vercel deployment
const connectDB = require('../backend/config/db.js');
const app = require('../backend/index.js');

module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Serverless DB connection notice:', err.message);
  }
  return app(req, res);
};
