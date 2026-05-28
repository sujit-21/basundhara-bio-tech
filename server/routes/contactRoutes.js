const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const { validateContact } = require('../middleware/validationMiddleware');

router.route('/')
  .post(validateContact, submitContact)
  .get(protect, isAdmin, getContacts);

router.route('/:id')
  .put(protect, isAdmin, updateContactStatus)
  .delete(protect, isAdmin, deleteContact);

module.exports = router;
