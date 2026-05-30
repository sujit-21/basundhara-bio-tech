const AboutSection = require('../models/AboutSection');

// @desc    Get all about sections
// @route   GET /api/about-sections
// @access  Public
const getAboutSections = async (req, res, next) => {
  try {
    const sections = await AboutSection.find({}).sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: sections });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new about section
// @route   POST /api/about-sections
// @access  Private/Admin
const createAboutSection = async (req, res, next) => {
  try {
    const { type, title, content, icon, year, color, order } = req.body;

    const section = new AboutSection({
      type,
      title,
      content,
      icon: icon || '',
      year: year || '',
      color: color || 'success',
      order: order !== undefined ? Number(order) : 0,
    });

    const saved = await section.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update about section
// @route   PUT /api/about-sections/:id
// @access  Private/Admin
const updateAboutSection = async (req, res, next) => {
  try {
    const { type, title, content, icon, year, color, order } = req.body;

    const section = await AboutSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    section.type = type !== undefined ? type : section.type;
    section.title = title !== undefined ? title : section.title;
    section.content = content !== undefined ? content : section.content;
    section.icon = icon !== undefined ? icon : section.icon;
    section.year = year !== undefined ? year : section.year;
    section.color = color !== undefined ? color : section.color;
    section.order = order !== undefined ? Number(order) : section.order;

    const updated = await section.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete about section
// @route   DELETE /api/about-sections/:id
// @access  Private/Admin
const deleteAboutSection = async (req, res, next) => {
  try {
    const section = await AboutSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ success: false, message: 'Section not found' });
    }

    await AboutSection.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Section removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAboutSections,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
};
