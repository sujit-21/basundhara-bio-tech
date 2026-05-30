const express = require('express');
const router = express.Router();
const {
  getAboutSections,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
} = require('../controllers/aboutSectionController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAboutSections)
  .post(protect, isAdmin, createAboutSection);

router.route('/:id')
  .put(protect, isAdmin, updateAboutSection)
  .delete(protect, isAdmin, deleteAboutSection);

module.exports = router;
