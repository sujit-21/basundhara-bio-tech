const express = require('express');
const router = express.Router();
const {
  getSustainabilityList,
  createSustainabilityItem,
  updateSustainabilityItem,
  deleteSustainabilityItem,
} = require('../controllers/sustainabilityController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getSustainabilityList)
  .post(protect, isAdmin, createSustainabilityItem);

router.route('/:id')
  .put(protect, isAdmin, updateSustainabilityItem)
  .delete(protect, isAdmin, deleteSustainabilityItem);

module.exports = router;
