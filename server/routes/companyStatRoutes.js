const express = require('express');
const router = express.Router();
const {
  getStats,
  createStat,
  updateStat,
  deleteStat
} = require('../controllers/companyStatController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getStats)
  .post(protect, isAdmin, createStat);

router.route('/:id')
  .put(protect, isAdmin, updateStat)
  .delete(protect, isAdmin, deleteStat);

module.exports = router;
