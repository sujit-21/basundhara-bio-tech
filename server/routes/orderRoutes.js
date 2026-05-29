const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Route for creating a new order (Public)
router.route('/')
  .post(createOrder)
  // Route for listing all orders (Admin only)
  .get(protect, isAdmin, getOrders);

// Admin-only endpoints for single order operations
router.route('/:id')
  .get(protect, isAdmin, getOrderById)
  .put(protect, isAdmin, updateOrderStatus)
  .delete(protect, isAdmin, deleteOrder);

module.exports = router;
