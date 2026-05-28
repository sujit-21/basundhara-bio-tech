const express = require('express');
const router = express.Router();
const {
  getOffices,
  createOffice,
  updateOffice,
  deleteOffice,
} = require('../controllers/officeController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getOffices)
  .post(protect, isAdmin, createOffice);

router.route('/:id')
  .put(protect, isAdmin, updateOffice)
  .delete(protect, isAdmin, deleteOffice);

module.exports = router;
