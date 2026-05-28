const express = require('express');
const router = express.Router();
const {
  getResearch,
  getResearchById,
  createResearch,
  updateResearch,
  deleteResearch,
} = require('../controllers/researchController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getResearch)
  .post(protect, isAdmin, createResearch);

router.route('/:id')
  .get(getResearchById)
  .put(protect, isAdmin, updateResearch)
  .delete(protect, isAdmin, deleteResearch);

module.exports = router;
