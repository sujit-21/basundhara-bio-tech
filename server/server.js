const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const blogRoutes = require('./routes/blogRoutes');
const researchRoutes = require('./routes/researchRoutes');
const contactRoutes = require('./routes/contactRoutes');
const importexportRoutes = require('./routes/importexportRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const officeRoutes = require('./routes/officeRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security & Request Limit Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev simplicity, configurable in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Rate limiting to protect endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 10000, // high threshold for development
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Apply rate limiter to API routes (except GET routes if desired, but we can apply it globally to all /api/ paths)
app.use('/api/', apiLimiter);

// Bind Route Handlers (supporting both /api and root paths for deployment compatibility)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/categories', '/categories'], categoryRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/blogs', '/blogs'], blogRoutes);
app.use(['/api/research', '/research'], researchRoutes);
app.use(['/api/contacts', '/contacts'], contactRoutes);
app.use(['/api/importexport', '/importexport'], importexportRoutes);
app.use(['/api/analytics', '/analytics'], analyticsRoutes);
app.use(['/api/offices', '/offices'], officeRoutes);
app.use(['/api/orders', '/orders'], orderRoutes);

// Simple Welcome Route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Basundhara Bio-Tech API Engine',
    status: 'healthy',
    version: '1.0.0'
  });
});

// 404 Route handler for unknown endpoints
app.use((req, res, next) => {
  res.status(404);
  const error = new Error(`API Endpoint Not Found - ${req.originalUrl}`);
  next(error);
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

module.exports = app;
