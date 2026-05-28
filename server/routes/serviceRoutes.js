const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getServices)
  .post(protect, isAdmin, createService);

router.route('/:id')
  .get(getServiceById)
  .put(protect, isAdmin, updateService)
  .delete(protect, isAdmin, deleteService);

module.exports = router;
