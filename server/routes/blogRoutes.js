const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/blogController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getBlogs)
  .post(protect, isAdmin, createBlog);

router.route('/:id')
  .put(protect, isAdmin, updateBlog)
  .delete(protect, isAdmin, deleteBlog);

router.get('/slug/:slug', getBlogBySlug);

module.exports = router;
