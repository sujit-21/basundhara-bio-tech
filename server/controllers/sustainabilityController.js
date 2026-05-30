const Sustainability = require('../models/Sustainability');

// @desc    Get all sustainability sections
// @route   GET /api/sustainability
// @access  Public
const getSustainabilityList = async (req, res, next) => {
  try {
    const items = await Sustainability.find({}).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new sustainability section/initiative
// @route   POST /api/sustainability
// @access  Private/Admin
const createSustainabilityItem = async (req, res, next) => {
  try {
    const { type, title, description, impact, icon, order } = req.body;

    const item = new Sustainability({
      type,
      title,
      description,
      impact: impact || '',
      icon: icon || 'bi-recycle',
      order: order !== undefined ? Number(order) : 0,
    });

    const saved = await item.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update sustainability section/initiative
// @route   PUT /api/sustainability/:id
// @access  Private/Admin
const updateSustainabilityItem = async (req, res, next) => {
  try {
    const { type, title, description, impact, icon, order } = req.body;

    const item = await Sustainability.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Sustainability item not found' });
    }

    item.type = type !== undefined ? type : item.type;
    item.title = title !== undefined ? title : item.title;
    item.description = description !== undefined ? description : item.description;
    item.impact = impact !== undefined ? impact : item.impact;
    item.icon = icon !== undefined ? icon : item.icon;
    item.order = order !== undefined ? Number(order) : item.order;

    const updated = await item.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete sustainability section/initiative
// @route   DELETE /api/sustainability/:id
// @access  Private/Admin
const deleteSustainabilityItem = async (req, res, next) => {
  try {
    const item = await Sustainability.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Sustainability item not found' });
    }

    await Sustainability.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Sustainability item removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSustainabilityList,
  createSustainabilityItem,
  updateSustainabilityItem,
  deleteSustainabilityItem,
};
