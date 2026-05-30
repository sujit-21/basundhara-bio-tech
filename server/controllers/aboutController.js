const About = require('../models/About');

// @desc    Get all about page members
// @route   GET /api/about
// @access  Public
const getAboutList = async (req, res, next) => {
  try {
    const aboutList = await About.find({}).sort({ createdAt: 1 });
    res.json({ success: true, data: aboutList });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new about page member
// @route   POST /api/about
// @access  Private/Admin
const createAboutMember = async (req, res, next) => {
  try {
    const { name, role, qualification, bio, icon, image } = req.body;

    const member = new About({
      name,
      role,
      qualification,
      bio,
      icon: icon || 'bi-person',
      image: image || '',
    });

    const saved = await member.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update about page member
// @route   PUT /api/about/:id
// @access  Private/Admin
const updateAboutMember = async (req, res, next) => {
  try {
    const { name, role, qualification, bio, icon, image } = req.body;

    const member = await About.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    member.name = name !== undefined ? name : member.name;
    member.role = role !== undefined ? role : member.role;
    member.qualification = qualification !== undefined ? qualification : member.qualification;
    member.bio = bio !== undefined ? bio : member.bio;
    member.icon = icon !== undefined ? icon : member.icon;
    member.image = image !== undefined ? image : member.image;

    const updated = await member.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete about page member
// @route   DELETE /api/about/:id
// @access  Private/Admin
const deleteAboutMember = async (req, res, next) => {
  try {
    const member = await About.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    await About.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAboutList,
  createAboutMember,
  updateAboutMember,
  deleteAboutMember,
};
