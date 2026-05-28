const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, subCategories } = req.body;

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    const category = new Category({
      name,
      description,
      image,
      subCategories: subCategories || [],
    });

    const savedCategory = await category.save();
    res.status(201).json({ success: true, data: savedCategory });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, subCategories } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    category.name = name !== undefined ? name : category.name;
    category.description = description !== undefined ? description : category.description;
    category.image = image !== undefined ? image : category.image;
    category.subCategories = subCategories !== undefined ? subCategories : category.subCategories;

    const updated = await category.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
