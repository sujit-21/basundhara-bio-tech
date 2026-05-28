const express = require('express');
const router = express.Router();
const {
  getImportExport,
  createImportExport,
  updateImportExport,
  deleteImportExport,
} = require('../controllers/importexportController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getImportExport)
  .post(protect, isAdmin, createImportExport);

router.route('/:id')
  .put(protect, isAdmin, updateImportExport)
  .delete(protect, isAdmin, deleteImportExport);

module.exports = router;
