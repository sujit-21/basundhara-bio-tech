const express = require('express');
const router = express.Router();
const {
  getGalleryList,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getGalleryList)
  .post(protect, isAdmin, createGalleryItem);

router.route('/:id')
  .put(protect, isAdmin, updateGalleryItem)
  .delete(protect, isAdmin, deleteGalleryItem);

module.exports = router;
