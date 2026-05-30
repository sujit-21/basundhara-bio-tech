const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Get all products (with optional search, category filter, and pagination)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search query
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    // Category filter
    if (req.query.category) {
      // Find category by slug/id
      const categoryObj = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }]
      });
      if (categoryObj) {
        query.category = categoryObj._id;
      } else {
        // Return empty dataset if category is specified but doesn't exist
        return res.json({ success: true, data: [], pagination: { total: 0, page, pages: 0, limit } });
      }
    }

    // Sub-category filter
    if (req.query.subCategory) {
      query.subCategory = req.query.subCategory;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, image, images, category, subCategory, specifications, inStock } = req.body;

    const product = new Product({
      title,
      description,
      price,
      image: image || (images && images.length > 0 ? images[0] : ''),
      images: images || [],
      category,
      subCategory,
      specifications: typeof specifications === 'string' ? specifications.split(',').map(s => s.trim()) : specifications,
      inStock,
    });

    const savedProduct = await product.save();
    const populated = await savedProduct.populate('category', 'name slug');
    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { title, description, price, image, images, category, subCategory, specifications, inStock } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    product.title = title !== undefined ? title : product.title;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? price : product.price;
    product.images = images !== undefined ? images : product.images;
    product.image = image !== undefined ? image : (product.images && product.images.length > 0 ? product.images[0] : '');
    product.category = category !== undefined ? category : product.category;
    product.subCategory = subCategory !== undefined ? subCategory : product.subCategory;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    if (specifications !== undefined) {
      product.specifications = typeof specifications === 'string' ? specifications.split(',').map(s => s.trim()) : specifications;
    }

    const updatedProduct = await product.save();
    const populated = await updatedProduct.populate('category', 'name slug');
    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Product removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
