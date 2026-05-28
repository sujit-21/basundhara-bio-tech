const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({}).sort({ title: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by id
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res, next) => {
  try {
    const { title, description, icon, details, category } = req.body;

    const serviceExists = await Service.findOne({ title });
    if (serviceExists) {
      return res.status(400).json({ success: false, message: 'Service with this title already exists' });
    }

    const service = new Service({
      title,
      description,
      icon,
      details,
      category,
    });

    const createdService = await service.save();
    res.status(201).json({ success: true, data: createdService });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res, next) => {
  try {
    const { title, description, icon, details, category } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.title = title !== undefined ? title : service.title;
    service.description = description !== undefined ? description : service.description;
    service.icon = icon !== undefined ? icon : service.icon;
    service.details = details !== undefined ? details : service.details;
    service.category = category !== undefined ? category : service.category;

    const updatedService = await service.save();
    res.json({ success: true, data: updatedService });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Service removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
