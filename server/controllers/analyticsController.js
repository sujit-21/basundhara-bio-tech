const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');

const Research = require('../models/Research');
const Contact = require('../models/Contact');
const ImportExport = require('../models/ImportExport');
const Order = require('../models/Order');

// @desc    Get dashboard analytics metrics
// @route   GET /api/analytics
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({});
    const categoryCount = await Category.countDocuments({});
    const productCount = await Product.countDocuments({});

    const researchCount = await Research.countDocuments({});
    const contactCount = await Contact.countDocuments({});
    const importExportCount = await ImportExport.countDocuments({});
    const orderCount = await Order.countDocuments({});
    
    // Status counts for contact messages
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });

    // Status counts and revenue for orders
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const processingOrders = await Order.countDocuments({ status: 'Processing' });
    const shippedOrders = await Order.countDocuments({ status: 'Shipped' });
    const completedOrders = await Order.countDocuments({ status: 'Completed' });
    const cancelledOrders = await Order.countDocuments({ status: 'Cancelled' });

    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$summary.grandTotal' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Category distribution for products
    const productCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Populate category names in distribution
    const populatedProductCategories = await Promise.all(
      productCategories.map(async (item) => {
        const cat = await Category.findById(item._id).select('name');
        return {
          name: cat ? cat.name : 'Uncategorized',
          count: item.count,
        };
      })
    );

    res.json({
      success: true,
      data: {
        counts: {
          users: userCount,
          categories: categoryCount,
          products: productCount,

          research: researchCount,
          contacts: contactCount,
          importExport: importExportCount,
          orders: orderCount,
        },
        messages: {
          unread: unreadMessages,
          read: readMessages,
          replied: repliedMessages,
        },
        orders: {
          total: orderCount,
          pending: pendingOrders,
          processing: processingOrders,
          shipped: shippedOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
          revenue: totalRevenue,
        },
        distributions: {
          products: populatedProductCategories,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminStats,
};

