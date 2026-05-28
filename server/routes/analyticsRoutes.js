const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/analyticsController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.get('/', protect, isAdmin, getAdminStats);

module.exports = router;
