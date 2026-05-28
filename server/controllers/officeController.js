const Office = require('../models/Office');

// @desc    Get all offices
// @route   GET /api/offices
// @access  Public
const getOffices = async (req, res, next) => {
  try {
    const offices = await Office.find({}).sort({ createdAt: 1 });
    res.json({ success: true, data: offices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new office
// @route   POST /api/offices
// @access  Private/Admin
const createOffice = async (req, res, next) => {
  try {
    const { title, address, phone, email } = req.body;

    const office = new Office({
      title,
      address,
      phone,
      email,
    });

    const savedOffice = await office.save();
    res.status(201).json({ success: true, data: savedOffice });
  } catch (error) {
    next(error);
  }
};

// @desc    Update office
// @route   PUT /api/offices/:id
// @access  Private/Admin
const updateOffice = async (req, res, next) => {
  try {
    const { title, address, phone, email } = req.body;

    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }

    office.title = title !== undefined ? title : office.title;
    office.address = address !== undefined ? address : office.address;
    office.phone = phone !== undefined ? phone : office.phone;
    office.email = email !== undefined ? email : office.email;

    const updated = await office.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete office
// @route   DELETE /api/offices/:id
// @access  Private/Admin
const deleteOffice = async (req, res, next) => {
  try {
    const office = await Office.findById(req.params.id);
    if (!office) {
      return res.status(404).json({ success: false, message: 'Office not found' });
    }

    await Office.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Office removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice,
};
