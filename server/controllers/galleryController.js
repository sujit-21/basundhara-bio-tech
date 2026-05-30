const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryList = async (req, res, next) => {
  try {
    const galleryItems = await Gallery.find({}).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: galleryItems });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res, next) => {
  try {
    const { title, description, category, images, order } = req.body;

    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one image' });
    }

    const item = new Gallery({
      title,
      description,
      category,
      images,
      order: order !== undefined ? Number(order) : 0,
    });

    const saved = await item.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = async (req, res, next) => {
  try {
    const { title, description, category, images, order } = req.body;

    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    item.title = title !== undefined ? title : item.title;
    item.description = description !== undefined ? description : item.description;
    item.category = category !== undefined ? category : item.category;
    item.images = images !== undefined ? images : item.images;
    item.order = order !== undefined ? Number(order) : item.order;

    if (item.images && item.images.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one image' });
    }

    const updated = await item.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }

    await Gallery.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Gallery item removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryList,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
