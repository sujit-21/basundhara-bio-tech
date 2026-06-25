const Contact = require('../models/Contact');

// @desc    Submit a new contact message
// @route   POST /api/contacts
// @access  Public
const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    await contact.save();
    res.status(201).json({ success: true, message: 'Message sent successfully. We will contact you soon.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all contact messages (with pagination)
// @route   GET /api/contacts
// @access  Private/Admin
const getContacts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Contact.countDocuments({});
    const contacts = await Contact.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: contacts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update contact message status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    contact.status = status;
    const updatedContact = await contact.save();

    res.json({ success: true, data: updatedContact });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    await Contact.deleteOne({ _id: req.params.id });
    res.json({ success: true, message: 'Message removed' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact,
};
