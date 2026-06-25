const CompanyStat = require('../models/CompanyStat');

// @desc    Get all company stats
// @route   GET /api/company-stats
// @access  Public
exports.getStats = async (req, res) => {
  try {
    const stats = await CompanyStat.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create a new company stat
// @route   POST /api/company-stats
// @access  Private/Admin
exports.createStat = async (req, res) => {
  try {
    const stat = await CompanyStat.create(req.body);
    res.status(201).json({ success: true, data: stat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update a company stat
// @route   PUT /api/company-stats/:id
// @access  Private/Admin
exports.updateStat = async (req, res) => {
  try {
    const stat = await CompanyStat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!stat) {
      return res.status(404).json({ success: false, message: 'Stat not found' });
    }

    res.status(200).json({ success: true, data: stat });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a company stat
// @route   DELETE /api/company-stats/:id
// @access  Private/Admin
exports.deleteStat = async (req, res) => {
  try {
    const stat = await CompanyStat.findByIdAndDelete(req.params.id);

    if (!stat) {
      return res.status(404).json({ success: false, message: 'Stat not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
