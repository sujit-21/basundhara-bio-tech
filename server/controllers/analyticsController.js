const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Research = require('../models/Research');
const Contact = require('../models/Contact');
const ImportExport = require('../models/ImportExport');

// @desc    Get dashboard analytics metrics
// @route   GET /api/analytics
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const userCount = await User.countDocuments({});
    const categoryCount = await Category.countDocuments({});
    const productCount = await Product.countDocuments({});
    const blogCount = await Blog.countDocuments({});
    const researchCount = await Research.countDocuments({});
    const contactCount = await Contact.countDocuments({});
    const importExportCount = await ImportExport.countDocuments({});
    
    // Status counts for contact messages
    const unreadMessages = await Contact.countDocuments({ status: 'unread' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });

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
          blogs: blogCount,
          research: researchCount,
          contacts: contactCount,
          importExport: importExportCount,
        },
        messages: {
          unread: unreadMessages,
          read: readMessages,
          replied: repliedMessages,
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
