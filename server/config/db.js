const mongoose = require('mongoose');
const dns = require('dns');

// Configure custom DNS servers to bypass local ISP blocks on SRV records, but only in local environments
if (process.env.NODE_ENV !== 'production') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (err) {
    console.warn('Could not set DNS servers', err);
  }
}

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined in environment variables');
    throw new Error('MONGODB_URI missing');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

module.exports = connectDB;
