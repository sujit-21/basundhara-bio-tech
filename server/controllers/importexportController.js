const ImportExport = require('../models/ImportExport');

// @desc    Get all import/export routes and services
// @route   GET /api/importexport
// @access  Public
const getImportExport = async (req, res, next) => {
  try {
    const records = await ImportExport.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: records });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new import/export service
// @route   POST /api/importexport
// @access  Private/Admin
const createImportExport = async (req, res, next) => {
  try {
    const { title, description, destinationCountries, shippingModes, status } = req.body;

    const record = new ImportExport({
      title,
      description,
      destinationCountries: typeof destinationCountries === 'string' ? destinationCountries.split(',').map(c => c.trim()) : destinationCountries,
      shippingModes: typeof shippingModes === 'string' ? shippingModes.split(',').map(m => m.trim()) : shippingModes,
      status,
    });

    const saved = await record.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    next(error);
  }
};

// @desc    Update import/export service
// @route   PUT /api/importexport/:id
// @access  Private/Admin
const updateImportExport = async (req, res, next) => {
  try {
    const { title, description, destinationCountries, shippingModes, status } = req.body;

    const record = await ImportExport.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Import/export service not found' });
    }

    record.title = title !== undefined ? title : record.title;
    record.description = description !== undefined ? description : record.description;
    record.status = status !== undefined ? status : record.status;
    if (destinationCountries !== undefined) {
      record.destinationCountries = typeof destinationCountries === 'string' ? destinationCountries.split(',').map(c => c.trim()) : destinationCountries;
    }
    if (shippingModes !== undefined) {
      record.shippingModes = typeof shippingModes === 'string' ? shippingModes.split(',').map(m => m.trim()) : shippingModes;
    }

    const updated = await record.save();
    res.json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete import/export service
// @route   DELETE /api/importexport/:id
// @access  Private/Admin
const deleteImportExport = async (req, res, next) => {
  try {
    const record = await ImportExport.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Import/export service not found' });
    }

    await ImportExport.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Import/export service removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getImportExport,
  createImportExport,
  updateImportExport,
  deleteImportExport,
};
