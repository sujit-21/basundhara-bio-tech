const Order = require('../models/Order');

// @desc    Create a new product order
// @route   POST /api/orders
// @access  Public (or authenticated user if token provided)
const createOrder = async (req, res, next) => {
  try {
    const { customer, items, summary, orderNumber } = req.body;

    if (!customer || !items || !summary) {
      return res.status(400).json({ success: false, message: 'Please provide customer, items and summary data' });
    }

    if (items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    // Generate unique order number if not supplied
    const finalOrderNumber = orderNumber || 'BBT-' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      orderNumber: finalOrderNumber,
      user: req.user ? req.user._id : undefined,
      customer,
      items,
      summary,
    });

    const savedOrder = await order.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (with pagination, search, status filter)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const query = {};

    // Search query (orderNumber, customer name, customer email)
    if (req.query.search) {
      query.$or = [
        { orderNumber: { $regex: req.query.search, $options: 'i' } },
        { 'customer.name': { $regex: req.query.search, $options: 'i' } },
        { 'customer.email': { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Status filter
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await Order.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Order removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
