const express = require('express');
const router = express.Router();
const {
  getAboutList,
  createAboutMember,
  updateAboutMember,
  deleteAboutMember,
} = require('../controllers/aboutController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAboutList)
  .post(protect, isAdmin, createAboutMember);

router.route('/:id')
  .put(protect, isAdmin, updateAboutMember)
  .delete(protect, isAdmin, deleteAboutMember);

module.exports = router;
